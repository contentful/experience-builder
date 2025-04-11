import React from 'react';
import { OptimizedImageAsset } from '@contentful/experiences-core/types';
import './Image.css';
import { useBoundEntries } from '@/contexts/useBoundEntries';

export function combineClasses(...classes: (string | undefined | null)[]) {
  return classes
    .filter((val) => val)
    .map((c) => c!.trim())
    .join(' ');
}

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  cfImageAsset?: OptimizedImageAsset | string;
}

export const ContextualImage: React.FC<ImageProps> = ({ className = '', ...props }) => {
  const { selectedEntry } = useBoundEntries();

  const src = (selectedEntry?.fields?.image as any)?.fields?.file?.url;

  if (!src) {
    return (
      <>
        <img
          className={combineClasses('cf-placeholder-image', className)}
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
      </>
    );
  }

  const imageClasses = combineClasses('cf-image', className);

  if (src) {
    return <img src={src} className={imageClasses} {...props} />;
  }
};
