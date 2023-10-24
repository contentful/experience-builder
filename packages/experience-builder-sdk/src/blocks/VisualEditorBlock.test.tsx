import React from 'react'
import { render } from '@testing-library/react'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EntityStore } from '@contentful/visual-sdk'
import { CompositionComponentNode } from '../types'

import { sendMessage } from '../communication/sendMessage'
import { defineComponents, resetComponentRegistry } from '../core/componentRegistry'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'

const TestComponent = (props: any) => {
  return <div {...props}>{props.text}</div>
}

jest.mock('../communication/sendMessage', () => ({
  sendMessage: jest.fn(),
}))

jest.mock('./useEditorContext', () => ({
  useEditorContext: () => ({
    selectedNodeId: '1',
    setSelectedNodeId: jest.fn(),
  }),
}))
jest.mock('../core/constants', () => ({
  SDK_VERSION: 'test',
}))

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
    ])
  })

  afterEach(() => {
    resetComponentRegistry()
  })

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
    }

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
    )

    expect(sendMessage).toHaveBeenCalled()

    rerender(
      <VisualEditorBlock
        node={mockCompositionComponentNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: {} as EntityStore }}
        unboundValues={mockCompositionComponentNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    )

    // check if it is called it again
    expect(sendMessage).toHaveBeenCalled()
  })

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
    }

    render(
      <VisualEditorBlock
        node={sectionNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: {} as EntityStore }}
        unboundValues={sectionNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    )

    expect(document.getElementById('ContentfulContainer')).toBeDefined()
  })

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
    }

    render(
      <VisualEditorBlock
        node={containerNode}
        dataSource={{}}
        areEntitiesFetched={true}
        entityStore={{ current: {} as EntityStore }}
        unboundValues={containerNode.data.unboundValues}
        resolveDesignValue={jest.fn()}
      />
    )

    expect(document.getElementById('ContentfulContainer')).toBeDefined()
  })
})
