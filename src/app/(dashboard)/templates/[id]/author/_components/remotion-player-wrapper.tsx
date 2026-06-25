'use client';

/**
 * RemotionPlayerWrapper — wraps @remotion/player with ANY template organism.
 *
 * The organism to render is passed in via `component` (resolved from the template
 * authoring registry by componentId). This used to be hardcoded to
 * LoopingProductPromo — which made every template preview the OP product video.
 *
 * Receives pre-assembled compositionProps (output of a registry assembleProps()).
 * Keeps preview in sync with the form via controlled inputProps.
 *
 * Fix (Phase 6): Preview is now CONTAINED — bounded by both max-width AND max-height
 * so that 9:16 and 1:1 formats never overflow the column. The player scales via
 * object-fit: contain semantics using CSS aspect-ratio inside a constrained flex parent.
 *
 * Phase 4 (brand-identity-engine): loads brand font URLs from brandConfig.assets.fonts
 * so brand typography actually shows in the preview. Graceful: no-op when absent.
 * Render-side font loading is out of scope (render is mock).
 *
 * Design ref: design.md §Data Flow — "@remotion/player (preview viva)"
 * Spec: "preview text MUST update within 400ms without a save action"
 * Task: 4.4 + 6.0 fix (golden-path-video-generation) + multi-template authoring
 */

import { useEffect } from 'react';
import { Player } from '@remotion/player';
import type { TemplateCompositionRef } from '@/domains/templates/types';
import type { AssembledTemplateProps } from '@/domains/video-generation/types';
import { videoGenerationTextMaps as t } from '@/domains/video-generation/text-maps';
import { Skeleton } from '@/components/ui/skeleton';

// ─── Font loader hook (Phase 4 — brand-identity-engine) ─────────────────────

/**
 * Injects brand font URLs as <link rel="stylesheet"> elements into the document
 * head so that @remotion/player preview shows brand typography.
 *
 * Supports Google Fonts CSS URLs and any other CSS stylesheet URL.
 * Graceful: no-op when fontUrls is empty or undefined.
 * Cleanup: removes injected links on unmount or when fontUrls changes.
 *
 * Note: render-side font loading (Remotion Lambda / local render) is out of scope
 * here — fonts there are loaded via Remotion's delayRender/continueRender or the
 * @remotion/google-fonts package. That path is flagged for the local-render slice.
 */
function useBrandFonts(fontUrls: string[] | undefined): void {
  useEffect(() => {
    if (!fontUrls || fontUrls.length === 0) return;

    const injected: HTMLLinkElement[] = [];

    for (const url of fontUrls) {
      // Avoid duplicate injection — check if a link for this href already exists
      if (document.querySelector(`link[href="${url}"]`)) continue;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute('data-brand-font', 'true');
      document.head.appendChild(link);
      injected.push(link);
    }

    return () => {
      // Remove only the links we injected this render cycle
      for (const link of injected) {
        link.remove();
      }
    };
  }, [fontUrls?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface RemotionPlayerWrapperProps {
  /** The organism to render (from the template authoring registry). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  compositionRef: TemplateCompositionRef;
  compositionProps: AssembledTemplateProps;
  /** Clamps the preview height. Defaults to 70dvh — fits 9:16 on laptop screens without scroll. */
  maxHeightClass?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * How the contain layout works:
 *
 * Outer shell (flex column, items-center): centers the player horizontally
 * and caps total height with max-h-[var] so the column never grows past it.
 *
 * Inner player box: width="100%", aspect-ratio set inline. The combination of
 * `w-full max-w-full` + `aspect-ratio` means the box starts at 100% width and
 * then the browser clips its height to match the aspect ratio. For 9:16 (0.5625)
 * the width would produce a very tall box — but the outer max-height creates an
 * overflow:hidden boundary so the box never actually renders taller than the cap.
 *
 * The Remotion Player itself uses width/height 100% to fill whatever box it gets,
 * so it scales cleanly without producing scroll.
 */
export function RemotionPlayerWrapper({
  component,
  compositionRef,
  compositionProps,
  maxHeightClass = 'max-h-[70dvh]'
}: RemotionPlayerWrapperProps) {
  const { width, height, durationInFrames, fps } = compositionRef;
  const aspectRatio = width / height;

  // Phase 4: load brand fonts into the preview so typography actually shows.
  // Reads assets.fonts from brandConfig when present; graceful no-op if absent.
  const brandFontUrls = (compositionProps as { brandConfig?: { assets?: { fonts?: string[] } } })
    ?.brandConfig?.assets?.fonts;
  useBrandFonts(brandFontUrls);

  return (
    // Outer shell: caps total height, centers the inner box
    <div
      className={`flex w-full items-center justify-center overflow-hidden ${maxHeightClass}`}
      role="region"
      aria-label={t.previewAriaLabel}
    >
      {/*
       * Inner box: maintains aspect ratio, never wider than 100%, never taller than parent.
       * For 16:9 (>1) it fills width and height is proportional.
       * For 9:16 (<1) it starts narrow and height matches — both stay inside the cap.
       * For 1:1 it's square at whatever fits.
       */}
      <div
        className="w-full overflow-hidden rounded-[var(--radius-12)] border border-border bg-[var(--color-surface-1,hsl(var(--muted)))/20]"
        style={{
          aspectRatio,
          maxHeight: '100%',
          // For portrait formats: limit width so height fits within the cap.
          // maxWidth derived from aspect ratio × maxHeight (browser handles this via aspect-ratio+max-height).
          maxWidth: aspectRatio < 1 ? `calc(70dvh * ${aspectRatio})` : '100%'
        }}
      >
        <Player
          component={component}
          inputProps={compositionProps}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={width}
          compositionHeight={height}
          style={{ width: '100%', height: '100%' }}
          controls={false}
          autoPlay
          loop
          clickToPlay={false}
          numberOfSharedAudioTags={0}
          renderLoading={() => (
            <Skeleton className="absolute inset-0 rounded-none" />
          )}
        />
      </div>
    </div>
  );
}
