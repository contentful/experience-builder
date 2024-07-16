import { Asset, Entry } from 'contentful';
import {
  createAssemblyEntry,
  createAssemblyNode,
  assemblyGeneratedVariableName,
  assemblyGeneratedDesignVariableName,
} from '../../test/__fixtures__/assembly';
import { assets } from '../../test/__fixtures__/entities';

import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experiences-core/constants';
import type { ExperienceTreeNode, ComponentTreeNode } from '@contentful/experiences-core/types';
import { EditorModeEntityStore } from '@contentful/experiences-core';
import { deserializeAssemblyNode, resolveAssembly } from './assemblyUtils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { assembliesRegistry } from '@/store/registries';

const assemblyEntry = createAssemblyEntry({
  id: 'assembly-id',
  schemaVersion: '2023-09-28',
});

const entityStore = new EditorModeEntityStore({
  entities: [assemblyEntry, ...assets] as Array<Entry | Asset>,
  locale: 'en-US',
});

describe('deserializeAssemblyNode', () => {
  beforeEach(() => {
    assembliesRegistry.set(assemblyEntry.sys.id, {
      sys: { id: assemblyEntry.sys.id, type: 'Link', linkType: 'Entry' },
    });
  });

  afterEach(() => {
    assembliesRegistry.clear();
  });

  it('should correctly deserialize a simple ComponentTreeNode with no variables or children', () => {
    const node: ComponentTreeNode = {
      definitionId: 'assembly-id',
      variables: {},
      children: assemblyEntry.fields.componentTree.children as ComponentTreeNode['children'],
    };

    const result = deserializeAssemblyNode({
      node,
      nodeId: 'random-node-id',
      parentId: 'root',
      assemblyId: 'whatever',
      assemblyComponentId: 'whatever',
      nodeLocation: '0',
      assemblyDataSource: {},
      assemblyVariableDefinitions: {},
      assemblyUnboundValues: assemblyEntry.fields.unboundValues,
      componentInstanceProps: {
        [assemblyGeneratedVariableName]: {
          type: 'UnboundValue',
          key: 'unbound_uuid1Experience',
        },
        [assemblyGeneratedDesignVariableName]: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '27px' },
        },
      },
      componentInstanceUnboundValues: {
        unbound_uuid1Experience: { value: 'New year Eve' },
      },
      componentInstanceDataSource: {},
    });

    expect(result).toEqual({
      type: ASSEMBLY_NODE_TYPE,
      parentId: 'root',
      data: {
        assembly: {
          componentId: 'whatever',
          id: 'whatever',
          nodeLocation: '0',
        },
        blockId: 'assembly-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [
        {
          type: ASSEMBLY_BLOCK_NODE_TYPE,
          parentId: 'random-node-id',
          data: {
            assembly: {
              componentId: 'whatever',
              id: 'whatever',
              nodeLocation: '0_0',
            },
            blockId: 'contentful-container',
            id: expect.any(String),
            props: {
              cfWidth: {
                type: 'DesignValue',
                valuesByBreakpoint: { desktop: '27px' },
              },
            },
            dataSource: {},
            unboundValues: {},
            breakpoints: [],
          },
          children: [
            {
              type: ASSEMBLY_BLOCK_NODE_TYPE,
              parentId: expect.any(String),
              data: {
                assembly: {
                  componentId: 'whatever',
                  id: 'whatever',
                  nodeLocation: '0_0_0',
                },
                blockId: 'custom-component',
                id: expect.any(String),
                props: { text: { key: 'unbound_uuid1Experience', type: 'UnboundValue' } },
                dataSource: {},
                unboundValues: {
                  unbound_uuid1Experience: {
                    value: 'New year Eve',
                  },
                },
                breakpoints: [],
              },
              children: [],
            },
          ],
        },
      ],
    });
  });
});

describe('resolveAssembly', () => {
  beforeEach(() => {
    assembliesRegistry.set(assemblyEntry.sys.id, {
      sys: { id: assemblyEntry.sys.id, type: 'Link', linkType: 'Entry' },
    });
  });

  afterEach(() => {
    assembliesRegistry.clear();
  });

  it('should return the input node when its type is not an assembly node type', () => {
    const node: ExperienceTreeNode = {
      type: 'block',
      data: {
        id: '1',
        blockId: 'custom-component',
        props: {
          text: { type: 'UnboundValue', key: 'value1' },
        },

        dataSource: {},
        unboundValues: {
          value1: { value: 'unboundValue1' },
          value2: { value: 1 },
        },
        breakpoints: [],
      },
      children: [],
    };

    const result = resolveAssembly({ node, entityStore: null });

    expect(result).toEqual(node);
  });

  it('should return the input node when assembliesRegistry does not have the componentId', () => {
    const node: ExperienceTreeNode = {
      type: ASSEMBLY_NODE_TYPE,
      data: {
        blockId: 'assemblyId',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    // Throws warning "Entry for assembly with ID 'assembly-id' not found"
    const result = resolveAssembly({ node, entityStore: null });

    expect(result).toEqual(node);
  });

  it('should return the input node when entityStore does not have componentFields', () => {
    const node: ExperienceTreeNode = {
      type: ASSEMBLY_NODE_TYPE,
      data: {
        assembly: {
          componentId: 'random-node-id',
          id: 'assembly-id',
          nodeLocation: null,
        },
        blockId: 'assembly-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = new EditorModeEntityStore({
      entities: [{ ...assemblyEntry, fields: {} }, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolveAssembly({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when entityStore is null', () => {
    const node: ExperienceTreeNode = {
      type: ASSEMBLY_NODE_TYPE,
      data: {
        assembly: {
          componentId: 'random-node-id',
          id: 'assembly-id',
          nodeLocation: null,
        },
        blockId: 'assembly-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    // Throws warning "Entry for assembly with ID 'assembly-id' not found"
    const result = resolveAssembly({ node, entityStore: null });

    expect(result).toEqual(node);
  });

  it('returns a deserialized assembly node with an unbound value', () => {
    const node = createAssemblyNode({
      id: 'random-node-id',
      unboundValueKey: 'unbound_uuid1Experience',
      unboundValue: 'New year Eve',
    });

    const result = resolveAssembly({ node, entityStore });

    expect(result).not.toEqual(node);
    expect(result.children[0].children[0].data.props.text).toEqual({
      type: 'UnboundValue',
      key: 'unbound_uuid1Experience',
    });
    expect(result.children[0].children[0].data.unboundValues['unbound_uuid1Experience']).toEqual({
      value: 'New year Eve',
    });
  });

  it('returns a deserialized assembly node with a bound value', () => {
    const node = createAssemblyNode({
      id: 'random-node-id',
      boundValueKey: 'bound_uuid1Experience',
    });

    const result = resolveAssembly({ node, entityStore });

    expect(result).not.toEqual(node);
    expect(result.children[0].children[0].data.props.text).toEqual({
      type: 'BoundValue',
      path: '/bound_uuid1Experience/fields/someFieldId/~locale',
    });
    expect(result.children[0].children[0].data.unboundValues).toEqual({});
    expect(result.children[0].children[0].data.dataSource['bound_uuid1Experience']).toEqual({
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: 'someEntryId',
      },
    });
  });

  it('returns a deserialized assembly node with an exposed design value', () => {
    const node = createAssemblyNode({
      id: 'random-node-id',
      designValue: { desktop: '27px' },
    });
    const result = resolveAssembly({ node, entityStore });

    expect(result).not.toEqual(node);
    expect(result.children[0].data.props.cfWidth).toEqual({
      type: 'DesignValue',
      valuesByBreakpoint: { desktop: '27px' },
    });
  });

  it('returns a deserialized assembly node with an exposed design value using fallback value', () => {
    const node = createAssemblyNode({ id: 'random-node-id' });
    const result = resolveAssembly({ node, entityStore });

    expect(result).not.toEqual(node);
    expect(result.children[0].data.props.cfWidth).toEqual({
      type: 'DesignValue',
      valuesByBreakpoint: { desktop: '42px' },
    });
  });
});
