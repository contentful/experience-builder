import { PrimitiveValue } from '@/types';
import { Asset, AssetFile, Entry } from 'contentful';
import { get } from '../get';

export const getBoundValue = (entryOrAsset: Entry | Asset, path: string): PrimitiveValue => {
  const value = get<string>(entryOrAsset, path.split('/').slice(2, -1));
  return value && typeof value == 'object' && (value as AssetFile).url
    ? (value as AssetFile).url
    : (value as string | undefined);
};
