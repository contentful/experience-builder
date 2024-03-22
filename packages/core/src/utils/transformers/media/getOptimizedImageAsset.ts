import { OptimizedImageAsset } from '@/types';
import { AssetFile } from 'contentful';
import { getOptimizedImageUrl } from './getOptimizedImageUrl';
import { ValidFormats, validateParams } from './mediaUtils';

const MAX_WIDTH_ALLOWED = 4000;

export const getOptimizedImageAsset = (
  file: AssetFile,
  sizes?: string,
  quality: string = '100%',
  format?: ValidFormats,
): OptimizedImageAsset => {
  const qualityNumber = Number(quality.replace('%', ''));
  if (!validateParams(file, qualityNumber, format)) {
    throw Error('Invalid parameters');
  }
  const url = file.url;
  const maxWidth = Math.min(file.details.image.width, MAX_WIDTH_ALLOWED);
  const numOfParts = Math.max(2, Math.ceil(maxWidth / 500));
  const widthParts = Array.from({ length: numOfParts }, (_, index) =>
    Math.ceil((index + 1) * (maxWidth / numOfParts)),
  );
  const srcSet = sizes
    ? widthParts.map(
        (width) => `${getOptimizedImageUrl(url, width, qualityNumber, format)} ${width}w`,
      )
    : [];

  const intrinsicImageWidth = file.details.image.width;

  if (intrinsicImageWidth > MAX_WIDTH_ALLOWED) {
    srcSet.push(
      `${getOptimizedImageUrl(url, undefined, qualityNumber, format)} ${intrinsicImageWidth}w`,
    );
  }

  const returnedUrl = getOptimizedImageUrl(
    url,
    file.details.image.width > 2000 ? 2000 : undefined,
    qualityNumber,
    format,
  );

  const optimizedImageAsset: OptimizedImageAsset = {
    url: returnedUrl,
    srcSet,
    sizes,
    file,
  };

  return optimizedImageAsset;
};
