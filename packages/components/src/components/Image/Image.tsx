import { OptimizedImageAsset } from '@contentful/experience-builder-core/types';
import React from 'react';
import './Image.css';
import { constants } from '@/utils/constants';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image?: OptimizedImageAsset | string;
}

export const Image: React.FC<ImageProps> = ({ className, src, image, ...props }) => {
  console.log({ image, src, props });
  if (!image && !src) {
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

  if (typeof image === 'string') {
    return (
      <img data-id="image-string" src={image} className={'cf-image ' + className} {...props} />
    );
  }

  if (image) {
    return (
      <img
        data-id="image-object"
        src={image.url}
        srcSet={image.srcSet?.length ? image.srcSet?.join(', ') : undefined}
        sizes={image.sizes ? image.sizes : undefined}
        className={'cf-image ' + className}
        {...props}
      />
    );
  }

  if (src) {
    return <img src={src} className={'cf-image ' + className} {...props} />;
  }
};
