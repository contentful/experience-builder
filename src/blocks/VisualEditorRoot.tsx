import React from 'react'
import { Experience } from '../types'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyEditorContainer } from './EmptyEdtorContainer'
import { useContentfulSection } from '../hooks/useContentfulSection'
import { EmptyDeliveryContainer } from './EmptyDeliveryContainer'

import './VisualEditorRoot.css'

type VisualEditorRootProps = {
  experience: Experience
  locale: string
}

export const VisualEditorRoot = ({ experience, locale }: VisualEditorRootProps) => {
  const { onComponentDropped } = useInteraction()
  useContentfulSection()

  const { tree, dataSource, isDragging, selectedNodeId, mode } = experience

  if (!tree?.root.children.length) {
    if (mode === 'editor') {
      return React.createElement(EmptyEditorContainer, { isDragging }, [])
    } else {
      return React.createElement(EmptyDeliveryContainer)
    }
  }

  return React.createElement(
    'div',
    {
      id: 'VisualEditorRoot',
      className: 'root',
      onMouseUp: () => {
        if (mode === 'editor') {
          onComponentDropped({ node: tree.root })
        }
      },
      'data-type': 'root',
    },
    [
      tree.root.children.map((node: any) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          locale={locale}
          dataSource={dataSource}
          isDragging={isDragging}
          selectedNodeId={selectedNodeId}
          parentNode={tree.root}
        />
      )),
    ]
  )
}
