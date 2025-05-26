import { ASSEMBLY_NODE_TYPE, CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { useComponentProps } from './useComponentProps';
import {
  ComponentDefinition as ComponentDefinitionWithOptionalVariables,
  ComponentDefinitionVariable,
  ComponentPropertyValue,
  ExperienceTreeNode as ExperienceTreeNodeWithOptionalProperties,
} from '@contentful/experiences-core/types';
import { vi, it, describe } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createBreakpoints } from '@/__fixtures__/breakpoints';
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

// When defining components in tests, must make the cfVisibility variable required,
// otherwise some tests may glitch, as when useComponentProps() logic iterates
// over nodes variables, it actually iterates over definition variables which are present on the node.
type ComponentDefinition = Omit<ComponentDefinitionWithOptionalVariables, 'variables'> & {
  variables: ComponentDefinitionWithOptionalVariables['variables'] & {
    cfVisibility: ComponentDefinitionVariable;
  };
};

vi.mock('@/store/entityStore', () => ({
  useEntityStore: () => ({ areEntitiesFetched: true }),
}));

const breakpoints = createBreakpoints();
const desktopIndex = 0;
const desktop = breakpoints[desktopIndex];
const resolveDesignValue = vi.fn((valuesByBreakpoint, variableName) =>
  getValueForBreakpoint(valuesByBreakpoint, breakpoints, desktopIndex, desktopIndex, variableName),
);

describe('useComponentProps', () => {
  const definition: ComponentDefinition = {
    id: 'button',
    name: 'Button',
    variables: {
      cfVisibility: { type: 'Boolean' },
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
    const { result } = renderHook(() =>
      useComponentProps({
        node: { ...node, type: ASSEMBLY_NODE_TYPE },
        resolveDesignValue,
        definition,
      }),
    );

    expect(Object.keys(result.current.componentProps)).not.toContain('label');
  });

  it('should return props with default values when variableMapping is falsy', () => {
    const { result } = renderHook(() =>
      useComponentProps({
        node,
        resolveDesignValue,
        definition,
      }),
    );

    expect(result.current.componentProps.label).toEqual('Click here');
  });

  it('should return definition default value when type is ComponentValue', () => {
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
        resolveDesignValue,
        definition,
      }),
    );

    expect(result.current.componentProps.label).toEqual('Click here');
  });

  describe('structure components', () => {
    const definition: ComponentDefinition = {
      id: CONTENTFUL_COMPONENTS.section.id,
      name: CONTENTFUL_COMPONENTS.section.name,
      variables: {
        cfVisibility: { type: 'Boolean' },
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

    it('should not return isInExpEditorMode for structural components', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          resolveDesignValue,
          definition,
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
          resolveDesignValue,
          definition,
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
        cfVisibility: { type: 'Boolean' },
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
        cfMaxWidth: { type: 'Text' },
        cfMargin: { type: 'Text' },
        myValue: { type: 'Text', defaultValue: 'default' },
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

    it('should return isInExpEditorMode as true for custom components when flag is enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          resolveDesignValue,
          definition,
          options: { wrapComponent: false, enableCustomEditorView: true },
        }),
      );

      expect(result.current.componentProps.isInExpEditorMode).toBe(true);
    });

    it('should not return isInExpEditorMode when the flag is not enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          resolveDesignValue,
          definition,
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
          resolveDesignValue,
          definition,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.myValue).toBe('test');
    });
  });
});
