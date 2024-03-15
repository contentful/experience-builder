import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import {
  BackgroundImageOptions,
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
  //TODO: this will be better served by injectable type transformers instead of if statement
  if (variableName === 'cfImage') {
    const { valuesByBreakpoint } = variables[variableName];
    const options = resolveDesignValue(valuesByBreakpoint ?? {}, variableName) as ImageOptions;
    try {
      return {
        ...options,
        asset: getOptimizedImageAsset(
          asset.fields.file as AssetFile,
          options.targetSize as string,
          Number(options.quality),
          options.format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
        ),
      };
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
    return;
  }

  if (variableName === 'cfBackgroundImage') {
    const width = resolveDesignValue(
      variables['cfWidth']?.type === 'DesignValue' ? variables['cfWidth'].valuesByBreakpoint : {},
      'cfWidth',
    );
    const { valuesByBreakpoint } = variables[variableName];
    const options = resolveDesignValue(
      valuesByBreakpoint ?? {},
      variableName,
    ) as BackgroundImageOptions;
    try {
      return {
        ...options,
        asset: getOptimizedBackgroundImageAsset(
          asset.fields.file as AssetFile,
          width as string,
          Number(options.quality),
          options.format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
        ),
      };
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
    return;
  }

  // return getBoundValue(asset, entityStore, binding, path);
  return getBoundValue(asset, path);
};
