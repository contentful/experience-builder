import { renderHook } from '@testing-library/react';
import { useComponent } from './useComponent';
import { ComponentRegistration, ExperienceTreeNode } from '@contentful/experiences-core/types';
import { vi, it, describe, expect } from 'vitest';
import { getValueForBreakpoint } from '@contentful/experiences-core';
import { createBreakpoints } from '@/__fixtures__/breakpoints';
import React from 'react';

const mocks = vi.hoisted(() => {
  return {
    componentRegistration: {
      component: () => React.createElement('div'),
      definition: {
        id: 'exp-editor-mode',
        name: 'Exp Editor Mode',
        category: 'Custom Components',
        variables: {
          myValue: {
            displayName: 'Value',
            type: 'Text',
          },
        },
      },
      options: {
        wrapComponent: true,
      },
    },
  };
});

vi.mock('@/store/registries', () => ({
  componentRegistry: new Map<string, ComponentRegistration>([
    ['exp-editor-mode', mocks.componentRegistration],
  ]),
}));

describe('useComponent', () => {
  const node: ExperienceTreeNode = {
    data: {
      id: 'id',
      blockId: 'exp-editor-mode',
      props: {},
      unboundValues: {},
      dataSource: {},
      breakpoints: [],
    },
    children: [],
    type: 'block',
  };
  const breakpoints = createBreakpoints();
  const desktopIndex = 0;
  const resolveDesignValue = vi.fn((valuesByBreakpoint, variableName) =>
    getValueForBreakpoint(valuesByBreakpoint, breakpoints, desktopIndex, variableName),
  );
  const userIsDragging = false;
  const renderDropzone = vi.fn();

  beforeEach(() => {});

  describe('when component wrapping is disabled', () => {
    beforeEach(() => {
      mocks.componentRegistration.options!.wrapComponent = false;
    });

    it('then the wrapping container should contain the correct data props', () => {
      const { result } = renderHook(() =>
        useComponent({
          node,
          resolveDesignValue,
          renderDropzone,
          userIsDragging,
          wrappingPatternIds: new Set(),
        }),
      );

      const { elementToRender } = result.current;

      const element = elementToRender();
      expect(element.props['data-cf-node-block-type']).toEqual(node.type);
      expect(element.props['data-cf-node-block-id']).toEqual(node.data.blockId);
      expect(element.props['data-cf-node-id']).toEqual(node.data.id);
    });
  });
});
