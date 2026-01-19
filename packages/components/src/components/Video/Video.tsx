import React from 'react';

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
}

export const Video: React.FC<VideoProps> = ({ src, className, autoPlay, loop, ...props }) => {
  return (
    <video
      src={src}
      playsInline
      width="100%"
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      {...props}
    />
  );
};
