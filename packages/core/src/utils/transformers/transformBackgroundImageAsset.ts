import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import { OptimizedBackgroundImageAsset } from '@/types';
import { AssetFile } from 'contentful';

interface AssetFileWithRequiredImage extends AssetFile {
  details: Required<AssetFile['details']>;
}
type ValidFormats = (typeof SUPPORTED_IMAGE_FORMATS)[number];

const MAX_WIDTH_ALLOWED = 4000;

export const transformBackgroundImageAsset = (
  file: AssetFile,
  width: number,
  quality: number = 100,
  format?: ValidFormats,
): OptimizedBackgroundImageAsset => {
  if (!validateParams(file, quality, format)) {
    throw Error('Invalid parameters');
  }
  const url = file.url;
  // const maxWidth = Math.min(file.details.image.width, MAX_WIDTH_ALLOWED);
  // const numOfParts = Math.max(2, Math.ceil(maxWidth / 500));
  // const widthParts = Array.from({ length: numOfParts }, (_, index) =>
  //   Math.ceil((index + 1) * (maxWidth / numOfParts)),
  // );
  const srcSet = [
    `url(${url}?w=${width}${quality > 0 && quality !== 100 ? `&q=${quality}` : ''}${format ? `&fm=${format}` : ''}) 1x`,
    `url(${url}?w=${width * 2}${quality > 0 && quality !== 100 ? `&q=${quality}` : ''}${format ? `&fm=${format}` : ''}) 2x`,
  ];
  // const srcSet = sizes
  //   ? widthParts.map(
  //       (width) =>
  //         `${url}?w=${width}${quality > 0 && quality !== 100 ? `&q=${quality}` : ''}${format ? `&fm=${format}` : ''} ${width}w`,
  //     )
  //   : [];

  // if (file.details.image.width > MAX_WIDTH_ALLOWED) {
  //   srcSet.push(
  //     `${url}?${quality > 0 && quality !== 100 ? `&q=${quality}` : ''}${format ? `&fm=${format}` : ''} ${file.details.image.width}w`,
  //   );
  // }

  const returnedUrl = `${url}?${file.details.image.width > 2000 ? `w=2000` : ''}${quality > 0 && quality !== 100 ? `&q=${quality}` : ''}`;

  const optimizedBackgroundImageAsset: OptimizedBackgroundImageAsset = {
    url: returnedUrl,
    srcSet,
    file,
  };

  return optimizedBackgroundImageAsset;

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
