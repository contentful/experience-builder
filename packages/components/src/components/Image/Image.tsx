import { OptimizedImageAsset } from '@contentful/experience-builder-core/types';
import React from 'react';
import { placeholderImage } from '@/utils/constants';
import './Image.css';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  cfImageAsset?: OptimizedImageAsset | string;
}

export const Image: React.FC<ImageProps> = ({ className = '', src, cfImageAsset, ...props }) => {
  if (!cfImageAsset && !src) {
    return <img src={placeholderImage} className={'cf-image cf-no-image' + className} {...props} />;
  }

  if (typeof cfImageAsset === 'string') {
    return <img src={cfImageAsset} className={'cf-image ' + className} {...props} />;
  }

  if (cfImageAsset) {
    return (
      <img
        src={cfImageAsset.url}
        srcSet={cfImageAsset.srcSet?.length ? cfImageAsset.srcSet?.join(', ') : undefined}
        sizes={cfImageAsset.sizes ? cfImageAsset.sizes : undefined}
        className={'cf-image ' + className}
        {...props}
      />
    );
  }

  if (src) {
    return <img src={src} className={'cf-image ' + className} {...props} />;
  }
};
