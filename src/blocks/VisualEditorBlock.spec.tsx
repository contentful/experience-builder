import React from 'react'
import { VisualEditorBlock } from './VisualEditorBlock'
import { render, fireEvent } from '@testing-library/react'
import { CompositionComponentNode } from '../types'
import * as useComponents from '../hooks/useComponents'
import * as useInteractionHook from '../hooks/useInteraction'

const TestComponent = ({ ...props }) => {
  return <div data-test-id="test-component" {...props} />
}

jest.mock('../hooks/useCommunication.ts', () => {
  return {
    useCommunication: () => {
      return { sendMessage: jest.fn() }
    },
  }
})

const childNode: CompositionComponentNode = {
  type: 'block',
  data: {
    id: 'random-child-node-1',
    blockId: 'test-component',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
    pathOverrides: {},
  },
  children: [],
}

const parentNode: CompositionComponentNode = {
  type: 'block',
  data: {
    id: 'parent-node',
    blockId: 'test-component',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
    pathOverrides: {},
  },
  children: [childNode],
}

const rootNode: CompositionComponentNode = {
  type: 'root',
  data: {
    id: 'tree-root',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
    pathOverrides: {},
  },
  children: [parentNode],
}

const renderComponent = async (props = {}) => {
  const defaultProps = {
    node: parentNode,
    locale: 'en-US',
    dataSource: {},
    unboundValues: {},
    isDragging: false,
    isSelected: false,
    parentNode: rootNode,
    resolveDesignValue: jest.fn(),
  }

  return render(<VisualEditorBlock {...defaultProps} {...props} />)
}

describe('Visual Editor Block', () => {
  it('should call mouse up event if parent allows children', async () => {
    jest.spyOn(useComponents, 'useComponents').mockImplementation(() => {
      return {
        getComponent: jest.fn().mockReturnValue({
          component: TestComponent,
          componentDefinition: {
            id: 'test-component',
            name: 'TestComponent',
            children: true,
            variables: {
              name: {
                type: 'Link',
                linkType: 'Asset',
              },
              isChecked: {
                type: 'Boolean',
              },
            },
          },
        }),
      } as any
    })

    const mock = {
      isMouseOver: false,
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onComponentDropped: jest.fn(),
    }

    jest.spyOn(useInteractionHook, 'useInteraction').mockImplementation(() => mock)

    const { getAllByTestId } = await renderComponent()

    expect(getAllByTestId('test-component')).toHaveLength(2)
    fireEvent.mouseUp(getAllByTestId('test-component')[0])

    expect(mock.onComponentDropped).toHaveBeenCalled()
  })

  it('should not call mouse up event if parent does not allow children', async () => {
    jest.spyOn(useComponents, 'useComponents').mockImplementation(() => {
      return {
        getComponent: jest.fn().mockReturnValue({
          component: TestComponent,
          componentDefinition: {
            id: 'test-component',
            name: 'TestComponent',
            variables: {
              name: {
                type: 'Link',
                linkType: 'Asset',
              },
              isChecked: {
                type: 'Boolean',
              },
            },
          },
        }),
      } as any
    })

    const mock = {
      isMouseOver: false,
      onMouseEnter: jest.fn(),
      onMouseLeave: jest.fn(),
      onComponentDropped: jest.fn(),
    }

    jest.spyOn(useInteractionHook, 'useInteraction').mockImplementation(() => mock)

    const { getAllByTestId } = await renderComponent()

    expect(getAllByTestId('test-component')).toHaveLength(1)

    fireEvent.mouseUp(getAllByTestId('test-component')[0])

    expect(mock.onComponentDropped).not.toHaveBeenCalled()
  })
})
