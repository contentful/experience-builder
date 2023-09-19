import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  url: string;
}

export const Image: React.FC<ImageProps> = ({ url, ...props }) => {
  if (!url) {
    return null;
  }

  return <img src={url} {...props} />;
};

export default Image;
