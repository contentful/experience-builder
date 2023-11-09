import React from 'react';

import type { EntityStore } from '../../core/preview/EntityStore';
import { fireEvent, render } from '@testing-library/react';

import { sendMessage } from '../../communication/sendMessage';
import {
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
  DESIGN_COMPONENT_NODE_TYPE,
} from '../../constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import { CompositionComponentNode } from '../../types';
import { VisualEditorBlock } from './VisualEditorBlock';
import { createDesignComponentEntry } from '../../../test/__fixtures__/composition';
import { EditorModeEntityStore } from '../../core/editor/EditorModeEntityStore';
import { assets } from '../../../test/__fixtures__/entities';
import { Asset, Entry } from 'contentful';
import { designComponentsRegistry } from './VisualEditorContext';

const TestComponent = (props: any) => {
  return <div {...props}>{props.text}</div>;
};

const designComponentEntry = createDesignComponentEntry({
  id: 'design-component-id',
  schemaVersion: '2023-09-28',
});

jest.mock('../../communication/sendMessage', () => ({
  sendMessage: jest.fn(),
}));

jest.mock('./useEditorContext', () => ({
  useEditorContext: () => ({
    selectedNodeId: '1',
    setSelectedNodeId: jest.fn(),
  }),
}));
jest.mock('../../constants', () => ({
  ...jest.requireActual('../../constants'),
  SDK_VERSION: 'test',
}));

describe('VisualEditorBlock', () => {
  beforeEach(() => {
    defineComponents([
      {
        component: TestComponent,
        definition: {
          id: 'custom-component',
          name: 'section',
          variables: {
            text: {
              displayName: 'Text',
              type: 'Text',
              defaultValue: 'Subheading',
            },
          },
        },
      },
    ]);

    designComponentsRegistry.set(designComponentEntry.sys.id, {
      sys: { id: designComponentEntry.sys.id, type: 'Link', linkType: 'Entry' },
    });
  });

  afterEach(() => {
    resetComponentRegistry();
    designComponentsRegistry.clear();
  });

  it('renders with initial text and updates when prop changes', () => {
    const mockCompositionComponentNode: CompositionComponentNode = {
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

    // Render the component with the initial text
    const { rerender } = render(
      <VisualEditorBlock
        node={mockCompositionComponentNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: {} as EntityStore }}
        unboundValues={mockCompositionComponentNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(sendMessage).toHaveBeenCalled();

    rerender(
      <VisualEditorBlock
        node={mockCompositionComponentNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: {} as EntityStore }}
        unboundValues={mockCompositionComponentNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    );

    // check if it is called it again
    expect(sendMessage).toHaveBeenCalled();
  });

  it('renders section node', () => {
    const sectionNode: CompositionComponentNode = {
      type: 'block',
      data: {
        id: 'section-id',
        blockId: CONTENTFUL_SECTION_ID,
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const { getByTestId } = render(
      <VisualEditorBlock
        node={sectionNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: {} as EntityStore }}
        unboundValues={sectionNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(getByTestId('contentful-container')).toBeDefined();
  });

  it('renders container node', () => {
    const containerNode: CompositionComponentNode = {
      type: 'block',
      data: {
        id: 'section-id',
        blockId: CONTENTFUL_CONTAINER_ID,
        props: {},
        dataSource: {},
        unboundValues: {},
        breakpoints: [],
      },
      children: [],
    };

    const { getByTestId } = render(
      <VisualEditorBlock
        node={containerNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: {} as EntityStore }}
        unboundValues={containerNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(getByTestId('contentful-container')).toBeDefined();
  });

  it('renders design component node', () => {
    const designComponentEntry = createDesignComponentEntry({
      id: 'design-component-id',
      schemaVersion: '2023-09-28',
    });

    const entityStore = new EditorModeEntityStore({
      entities: [designComponentEntry, ...assets] as Array<Entry | Asset>,
      locale: 'en-US',
    });

    const designComponentNode: CompositionComponentNode = {
      type: DESIGN_COMPONENT_NODE_TYPE,
      data: {
        id: 'random-design-component-id',
        blockId: designComponentEntry.sys.id,
        props: {},
        dataSource: {},
        unboundValues: designComponentEntry.fields.unboundValues,
        breakpoints: [],
      },
      children: [],
    };

    const { getByTestId, getByText } = render(
      <VisualEditorBlock
        node={designComponentNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: entityStore }}
        unboundValues={designComponentNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    );

    expect(getByTestId('design-component')).toBeInTheDocument();
    expect(getByTestId('contentful-container')).toBeInTheDocument();
    expect(getByText('custom component title')).toBeInTheDocument();

    fireEvent.mouseDown(getByText('custom component title'));
    expect(sendMessage).toHaveBeenCalledWith('componentSelected', {
      nodeId: designComponentNode.data.id,
    });
  });
});
