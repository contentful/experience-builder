import { OptimizedImageAsset } from '@contentful/experience-builder-core/types';
import React from 'react';
import './Image.css';
import { placeholderImage } from '@/utils/constants';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  cfImageAsset?: OptimizedImageAsset | string;
}

export const Image: React.FC<ImageProps> = ({ className = '', src, cfImageAsset, ...props }) => {
  if (!cfImageAsset && !src) {
    return (
      <div className="cf-no-image-wrapper">
        <img src={placeholderImage} className={'cf-image ' + className} {...props} />
      </div>
    );
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
