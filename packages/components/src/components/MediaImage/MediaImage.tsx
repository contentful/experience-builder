import { combineClasses } from '@/utils/combineClasses';
import React from 'react';

export interface MediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const MediaImage: React.FC<MediaImageProps> = ({ className, src, ...props }) => {
  if (!src) {
    return null;
  }

  const classes = combineClasses('cf-media-image', className);

  return <img src={src} className={classes} {...props} />;
};
