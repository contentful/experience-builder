import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import { AssetFile } from 'contentful';

export type ValidFormats = (typeof SUPPORTED_IMAGE_FORMATS)[number];

export interface AssetFileWithRequiredImage extends AssetFile {
  details: Required<AssetFile['details']>;
}

export function validateParams(
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
