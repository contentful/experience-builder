import { ASSEMBLY_NODE_TYPE, CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { useComponentProps } from './useComponentProps';
import { ComponentDefinition, ExperienceTreeNode } from '@contentful/experiences-core/types';
import { Mock, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createBreakpoints } from '@/__fixtures__/breakpoints';
import { useDraggedItemStore } from '@/store/draggedItem';
import { getValueForBreakpoint } from '@contentful/experiences-core';

vi.mock('@/store/draggedItem', () => ({
  useDraggedItemStore: vi.fn(),
}));

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
      id: CONTENTFUL_COMPONENTS.section.id,
      name: CONTENTFUL_COMPONENTS.section.name,
      variables: {
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
      },
    };
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        // This block id will identify the component as a structure component
        blockId: CONTENTFUL_COMPONENTS.section.id,
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
        cfMaxWidth: { type: 'Text' },
        cfMargin: { type: 'Text' },
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
          cfMaxWidth: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
          cfMargin: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '10px 0 10px 0',
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

    it('should set the component size in wrapperStyles when drag wrapper is enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          requiresDragWrapper: true,
          userIsDragging,
        }),
      );

      expect(result.current.wrapperStyles.width).toEqual('50%');
      expect(result.current.wrapperStyles.height).toEqual('50%');
      expect(result.current.wrapperStyles.maxWidth).toEqual('50%');
      expect(result.current.wrapperStyles.margin).toEqual('10px 0 10px 0');

      expect(result.current.componentStyles.width).toEqual('100%');
      expect(result.current.componentStyles.height).toEqual('100%');
      expect(result.current.componentStyles.maxWidth).toEqual('none');
      expect(result.current.componentStyles.margin).toEqual('0');
    });

    it('should set the component size in componentStyles when drag wrapper is disabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          requiresDragWrapper: false,
          userIsDragging,
        }),
      );

      expect(result.current.componentStyles.width).toEqual('50%');
      expect(result.current.componentStyles.height).toEqual('50%');
      expect(result.current.componentStyles.maxWidth).toEqual('50%');
      expect(result.current.componentStyles.margin).toEqual('10px 0 10px 0');
    });
  });

  describe('custom components', () => {
    const definition: ComponentDefinition = {
      id: 'banner',
      name: 'Banner',
      variables: {},
    };
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        blockId: 'banner',
        props: {},
        unboundValues: {},
        dataSource: {},
        breakpoints: [],
      },
      children: [],
      type: 'block',
    };

    ['50%', '100%'].forEach((width) => {
      it(`should set the wrapper width to ${width} using the wrapContainerWidth option`, () => {
        const { result } = renderHook(() =>
          useComponentProps({
            node,
            areEntitiesFetched,
            resolveDesignValue,
            renderDropzone,
            definition,
            userIsDragging,
            options: { wrapContainerWidth: width },
          }),
        );

        // The wrapper width should be set to the wrapContainerWidth value
        expect(result.current.wrapperStyles.width).toEqual(width);

        // The component width should be set to 100% to fill the wrapper
        expect(result.current.componentStyles.width).toEqual('100%');
      });
    });
  });

  describe('should prevent resizing element with percentage height/width when dragging', () => {
    const definition: ComponentDefinition = {
      id: 'banner',
      name: 'Banner',
      variables: {
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
      },
    };
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        blockId: 'banner',
        props: {
          cfWidth: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: '50%',
            },
          },
          cfHeight: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: '50%',
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

    const nodeRect = { width: 200, height: 100 } as DOMRect;

    beforeEach(() => {
      (useDraggedItemStore as unknown as Mock).mockImplementation((selector) =>
        selector({
          onBeforeCaptureId: 'id',
          domRect: nodeRect,
        }),
      );
    });

    it('and set wrapper max size constraint when drag wrapper is enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched: true,
          resolveDesignValue,
          renderDropzone,
          definition,
          requiresDragWrapper: true,
          userIsDragging: true,
        }),
      );

      expect(result.current.wrapperStyles.maxWidth).toEqual(nodeRect.width);
      expect(result.current.wrapperStyles.maxHeight).toEqual(nodeRect.height);
    });

    it('and set component max size constraint when drag wrapper is disabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched: true,
          resolveDesignValue,
          renderDropzone,
          definition,
          requiresDragWrapper: false,
          userIsDragging: true,
        }),
      );

      expect(result.current.componentStyles.maxWidth).toEqual(nodeRect.width);
      expect(result.current.componentStyles.maxHeight).toEqual(nodeRect.height);
    });
  });
});
