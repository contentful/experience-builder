import React from 'react'
import { render } from '@testing-library/react'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EntityStore } from '@contentful/visual-sdk'
import { CompositionComponentNode, StyleProps } from '../types'

import { sendMessage } from '../communication/sendMessage'

const TestComponent = (props: any) => {
  return <div {...props}>{props.text}</div>
}

jest.mock('../communication/sendMessage', () => ({
  sendMessage: jest.fn(),
}))
jest.mock('../core/componentRegistry', () => ({
  getComponentRegistration: () => ({
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
  }),
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

const mockCompositionComponentNode: CompositionComponentNode = {
  type: 'block',
  data: {
    id: '1',
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

describe('VisualEditorBlock', () => {
  it('renders with initial text and updates when prop changes', () => {
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
})
