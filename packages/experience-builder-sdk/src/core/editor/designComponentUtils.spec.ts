import { Asset, Entry } from 'contentful';
import {
  createDesignComponentEntry,
  createDesignComponentNode,
  designComponentGeneratedVariableName,
} from '../../../test/__fixtures__/designComponent';
import { assets } from '../../../test/__fixtures__/entities';
import { designComponentsRegistry } from '../../blocks/editor/VisualEditorContext';
import { DESIGN_COMPONENT_BLOCK_NODE_TYPE, DESIGN_COMPONENT_NODE_TYPE } from '../../constants';
import { CompositionComponentNode, CompositionNode } from '../../types';
import { EditorModeEntityStore } from './EditorModeEntityStore';
import { deserializeDesignComponentNode, resolveDesignComponent } from './designComponentUtils';

const designComponentEntry = createDesignComponentEntry({
  id: 'design-component-id',
  schemaVersion: '2023-09-28',
});

describe('deserializeDesignComponentNode', () => {
  beforeEach(() => {
    designComponentsRegistry.set(designComponentEntry.sys.id, {
      sys: { id: designComponentEntry.sys.id, type: 'Link', linkType: 'Entry' },
    });
  });

  afterEach(() => {
    designComponentsRegistry.clear();
  });

  it('should correctly deserialize a simple CompositionNode with no variables or children', () => {
    const node: CompositionNode = {
      definitionId: 'design-component-id',
      variables: {},
      children: designComponentEntry.fields.componentTree.children as CompositionNode['children'],
    };

    const result = deserializeDesignComponentNode({
      node,
      nodeId: 'random-node-id',
      parentId: 'root',
      designComponentDataSource: {},
      designComponentUnboundValues: designComponentEntry.fields.unboundValues,
      componentInstanceProps: {
        [designComponentGeneratedVariableName]: {
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
      type: DESIGN_COMPONENT_NODE_TYPE,
      parentId: 'root',
      data: {
        blockId: 'design-component-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [
        {
          type: DESIGN_COMPONENT_BLOCK_NODE_TYPE,
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
              type: DESIGN_COMPONENT_BLOCK_NODE_TYPE,
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

describe('resolveDesignComponent', () => {
  beforeEach(() => {
    designComponentsRegistry.set(designComponentEntry.sys.id, {
      sys: { id: designComponentEntry.sys.id, type: 'Link', linkType: 'Entry' },
    });
  });

  afterEach(() => {
    designComponentsRegistry.clear();
  });

  it('should return the input node when its type is not a design component node type', () => {
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

    const result = resolveDesignComponent({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when designComponentsRegistry does not have the componentId', () => {
    const node: CompositionComponentNode = {
      type: DESIGN_COMPONENT_NODE_TYPE,
      data: {
        blockId: 'design-componentId',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = null;

    // Throws warning "Entry for design component with ID 'design-component-id' not found"
    const result = resolveDesignComponent({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when entityStore does not have componentFields', () => {
    const node: CompositionComponentNode = {
      type: DESIGN_COMPONENT_NODE_TYPE,
      data: {
        blockId: 'design-component-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = new EditorModeEntityStore({
      entities: [{ ...designComponentEntry, fields: {} }, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolveDesignComponent({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return the input node when entityStore is null', () => {
    const node: CompositionComponentNode = {
      type: DESIGN_COMPONENT_NODE_TYPE,
      data: {
        blockId: 'design-component-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const entityStore = null;

    // Throws warning "Entry for design component with ID 'design-component-id' not found"
    const result = resolveDesignComponent({ node, entityStore });

    expect(result).toEqual(node);
  });

  // TODO: This tests is basically a plain snapshot test and missing specific assertions.
  // Also it is testing almost completley the same as above for `deserializeDesignComponentNode`.
  it('returns a deserialized design component node with unboundValues and props', () => {
    const node = createDesignComponentNode({
      id: 'random-node-id',
      unboundValueKey: 'unbound_uuid1Experience',
      unboundValue: 'New year Eve',
    });

    const entityStore = new EditorModeEntityStore({
      entities: [designComponentEntry, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolveDesignComponent({ node, entityStore });

    expect(result).not.toEqual(node);
    expect(result).toEqual({
      type: DESIGN_COMPONENT_NODE_TYPE,
      parentId: 'root',
      data: {
        blockId: 'design-component-id',
        id: 'random-node-id',
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [
        {
          type: DESIGN_COMPONENT_BLOCK_NODE_TYPE,
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
              type: DESIGN_COMPONENT_BLOCK_NODE_TYPE,
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

  it('returns a deserialized design component node with a bound value', () => {
    const node = createDesignComponentNode({
      id: 'random-node-id',
      boundValueKey: 'bound_uuid1Experience',
    });

    const entityStore = new EditorModeEntityStore({
      entities: [designComponentEntry, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const result = resolveDesignComponent({ node, entityStore });

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
