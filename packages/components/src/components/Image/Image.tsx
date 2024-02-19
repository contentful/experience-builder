import { OptimizedImageAsset } from '@contentful/experience-builder-core/types';
import React from 'react';
import './Image.css';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image?: OptimizedImageAsset;
}

export const Image: React.FC<ImageProps> = ({ className, src, image, ...props }) => {
  if (!image) {
    return null;
  }

  console.log('Image values', { image, src });

  return (
    <img
      src={image.url}
      srcSet={image.srcSet?.length ? image.srcSet?.join(', ') : undefined}
      sizes={image.sizes ? image.sizes : undefined}
      className={'cf-image'}
      {...props}
    />
  );
};

// //images.flinkly.com/81ib4cnp1lvz/2q8YsBYvy6q1xkUv…59l/ddaaadabc5ca039cca163e81b308cfdc/highfive.png
