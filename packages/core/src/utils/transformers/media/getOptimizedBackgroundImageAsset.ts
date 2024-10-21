import { OptimizedBackgroundImageAsset } from '@/types';
import { getOptimizedImageUrl } from './getOptimizedImageUrl';
import { AssetFile } from 'contentful';
import { ValidFormats, validateParams, AssetFileWithRequiredImage } from './mediaUtils';

const MAX_WIDTH_ALLOWED = 2000;

export const getOptimizedBackgroundImageAsset = (
  file: AssetFile,
  widthStyle: string,
  quality: string = '100%',
  format?: ValidFormats,
): OptimizedBackgroundImageAsset => {
  const qualityNumber = Number(quality.replace('%', ''));
  if (!validateParams(file, qualityNumber, format)) {
    throw Error('Invalid parameters');
  }
  if (!validateParams(file, qualityNumber, format)) {
    throw Error('Invalid parameters');
  }
  const url = file.url;

  const { width1x, width2x } = getWidths(widthStyle, file);

  const imageUrl1x = getOptimizedImageUrl(url, width1x, qualityNumber, format);
  const imageUrl2x = getOptimizedImageUrl(url, width2x, qualityNumber, format);

  const srcSet = [`url(${imageUrl1x}) 1x`, `url(${imageUrl2x}) 2x`];

  const returnedUrl = getOptimizedImageUrl(url, width2x, qualityNumber, format);

  const optimizedBackgroundImageAsset: OptimizedBackgroundImageAsset = {
    url: returnedUrl,
    srcSet,
    file,
  };

  return optimizedBackgroundImageAsset;

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
};
