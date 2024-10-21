import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import {
  BackgroundImageOptions,
  BoundComponentPropertyTypes,
  ComponentTreeNode,
  ImageOptions,
  ResolveDesignValueType,
} from '@/types';
import { Asset, AssetFile } from 'contentful';
import { getOptimizedBackgroundImageAsset } from './getOptimizedBackgroundImageAsset';
import { getOptimizedImageAsset } from './getOptimizedImageAsset';
import { getBoundValue } from '@/utils/transformers/getBoundValue';
import { isDeepPath, lastPathNamedSegmentEq } from '@/utils';
import { ValidFormats } from './mediaUtils';

export const transformMedia = (
  asset: Asset,
  variables: ComponentTreeNode['variables'],
  resolveDesignValue: ResolveDesignValueType,
  variableName: string,
  path: string,
) => {
  let value: BoundComponentPropertyTypes;

  // If it is not a deep path and not pointing to the file of the asset,
  // it is just pointing to a normal field and therefore we just resolve the value as normal field
  if (!isDeepPath(path) && !lastPathNamedSegmentEq(path, 'file')) {
    return getBoundValue(asset, path);
  }

  //TODO: this will be better served by injectable type transformers instead of if statement
  if (variableName === 'cfImageAsset') {
    const optionsVariableName = 'cfImageOptions';
    const options = resolveDesignValue(
      variables[optionsVariableName]?.type === 'DesignValue'
        ? variables[optionsVariableName].valuesByBreakpoint
        : {},
      optionsVariableName,
    ) as ImageOptions | undefined;
    if (!options) {
      console.error(
        `Error transforming image asset: Required variable [${optionsVariableName}] missing from component definition`,
      );
      return;
    }
    try {
      value = getOptimizedImageAsset({
        file: asset.fields.file as AssetFile,
        loading: options.loading,
        sizes: options.targetSize as string,
        quality: options.quality,
        format: options.format as ValidFormats,
      });
      return value;
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
    return;
  }

  if (variableName === 'cfBackgroundImageUrl') {
    const width =
      resolveDesignValue(
        variables['cfWidth']?.type === 'DesignValue' ? variables['cfWidth'].valuesByBreakpoint : {},
        'cfWidth',
      ) || '100%';
    const optionsVariableName = 'cfBackgroundImageOptions';
    const options = resolveDesignValue(
      variables[optionsVariableName]?.type === 'DesignValue'
        ? variables[optionsVariableName].valuesByBreakpoint
        : {},
      optionsVariableName,
    ) as BackgroundImageOptions | undefined;
    if (!options) {
      console.error(
        `Error transforming image asset: Required variable [${optionsVariableName}] missing from component definition`,
      );
      return;
    }
    try {
      value = getOptimizedBackgroundImageAsset(
        asset.fields.file as AssetFile,
        width as string,
        options.quality,
        options.format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
      );
      return value;
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
    return;
  }

  return asset.fields.file?.url;
};
