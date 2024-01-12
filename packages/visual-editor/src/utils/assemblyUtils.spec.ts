import { Asset, Entry } from 'contentful';
import {
  createAssemblyEntry,
  createAssemblyNode,
  assemblyGeneratedVariableName,
} from '../../test/__fixtures__/assembly';
import { assets } from '../../test/__fixtures__/entities';

import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
} from '@contentful/experience-builder-core/constants';
import type {
  CompositionComponentNode,
  CompositionNode,
} from '@contentful/experience-builder-core/types';
import { EditorModeEntityStore } from '@contentful/experience-builder-core';
import { deserializeAssemblyNode, resolveAssembly } from './assemblyUtils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { assembliesRegistry } from '@/store/registries';

const assemblyEntry = createAssemblyEntry({
  id: 'assembly-id',
  schemaVersion: '2023-09-28',
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

  it('should correctly deserialize a simple CompositionNode with no variables or children', () => {
    const node: CompositionNode = {
      definitionId: 'assembly-id',
      variables: {},
      children: assemblyEntry.fields.componentTree.children as CompositionNode['children'],
    };

    const result = deserializeAssemblyNode({
      node,
      nodeId: 'random-node-id',
      parentId: 'root',
      assemblyDataSource: {},
      assemblyUnboundValues: assemblyEntry.fields.unboundValues,
      componentInstanceProps: {
        [assemblyGeneratedVariableName]: {
          type: 'UnboundValue',
          key: 'unbound_uuid1Experience',
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
            blockId: 'contentful-container',
            id: expect.any(String),
            props: {},
            dataSource: {},
            unboundValues: {},
            breakpoints: [],
          },
          children: [
            {
              type: ASSEMBLY_BLOCK_NODE_TYPE,
              parentId: expect.any(String),
              data: {
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
    const node: CompositionComponentNode = {
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

    const entityStore = null;

    const result = resolveAssembly({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when assembliesRegistry does not have the componentId', () => {
    const node: CompositionComponentNode = {
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

    const entityStore = null;

    // Throws warning "Entry for assembly with ID 'assembly-id' not found"
    const result = resolveAssembly({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when entityStore does not have componentFields', () => {
    const node: CompositionComponentNode = {
      type: ASSEMBLY_NODE_TYPE,
      data: {
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
    const node: CompositionComponentNode = {
      type: ASSEMBLY_NODE_TYPE,
      data: {
        blockId: 'assembly-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = null;

    // Throws warning "Entry for assembly with ID 'assembly-id' not found"
    const result = resolveAssembly({ node, entityStore });

    expect(result).toEqual(node);
  });

  // TODO: This tests is basically a plain snapshot test and missing specific assertions.
  // Also it is testing almost completley the same as above for `deserializeAssemblyNode`.
  it('returns a deserialized assembly node with unboundValues and props', () => {
    const node = createAssemblyNode({
      id: 'random-node-id',
      unboundValueKey: 'unbound_uuid1Experience',
      unboundValue: 'New year Eve',
    });

    const entityStore = new EditorModeEntityStore({
      entities: [assemblyEntry, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolveAssembly({ node, entityStore });

    expect(result).not.toEqual(node);
    expect(result).toEqual({
      type: ASSEMBLY_NODE_TYPE,
      parentId: 'root',
      data: {
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
            blockId: 'contentful-container',
            id: expect.any(String),
            props: {},
            dataSource: {},
            unboundValues: {},
            breakpoints: [],
          },
          children: [
            {
              type: ASSEMBLY_BLOCK_NODE_TYPE,
              parentId: expect.any(String),
              data: {
                blockId: 'custom-component',
                id: expect.any(String),
                props: {
                  text: {
                    key: 'unbound_uuid1Experience',
                    type: 'UnboundValue',
                  },
                },
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

  it('returns a deserialized assembly node with a bound value', () => {
    const node = createAssemblyNode({
      id: 'random-node-id',
      boundValueKey: 'bound_uuid1Experience',
    });

    const entityStore = new EditorModeEntityStore({
      entities: [assemblyEntry, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
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
});
