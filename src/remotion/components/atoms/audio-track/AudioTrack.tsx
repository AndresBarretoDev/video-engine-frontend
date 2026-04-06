import React from 'react';
import { Audio, useVideoConfig, interpolate } from 'remotion';
import type { AudioTrackProps } from './audio-track.schema';

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AudioTrack — renders an audio element with optional fade-in and fade-out.
 *
 * No visual output (returns null for the visual layer).
 * Volume is controlled via a callback function passed to Remotion's <Audio>.
 *
 * Fade overlap guard: if fadeInDuration + fadeOutDuration >= totalFrames,
 * the fade-out start is clamped to fadeInDuration + 1 to prevent silence.
 */
export const AudioTrack: React.FC<AudioTrackProps> = ({
  src,
  volume,
  fadeInDuration,
  fadeOutDuration,
  startFrom,
  loop
}) => {
  const { durationInFrames } = useVideoConfig();

  // Guard against fade overlap: clamp fade-out start if necessary
  const safeStartFadeOut =
    fadeInDuration + fadeOutDuration >= durationInFrames
      ? fadeInDuration + 1
      : durationInFrames - fadeOutDuration;

  const volumeCallback = (frame: number): number => {
    // Fade in
    if (fadeInDuration > 0 && frame < fadeInDuration) {
      return interpolate(frame, [0, fadeInDuration], [0, volume], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      });
    }

    // Fade out
    if (fadeOutDuration > 0 && frame >= safeStartFadeOut) {
      return interpolate(
        frame,
        [safeStartFadeOut, durationInFrames],
        [volume, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        }
      );
    }

    return volume;
  };

  return (
    <Audio
      src={src}
      startFrom={startFrom}
      loop={loop}
      volume={volumeCallback}
    />
  );
};
