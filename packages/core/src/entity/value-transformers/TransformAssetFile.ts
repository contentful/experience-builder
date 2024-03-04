import { AssetFile } from 'contentful';

export function transformAssetFileToUrl(
  fieldValue: string | AssetFile | undefined,
): string | undefined {
  return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
    ? (fieldValue as AssetFile).url
    : (fieldValue as string | undefined);
}
