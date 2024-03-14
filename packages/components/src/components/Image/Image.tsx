import { ImageOptions } from '@contentful/experiences-core/types';
import React from 'react';
import './Image.css';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  cfImage?: ImageOptions;
}

export const Image: React.FC<ImageProps> = ({ className = '', src, cfImage, ...props }) => {
  if (!cfImage || (!cfImage.asset && !src)) {
    return (
      <div className="cf-no-image">
        <img
          className={className}
          src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAA"
          {...props}
        />
        <svg fill="none" viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#fff"
            d="M13.5 2h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-10 1h10v4.836l-1.543-1.543a1 1 0 0 0-1.414 0L3.836 13H3.5zm10 10H5.25l6-6 2.25 2.25zm-7-5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1"
          />
        </svg>
      </div>
    );
  }

  if (typeof cfImage.asset === 'string') {
    return <img src={cfImage.asset} className={'cf-image ' + className} {...props} />;
  }

  if (cfImage.asset) {
    return (
      <img
        src={cfImage.asset.url}
        srcSet={cfImage.asset.srcSet?.length ? cfImage.asset.srcSet?.join(', ') : undefined}
        sizes={cfImage.targetSize}
        className={'cf-image ' + className}
        {...props}
      />
    );
  }

  if (src) {
    return <img src={src} className={'cf-image ' + className} {...props} />;
  }
};
