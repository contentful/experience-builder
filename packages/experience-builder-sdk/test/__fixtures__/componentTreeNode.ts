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
