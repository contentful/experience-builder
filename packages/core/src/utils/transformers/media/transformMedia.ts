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
import { getBoundValue } from '../getBoundValue';

export const transformMedia = (
  asset: Asset,
  variables: ComponentTreeNode['variables'],
  resolveDesignValue: ResolveDesignValueType,
  variableName: string,
  path: string,
) => {
  let value: BoundComponentPropertyTypes;

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
      value = getOptimizedImageAsset(
        asset.fields.file as AssetFile,
        options.targetSize as string,
        Number(options.quality),
        options.format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
      );
      return value;
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
    return;
  }

  if (variableName === 'cfBackgroundImageUrl') {
    const width = resolveDesignValue(
      variables['cfWidth']?.type === 'DesignValue' ? variables['cfWidth'].valuesByBreakpoint : {},
      'cfWidth',
    );
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
        Number(options.quality),
        options.format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
      );
      return value;
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
    return;
  }

  // return getBoundValue(asset, entityStore, binding, path);
  return getBoundValue(asset, path);
};
