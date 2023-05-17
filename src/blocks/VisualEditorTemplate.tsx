import tokens from '@contentful/f36-tokens'
import { css } from '@emotion/css'
import React, { useRef } from 'react'
import { BindingMapByBlockId, BoundData, OutcomingExperienceBuilderEvent } from '../types'
import { useCommunication } from '../hooks/useCommunication'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'

const styles = {
  hover: css({
    padding: '1rem',
    ':hover': {
      border: `3px solid ${tokens.blue500}`,
    },
  }),
}

type VisualEditorTemplateProps = {
  node: any
  binding: BindingMapByBlockId
  boundData: BoundData
}

export const VisualEditorTemplate = ({ node, binding, boundData }: VisualEditorTemplateProps) => {
  const wasMousePressed = useRef(false)
  const { sendMessage } = useCommunication()
  const { onComponentDropped } = useInteraction()

  const children = node.children.map((childNode: any) => (
    <VisualEditorBlock
      key={childNode.data.id}
      template={node}
      node={childNode}
      binding={binding}
      boundData={boundData}
    />
  ))

  return React.createElement(
    'div',
    {
      'data-template-id': node.data.blockId,
      onMouseUp: () => {
        if (!wasMousePressed.current) {
          onComponentDropped({ node, template: node })
        }
        wasMousePressed.current = false
        console.log('mouseUp inside iframe')
      },
      onMouseDown: (e: MouseEvent) => {
        e.preventDefault()
        wasMousePressed.current = true
        sendMessage(OutcomingExperienceBuilderEvent.COMPONENT_SELECTED, { node, template: node })
      },
      className: styles.hover,
    },
    children
  )
}
