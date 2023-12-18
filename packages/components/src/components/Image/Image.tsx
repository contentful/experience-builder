import { combineClasses } from '@/utils/combineClasses';
import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Image: React.FC<ImageProps> = ({ className, src, ...props }) => {
  if (!src) {
    return null;
  }

  const classes = combineClasses('cf-image', className);

  return <img src={src} className={classes} {...props} />;
};
