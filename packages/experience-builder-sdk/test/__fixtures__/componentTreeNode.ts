import { ComponentTreeNode } from '@contentful/experiences-validators';

export const createComponentTreeNode = (): ComponentTreeNode => ({
  definitionId: 'test-component',
  variables: {
    cfBackgroundColor: {
      type: 'DesignValue',
      valuesByBreakpoint: { desktop: 'rgba(255, 0, 0, 1)', tablet: 'rgba(0, 255, 0, 1)' },
    },
    customFontColor: {
      type: 'DesignValue',
      valuesByBreakpoint: { mobile: 'rgba(0, 255, 255, 1)' },
    },
    text: { type: 'BoundValue', path: '/boundValueKey/fields/foo/~locale' },
  },
  children: [],
});

export const createComponentTreeNodeWithCfBackgroundImageUrl = (): ComponentTreeNode => ({
  definitionId: 'test-component',
  variables: {
    cfBackgroundImageUrl: {
      type: 'BoundValue',
      path: '/dsKeyToAsset/fields/file/~locale',
    },
    cfBackgroundImageOptions: {
      type: 'DesignValue',
      valuesByBreakpoint: {
        desktop: {
          alignment: 'left top',
          scaling: 'fill',
          targetSize: '2000px',
        },
        tablet: {
          alignment: 'right bottom',
          scaling: 'fill',
          targetSize: '2000px',
        },
      },
    },
    cfBackgroundColor: {
      type: 'DesignValue',
      valuesByBreakpoint: { desktop: 'rgba(255, 0, 0, 1)', tablet: 'rgba(0, 255, 0, 1)' },
    },
    customFontColor: {
      type: 'DesignValue',
      valuesByBreakpoint: { mobile: 'rgba(0, 255, 255, 1)' },
    },
    text: { type: 'BoundValue', path: '/boundValueKey/fields/foo/~locale' },
  },
  children: [],
});
