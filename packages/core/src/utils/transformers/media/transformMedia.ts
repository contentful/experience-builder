import { SUPPORTED_IMAGE_FORMATS } from '@/constants';
import { EntityStoreBase } from '@/entity';
import { BoundComponentPropertyTypes, ComponentTreeNode, ResolveDesignValueType } from '@/types';
import { Asset, AssetFile, UnresolvedLink } from 'contentful';
import { getOptimizedBackgroundImageAsset } from './getOptimizedBackgroundImageAsset';
import { getOptimizedImageAsset } from './getOptimizedImageAsset';
import { getBoundValue } from '../getBoundValue';

export const transformMedia = (
  variables: ComponentTreeNode['variables'],
  entityStore: EntityStoreBase,
  binding: UnresolvedLink<'Entry' | 'Asset'>,
  resolveDesignValue: ResolveDesignValueType,
  variableName: string,
) => {
  let value: BoundComponentPropertyTypes;
  const asset = entityStore.getEntryOrAsset(binding) as Asset;
  const format = resolveDesignValue(
    variables['cfImageFormat']?.type === 'DesignValue'
      ? variables['cfImageFormat'].valuesByBreakpoint
      : {},
    'cfImageFormat',
  );
  const quality = resolveDesignValue(
    variables['cfImageQuality']?.type === 'DesignValue'
      ? variables['cfImageQuality'].valuesByBreakpoint
      : {},
    'cfImageQuality',
  );
  const sizes = resolveDesignValue(
    variables['cfImageSizes']?.type === 'DesignValue'
      ? variables['cfImageSizes'].valuesByBreakpoint
      : {},
    'cfImageSizes',
  );

  const width = resolveDesignValue(
    variables['cfWidth']?.type === 'DesignValue' ? variables['cfWidth'].valuesByBreakpoint : {},
    'cfWidth',
  );

  //TODO: this will be better served by injectable type transformers instead of if statement
  if (variableName === 'cfImageAsset') {
    try {
      value = getOptimizedImageAsset(
        asset.fields.file as AssetFile,
        sizes as string,
        Number(quality),
        format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
      );
      return value;
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
  } else if (variableName === 'cfBackgroundImageUrl') {
    try {
      value = getOptimizedBackgroundImageAsset(
        asset.fields.file as AssetFile,
        width as string,
        Number(quality),
        format as (typeof SUPPORTED_IMAGE_FORMATS)[number],
      );
      return value;
    } catch (error) {
      console.error('Error transforming image asset', error);
    }
  } else {
    return getBoundValue(entityStore, binding, []);
  }
};
