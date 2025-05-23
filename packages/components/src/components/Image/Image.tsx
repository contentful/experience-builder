import React from 'react';
import { combineClasses } from '@/utils/combineClasses';
import { OptimizedImageAsset } from '@contentful/experiences-core/types';
import './Image.css';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  cfImageAsset?: OptimizedImageAsset | string;
}

export const Image: React.FC<ImageProps> = ({ className = '', src, cfImageAsset, ...props }) => {
  if (!cfImageAsset && !src) {
    return (
      <div className={combineClasses('cf-placeholder-wrapper', className)}>
        <img
          className={'cf-placeholder-image'}
          src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAA"
          {...props}
        />
        <svg
          className="cf-placeholder-icon"
          fill="none"
          viewBox="0 0 17 16"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#fff"
            d="M13.5 2h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-10 1h10v4.836l-1.543-1.543a1 1 0 0 0-1.414 0L3.836 13H3.5zm10 10H5.25l6-6 2.25 2.25zm-7-5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1"
          />
        </svg>
      </div>
    );
  }

  const imageClasses = combineClasses('cf-image', className);

  if (typeof cfImageAsset === 'string') {
    return <img src={cfImageAsset} className={imageClasses} {...props} />;
  }

  if (cfImageAsset) {
    return (
      <img
        src={cfImageAsset.url}
        srcSet={cfImageAsset.srcSet?.length ? cfImageAsset.srcSet?.join(', ') : undefined}
        sizes={cfImageAsset.sizes ? cfImageAsset.sizes : undefined}
        loading={cfImageAsset.loading}
        className={imageClasses}
        {...props}
      />
    );
  }

  if (src) {
    return <img src={src} className={imageClasses} {...props} />;
  }
};
