import { OptimizedImageAsset } from '@contentful/experience-builder-core/types';
import React from 'react';
import './Image.css';
import { constants } from '@/utils/constants';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  cfImageAsset?: OptimizedImageAsset | string;
}

export const Image: React.FC<ImageProps> = ({ className, src, cfImageAsset, ...props }) => {
  console.log('Image', { className, src, cfImageAsset, props });
  if (!cfImageAsset && !src) {
    return (
      <div className="cf-no-image-wrapper">
        <img
          data-id="no-img"
          src={constants.placeholderImage}
          className={'cf-image ' + className}
          {...props}
        />
      </div>
    );
  }

  if (typeof cfImageAsset === 'string') {
    return (
      <img
        data-id="image-string"
        src={cfImageAsset}
        className={'cf-image ' + className}
        {...props}
      />
    );
  }

  if (cfImageAsset) {
    return (
      <img
        data-id="image-object"
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
