import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { useComponentProps } from './useComponentProps';
import { ComponentDefinition, ExperienceTreeNode } from '@contentful/experiences-core/types';
import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createBreakpoints } from '@/__fixtures__/breakpoints';
import { getValueForBreakpoint } from '@contentful/experiences-core';

const breakpoints = createBreakpoints();
const desktopIndex = 0;
const desktop = breakpoints[desktopIndex];
const resolveDesignValue = vi.fn((valuesByBreakpoint, variableName) =>
  getValueForBreakpoint(valuesByBreakpoint, breakpoints, desktopIndex, variableName),
);
const renderDropzone = vi.fn();
const areEntitiesFetched = true;
const userIsDragging = false;

describe('useComponentProps', () => {
  const definition: ComponentDefinition = {
    id: 'button',
    name: 'Button',
    variables: {
      label: {
        type: 'Text',
        defaultValue: 'Click here',
      },
    },
  };
  const node: ExperienceTreeNode = {
    data: {
      id: 'id',
      props: {},
      unboundValues: {},
      dataSource: {},
      breakpoints: [],
    },
    children: [],
    type: 'block',
  };
  it('should return empty object when node type is ASSEMBLY_NODE_TYPE', () => {
    const areEntitiesFetched = true;
    const userIsDragging = false;

    const { result } = renderHook(() =>
      useComponentProps({
        node: { ...node, type: ASSEMBLY_NODE_TYPE },
        areEntitiesFetched,
        resolveDesignValue,
        renderDropzone,
        definition,
        userIsDragging,
      }),
    );

    expect(Object.keys(result.current.componentProps)).not.toContain('label');
  });

  it('should return props with default values when variableMapping is falsy', () => {
    const { result } = renderHook(() =>
      useComponentProps({
        node,
        areEntitiesFetched,
        resolveDesignValue,
        renderDropzone,
        definition,
        userIsDragging,
      }),
    );

    expect(result.current.componentProps.label).toEqual('Click here');
  });

  it('should return definition default value when type is ComponentValue', () => {
    const areEntitiesFetched = true;
    const userIsDragging = false;

    const { result } = renderHook(() =>
      useComponentProps({
        node: {
          ...node,
          data: {
            ...node.data,
            props: {
              label: {
                key: 'random-uuid',
                type: 'ComponentValue',
              },
            },
          },
        },
        areEntitiesFetched,
        resolveDesignValue,
        renderDropzone,
        definition,
        userIsDragging,
      }),
    );

    expect(result.current.componentProps.label).toEqual('Click here');
  });

  describe('structure components', () => {
    const definition: ComponentDefinition = {
      id: 'contentful-section',
      name: 'Section',
      variables: {
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
      },
    };
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        // This block id will identify the component as a structure component
        blockId: 'contentful-section',
        props: {
          cfWidth: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
          cfHeight: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: 'fit-content',
            },
          },
        },
        unboundValues: {},
        dataSource: {},
        breakpoints: [],
      },
      children: [],
      type: 'block',
    };

    it('should set the component size in componentStyles', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          userIsDragging,
        }),
      );

      expect(result.current.componentStyles.width).toEqual('50%');
      expect(result.current.componentStyles.height).toEqual('fit-content');
    });
  });

  describe('regular (non-structure) components', () => {
    const definition: ComponentDefinition = {
      id: 'box',
      name: 'Box',
      variables: {
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
      },
    };
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        // This block id will identify the component as a regular (non-structure) component
        blockId: 'box',
        props: {
          cfWidth: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
          cfHeight: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
        },
        unboundValues: {},
        dataSource: {},
        breakpoints: [],
      },
      children: [],
      type: 'block',
    };

    it('should set the component size in wrapperStyles and set 100% size in componentStyles', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          userIsDragging,
        }),
      );

      expect(result.current.wrapperStyles.width).toEqual('50%');
      expect(result.current.wrapperStyles.height).toEqual('50%');
      expect(result.current.componentStyles.width).toEqual('100%');
      expect(result.current.componentStyles.height).toEqual('100%');
    });
  });
});
