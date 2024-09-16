// import React from 'react';
import { OptimizedImageAsset } from '../../../core/dist/types';

interface Props {
  text: string;
  cfImageAsset?: OptimizedImageAsset;
}

export const Foo = ({ text, cfImageAsset }: Props) => {
  if (!cfImageAsset) {
    return (
      <div className="cf-no-image">
        <svg fill="none" viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#fff"
            d="M13.5 2h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1m-10 1h10v4.836l-1.543-1.543a1 1 0 0 0-1.414 0L3.836 13H3.5zm10 10H5.25l6-6 2.25 2.25zm-7-5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m0-2a.5.5 0 1 1 0 1 .5.5 0 0 1 0-1"
          />
        </svg>
      </div>
    );
  }

  if (typeof cfImageAsset === 'string') {
    return <img src={cfImageAsset} className={'cf-image '} />;
  }

  return (
    <div>
      <h1>Foo</h1>
      <img
        src={cfImageAsset.url}
        srcSet={cfImageAsset.srcSet?.length ? cfImageAsset.srcSet?.join(', ') : undefined}
        sizes={cfImageAsset.sizes ? cfImageAsset.sizes : undefined}
        loading={cfImageAsset.loading}
        className={'cf-image '}
      />
      {text}
    </div>
  );
};
