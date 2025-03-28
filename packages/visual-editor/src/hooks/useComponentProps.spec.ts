import { ASSEMBLY_NODE_TYPE, CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { useComponentProps } from './useComponentProps';
import {
  ComponentDefinition,
  ComponentPropertyValue,
  ExperienceTreeNode as ExperienceTreeNodeWithOptionalProperties,
} from '@contentful/experiences-core/types';
import { Mock, vi, it, describe } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createBreakpoints } from '@/__fixtures__/breakpoints';
import { useDraggedItemStore } from '@/store/draggedItem';
import { getValueForBreakpoint } from '@contentful/experiences-core';

// Redefining this type to make 'data.props.cfVisibility' a required field.
// Semantically, it is always available on the node at runtime,
// and this stricter type ensures that when making mock nodes, we don't miss it.
type ExperienceTreeNode = Omit<ExperienceTreeNodeWithOptionalProperties, 'data'> & {
  data: Omit<ExperienceTreeNodeWithOptionalProperties['data'], 'props'> & {
    props: ExperienceTreeNodeWithOptionalProperties['data']['props'] & {
      cfVisibility: ComponentPropertyValue;
    };
  };
};

vi.mock('@/store/draggedItem', () => ({
  useDraggedItemStore: vi.fn(),
}));

const breakpoints = createBreakpoints();
const desktopIndex = 0;
const desktop = breakpoints[desktopIndex];
const resolveDesignValue = vi.fn((valuesByBreakpoint, variableName) =>
  getValueForBreakpoint(valuesByBreakpoint, breakpoints, desktopIndex, desktopIndex, variableName),
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
      props: {
        cfVisibility: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            [desktop.id]: true,
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
        myValue: { type: 'Text', defaultValue: 'default' },
      },
    };
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        // This block id will identify the component as a structure component
        blockId: CONTENTFUL_COMPONENTS.section.id,
        props: {
          cfVisibility: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: true,
            },
          },
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
          myValue: {
            type: 'UnboundValue',
            key: 'myValue',
          },
        },
        unboundValues: {
          myValue: { value: 'test' },
        },
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

    it('should not return isInExpEditorMode for structural components', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          userIsDragging,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.isInExpEditorMode).toBeUndefined();
    });

    it('should not return unbound values in componentProps for structural components', () => {
      vi.mock('@/store/editor', () => ({
        useEditorStore: () => ({
          myValue: { value: 'test' },
        }),
      }));
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          userIsDragging,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.myValue).toBeUndefined();
    });
  });

  describe('custom components', () => {
    const definition: ComponentDefinition = {
      id: 'banner',
      name: 'Banner',
      variables: {
        cfVisibility: { type: 'Boolean' }, // TODO.DK: The test nodes must NOT miss this value when created here
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
        cfMaxWidth: { type: 'Text' },
        cfMargin: { type: 'Text' },
        myValue: { type: 'Text', defaultValue: 'default' },
      },
    };

    // TODO.DK: need some way to be sure that node props and definition props are in sync...
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        blockId: 'banner',
        props: {
          cfVisibility: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: true,
            },
          },
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
          myValue: {
            type: 'UnboundValue',
            key: 'myValue',
          },
        },
        unboundValues: {
          myValue: { value: 'test' },
        },
        dataSource: {},
        breakpoints: [],
      },
      children: [],
      type: 'block',
    };

    it.only('should NOT set the component size in wrapperStyles when drag wrapper is enabled', () => {
      const newNode: ExperienceTreeNode = structuredClone(node);
      newNode.data.props['cfVisibility'] = {
        type: 'DesignValue',
        valuesByBreakpoint: {
          [desktop.id]: false,
        },
      };

      const { result } = renderHook(() =>
        useComponentProps({
          node: newNode,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          requiresDragWrapper: true,
          userIsDragging,
        }),
      );

      expect(result.current.wrapperStyles).toEqual({}); // it will have { width: undefined }, but it still resolves to {} during ... destructuring

      expect(result.current.componentStyles.display).toEqual('none !important');
      // Seems leaving in the props below does no harm (as `none !important` makes node disappear)
      expect(result.current.componentStyles.width).toEqual('100%');
      expect(result.current.componentStyles.height).toEqual('100%');
      expect(result.current.componentStyles.maxWidth).toEqual('none');
      expect(result.current.componentStyles.margin).toEqual('0');
    });

    // it('should set the component size in wrapperStyles when drag wrapper is enabled', () => {
    it('should have all the wrapper div properties when cfVisibility=true', () => {
      const newNode = structuredClone(node);
      newNode.data.props['cfVisibility'] = {
        type: 'DesignValue',
        valuesByBreakpoint: {
          [desktop.id]: true,
        },
      };

      const { result } = renderHook(() =>
        useComponentProps({
          node: newNode,
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

    it.each(['50%', '100%'])(
      `should set the wrapper width to %s using the wrapContainerWidth option`,
      (width) => {
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
      },
    );

    it('should return isInExpEditorMode as true for custom components when flag is enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          userIsDragging,
          options: { wrapComponent: false, enableCustomEditorView: true },
        }),
      );

      expect(result.current.componentProps.isInExpEditorMode).toBe(true);
    });

    it('should not return isInExpEditorMode when the flag is not enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          userIsDragging,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.isInExpEditorMode).toBeUndefined();
    });

    it('should return unbound values in componentProps for structural components', () => {
      vi.mock('@/store/editor', () => ({
        useEditorStore: () => ({
          myValue: { value: 'test' },
        }),
      }));
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          areEntitiesFetched,
          resolveDesignValue,
          renderDropzone,
          definition,
          userIsDragging,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.myValue).toBe('test');
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
          cfVisibility: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: true,
            },
          },
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
