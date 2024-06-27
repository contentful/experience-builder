import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { useComponentProps } from './useComponentProps';
import { ComponentDefinition, ExperienceTreeNode } from '@contentful/experiences-core/types';
import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';

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
const resolveDesignValue = vi.fn();
const renderDropzone = vi.fn();
const areEntitiesFetched = true;
const userIsDragging = false;

describe('useComponentProps', () => {
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
});
