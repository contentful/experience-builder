import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import { OptimizedImageAsset } from '@/types';
import { AssetFile } from 'contentful';
import { getOptimizedImageUrl } from './getOptimizedImageUrl';

type ValidFormats = (typeof SUPPORTED_IMAGE_FORMATS)[number];
interface AssetFileWithRequiredImage extends AssetFile {
  details: Required<AssetFile['details']>;
}

const MAX_WIDTH_ALLOWED = 4000;

export const getOptimizedImageAsset = (
  file: AssetFile,
  sizes?: string,
  quality: number = 100,
  format?: ValidFormats,
): OptimizedImageAsset => {
  if (!validateParams(file, quality, format)) {
    throw Error('Invalid parameters');
  }
  const url = file.url;
  const maxWidth = Math.min(file.details.image.width, MAX_WIDTH_ALLOWED);
  const numOfParts = Math.max(2, Math.ceil(maxWidth / 500));
  const widthParts = Array.from({ length: numOfParts }, (_, index) =>
    Math.ceil((index + 1) * (maxWidth / numOfParts)),
  );
  const srcSet = sizes
    ? widthParts.map((width) => `${getOptimizedImageUrl(url, width, quality, format)} ${width}w`)
    : [];

  const intrinsicImageWidth = file.details.image.width;

  if (intrinsicImageWidth > MAX_WIDTH_ALLOWED) {
    srcSet.push(`${getOptimizedImageUrl(url, undefined, quality, format)} ${intrinsicImageWidth}w`);
  }

  const returnedUrl = getOptimizedImageUrl(
    url,
    file.details.image.width > 2000 ? 2000 : undefined,
    quality,
    format,
  );

  return {
    url: returnedUrl,
    srcSet,
    file,
  };

  function validateParams(
    file: AssetFile,
    quality: number,
    format?: ValidFormats,
  ): file is AssetFileWithRequiredImage {
    if (!file.details.image) {
      throw Error('No image in file asset to transform');
    }
    if (quality < 0 || quality > 100) {
      throw Error('Quality must be between 0 and 100');
    }
    if (format && !SUPPORTED_IMAGE_FORMATS.includes(format)) {
      throw Error(`Format must be one of ${SUPPORTED_IMAGE_FORMATS.join(', ')}`);
    }
    return true;
  }
};
