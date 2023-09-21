import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * The URL of the image to display
   * @example
   * ```tsx
   * <Image url="https://placekitten.com/g/200/300" />
   * ```
   */
  url: string;
  width?: number;
  alt?: string;
}

export const Image: React.FC<ImageProps> = ({ url, width, alt, ...props }) => {
  if (!url) {
    return null;
  }

  return <img src={url} width={width ? width : undefined} alt={alt} {...props} />;
};
