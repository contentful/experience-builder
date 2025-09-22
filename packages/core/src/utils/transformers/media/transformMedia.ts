import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import {
  BackgroundImageOptions,
  BoundComponentPropertyTypes,
  ComponentTreeNode,
  ImageOptions,
  ResolveDesignValueType,
} from '@/types';
import { Asset, AssetDetails, AssetFile } from 'contentful';
import { getOptimizedBackgroundImageAsset } from './getOptimizedBackgroundImageAsset';
import { getOptimizedImageAsset } from './getOptimizedImageAsset';
import { getBoundValue } from '../getBoundValue';
import { debug } from '@/utils/debugLogger';
import { getTargetValueInPixels, parseCSSValue } from '@/utils/utils';
import { isDeepPath, lastPathNamedSegmentEq } from '@/utils/pathSchema';
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
    ) as ImageOptions | undefined;
    if (!options) {
      debug.error(
        `[experiences-core::transformMedia] Error transforming image asset: Required variable [${optionsVariableName}] missing from component definition`,
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
      debug.error('[experiences-core::transformMedia] Error transforming image asset', error);
    }
    return;
  }

  if (variableName === 'cfBackgroundImageUrl') {
    let width =
      resolveDesignValue(
        variables['cfWidth']?.type === 'DesignValue' ? variables['cfWidth'].valuesByBreakpoint : {},
        'cfWidth',
      ) || '100%';
    const optionsVariableName = 'cfBackgroundImageOptions';
    const options = resolveDesignValue(
      variables[optionsVariableName]?.type === 'DesignValue'
        ? variables[optionsVariableName].valuesByBreakpoint
        : {},
    ) as BackgroundImageOptions | undefined;
    if (!options) {
      debug.error(
        `[experiences-core::transformMedia] Error transforming image asset: Required variable [${optionsVariableName}] missing from component definition`,
      );
      return;
    }
    try {
      // Target width (px/rem/em) will be applied to the css url if it's lower than the original image width (in px)
      const assetDetails = asset.fields.file?.details as AssetDetails;

      const assetWidth = assetDetails?.image?.width || 0; // This is always in px
      const targetWidthObject = parseCSSValue(options.targetSize); // Contains value and unit (px/rem/em) so convert and then compare to assetWidth
      const targetValue = targetWidthObject
        ? getTargetValueInPixels(targetWidthObject)
        : assetWidth;

      if (targetValue < assetWidth) width = `${targetValue}px`;
      value = getOptimizedBackgroundImageAsset(
        asset.fields.file as AssetFile,
        width as string,
        options.quality,
        options.format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
      );
      return value;
    } catch (error) {
      debug.error('[experiences-core::transformMedia] Error transforming image asset', error);
    }
    return;
  }

  return asset.fields.file?.url;
};
