import { Asset, Entry } from 'contentful';
import {
  createDesignComponentEntry,
  designComponentGeneratedVariableName,
} from '../../../test/__fixtures__/composition';
import { assets } from '../../../test/__fixtures__/entities';
import { designComponentsRegistry } from '../../blocks/editor/VisualEditorContext';
import { DESIGN_COMPONENT_BLOCK_NODE_TYPE, DESIGN_COMPONENT_NODE_TYPE } from '../../constants';
import { CompositionComponentNode, CompositionNode } from '../../types';
import { EditorModeEntityStore } from '@contentful/experience-builder-core';
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
                props: { text: { key: 'text_uuid1DesignComponent', type: 'ComponentValue' } },
                dataSource: {},
                unboundValues: {
                  text_uuid1DesignComponent: {
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

    const result = resolveDesignComponent({ node, entityStore });

    expect(result).toEqual(node);
  });

  it('should return a deserialized design component node with unboundValues and props', () => {
    const node: CompositionComponentNode = {
      type: DESIGN_COMPONENT_NODE_TYPE,
      data: {
        blockId: 'design-component-id',
        id: 'random-node-id',
        props: {
          [designComponentGeneratedVariableName]: {
            type: 'UnboundValue',
            key: 'unbound_uuid1Experience',
          },
        },
        dataSource: {},
        unboundValues: {
          unbound_uuid1Experience: { value: 'New year Eve' },
        },
        breakpoints: [],
      },
      children: [],
      parentId: 'root',
    };

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
                    key: designComponentGeneratedVariableName,
                    type: 'ComponentValue',
                  },
                },
                dataSource: {},
                unboundValues: {
                  [designComponentGeneratedVariableName]: {
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
