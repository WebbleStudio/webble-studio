import React from 'react';

interface OptimizedVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  poster?: string;
  style?: React.CSSProperties;
}

export default function OptimizedVideo({
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  playsInline = true,
  poster,
  style,
}: OptimizedVideoProps) {
  return (
    <video
      src={src}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
      poster={poster}
      style={style}
    >
      Il tuo browser non supporta il tag video.
    </video>
  );
}
