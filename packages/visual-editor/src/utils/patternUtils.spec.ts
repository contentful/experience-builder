import { Asset, Entry } from 'contentful';
import {
  createPatternEntry,
  createPatternNode,
  patternGeneratedVariableName,
} from '../../test/__fixtures__/pattern';
import { assets } from '../../test/__fixtures__/entities';

import { PATTERN_NODE_TYPE, PATTERN_BLOCK_NODE_TYPE } from '@contentful/experiences-core/constants';
import type { ExperienceTreeNode, ComponentTreeNode } from '@contentful/experiences-core/types';
import { EditorModeEntityStore } from '@contentful/experiences-core';
import { deserializePatternNode, resolvePattern } from './patternUtils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { patternsRegistry } from '@/store/registries';

const patternEntry = createPatternEntry({
  id: 'pattern-id',
  schemaVersion: '2023-09-28',
});

describe('deserializePatternNode', () => {
  beforeEach(() => {
    patternsRegistry.set(patternEntry.sys.id, {
      sys: { id: patternEntry.sys.id, type: 'Link', linkType: 'Entry' },
    });
  });

  afterEach(() => {
    patternsRegistry.clear();
  });

  it('should correctly deserialize a simple ComponentTreeNode with no variables or children', () => {
    const node: ComponentTreeNode = {
      definitionId: 'pattern-id',
      variables: {},
      children: patternEntry.fields.componentTree.children as ComponentTreeNode['children'],
    };

    const result = deserializePatternNode({
      node,
      nodeId: 'random-node-id',
      parentId: 'root',
      patternId: 'whatever',
      patternComponentId: 'whatever',
      nodeLocation: '0',
      patternDataSource: {},
      patternUnboundValues: patternEntry.fields.unboundValues,
      componentInstanceProps: {
        [patternGeneratedVariableName]: {
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
      type: PATTERN_NODE_TYPE,
      parentId: 'root',
      data: {
        pattern: {
          componentId: 'whatever',
          id: 'whatever',
          nodeLocation: '0',
        },
        blockId: 'pattern-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [
        {
          type: PATTERN_NODE_TYPE,
          parentId: 'random-node-id',
          data: {
            pattern: {
              componentId: 'whatever',
              id: 'whatever',
              nodeLocation: '0_0',
            },
            blockId: 'contentful-container',
            id: expect.any(String),
            props: {},
            dataSource: {},
            unboundValues: {},
            breakpoints: [],
          },
          children: [
            {
              type: PATTERN_BLOCK_NODE_TYPE,
              parentId: expect.any(String),
              data: {
                pattern: {
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

describe('resolvePattern', () => {
  beforeEach(() => {
    patternsRegistry.set(patternEntry.sys.id, {
      sys: { id: patternEntry.sys.id, type: 'Link', linkType: 'Entry' },
    });
  });

  afterEach(() => {
    patternsRegistry.clear();
  });

  it('should return the input node when its type is not an pattern node type', () => {
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

    const entityStore = null;

    const result = resolvePattern({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when patternsRegistry does not have the componentId', () => {
    const node: ExperienceTreeNode = {
      type: PATTERN_NODE_TYPE,
      data: {
        blockId: 'patternId',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = null;

    // Throws warning "Entry for pattern with ID 'pattern-id' not found"
    const result = resolvePattern({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when entityStore does not have componentFields', () => {
    const node: ExperienceTreeNode = {
      type: PATTERN_NODE_TYPE,
      data: {
        pattern: {
          componentId: 'random-node-id',
          id: 'pattern-id',
          nodeLocation: null,
        },
        blockId: 'pattern-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = new EditorModeEntityStore({
      entities: [{ ...patternEntry, fields: {} }, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolvePattern({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when entityStore is null', () => {
    const node: ExperienceTreeNode = {
      type: PATTERN_NODE_TYPE,
      data: {
        pattern: {
          componentId: 'random-node-id',
          id: 'pattern-id',
          nodeLocation: null,
        },
        blockId: 'pattern-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = null;

    // Throws warning "Entry for pattern with ID 'pattern-id' not found"
    const result = resolvePattern({ node, entityStore });

    expect(result).toEqual(node);
  });

  // TODO: This tests is basically a plain snapshot test and missing specific assertions.
  // Also it is testing almost completley the same as above for `deserializePatternNode`.
  it('returns a deserialized pattern node with unboundValues and props', () => {
    const node = createPatternNode({
      id: 'random-node-id',
      unboundValueKey: 'unbound_uuid1Experience',
      unboundValue: 'New year Eve',
    });

    const entityStore = new EditorModeEntityStore({
      entities: [patternEntry, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolvePattern({ node, entityStore });

    expect(result).not.toEqual(node);
    expect(result).toEqual({
      type: PATTERN_NODE_TYPE,
      parentId: 'root',
      data: {
        pattern: {
          componentId: 'random-node-id',
          id: 'pattern-id',
          nodeLocation: null,
        },
        blockId: 'pattern-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [
        {
          type: PATTERN_BLOCK_NODE_TYPE,
          parentId: 'random-node-id',
          data: {
            pattern: {
              componentId: 'random-node-id',
              id: 'pattern-id',
              nodeLocation: '0',
            },
            blockId: 'contentful-container',
            id: expect.any(String),
            props: {},
            dataSource: {},
            unboundValues: {},
            breakpoints: [],
          },
          children: [
            {
              type: PATTERN_BLOCK_NODE_TYPE,
              parentId: expect.any(String),
              data: {
                pattern: {
                  componentId: 'random-node-id',
                  id: 'pattern-id',
                  nodeLocation: '0_0',
                },
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

  it('returns a deserialized pattern node with a bound value', () => {
    const node = createPatternNode({
      id: 'random-node-id',
      boundValueKey: 'bound_uuid1Experience',
    });

    const entityStore = new EditorModeEntityStore({
      entities: [patternEntry, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolvePattern({ node, entityStore });

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
