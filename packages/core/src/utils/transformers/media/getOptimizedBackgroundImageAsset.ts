import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import { OptimizedImageAsset } from '@/types';
import { getOptimizedImageUrl } from './getOptimizedImageUrl';
import { AssetFile } from 'contentful';

interface AssetFileWithRequiredImage extends AssetFile {
  details: Required<AssetFile['details']>;
}
type ValidFormats = (typeof SUPPORTED_IMAGE_FORMATS)[number];

const MAX_WIDTH_ALLOWED = 2000;

export const getOptimizedBackgroundImageAsset = (
  file: AssetFile,
  widthStyle: string,
  quality: number = 100,
  format?: ValidFormats,
): OptimizedImageAsset => {
  if (!validateParams(file, quality, format)) {
    throw Error('Invalid parameters');
  }
  const url = file.url;

  const { width1x, width2x } = getWidths(widthStyle, file);

  const imageUrl1x = getOptimizedImageUrl(url, width1x, quality, format);
  const imageUrl2x = getOptimizedImageUrl(url, width2x, quality, format);

  const srcSet = [`url(${imageUrl1x}) 1x`, `url(${imageUrl2x}) 2x`];

  const returnedUrl = getOptimizedImageUrl(url, width2x, quality, format);

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

function getWidths(widthStyle: string, file: AssetFileWithRequiredImage) {
  let width1x = 0;
  let width2x = 0;
  const intrinsicImageWidth = file.details.image.width;
  if (widthStyle.endsWith('px')) {
    width1x = Math.min(Number(widthStyle.replace('px', '')), intrinsicImageWidth);
  } else {
    width1x = Math.min(MAX_WIDTH_ALLOWED, intrinsicImageWidth);
  }
  width2x = Math.min(width1x * 2, intrinsicImageWidth);
  return { width1x, width2x };
}
