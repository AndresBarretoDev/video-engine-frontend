import React from 'react';
import { OffthreadVideo, Video, Sequence, AbsoluteFill } from 'remotion';
import type { VideoClipProps } from './video-clip.schema';

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * VideoClip — renders a video segment with frame-accurate playback.
 *
 * Uses <OffthreadVideo> by default for:
 * - Frame-accurate rendering in Lambda
 * - Alpha channel support via `transparent` prop (ProRes/WebM with hasAlpha=true)
 *
 * Falls back to <Video> when `loop=true` because OffthreadVideo does not
 * support looping natively.
 *
 * `startFrom` maps to Remotion's `trimBefore` prop (startFrom is deprecated).
 * `endAt` is enforced by wrapping in a <Sequence durationInFrames={endAt - startFrom}>.
 * objectFit is applied via style.
 */
export const VideoClip: React.FC<VideoClipProps> = ({
  src,
  startFrom,
  endAt,
  volume,
  playbackRate,
  objectFit,
  hasAlpha,
  loop
}) => {
  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit
  };

  // Use <Video> when loop is required (OffthreadVideo lacks loop support)
  const videoElement = loop ? (
    <Video
      src={src}
      trimBefore={startFrom}
      volume={volume}
      playbackRate={playbackRate}
      loop
      style={videoStyle}
    />
  ) : (
    <OffthreadVideo
      src={src}
      trimBefore={startFrom}
      volume={volume}
      playbackRate={playbackRate}
      transparent={hasAlpha}
      style={videoStyle}
    />
  );

  // Wrap in a Sequence to truncate at endAt when specified
  if (endAt !== undefined) {
    const durationInFrames = endAt - startFrom;
    return (
      <AbsoluteFill>
        <Sequence durationInFrames={durationInFrames}>{videoElement}</Sequence>
      </AbsoluteFill>
    );
  }

  return <AbsoluteFill>{videoElement}</AbsoluteFill>;
};
