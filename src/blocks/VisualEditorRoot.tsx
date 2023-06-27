import React from 'react'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyEditorContainer } from './EmptyEditorContainer'

import './VisualEditorRoot.css'
import { useCompositionContext } from '../connection/CompositionContext'

export const VisualEditorRoot = () => {
  const { experience, locale } = useCompositionContext()
  const { onComponentDropped } = useInteraction()

  if (!experience) {
    return React.createElement(EmptyEditorContainer, {}, [])
  }

  const { tree, dataSource, isDragging, selectedNodeId } = experience

  if (!tree?.root.children.length) {
    return React.createElement(EmptyEditorContainer, { isDragging }, [])
  }

  return React.createElement(
    'div',
    {
      id: 'VisualEditorRoot',
      className: 'root',
      onMouseUp: () => {
        onComponentDropped({ node: tree.root })
      },
      'data-type': 'root',
    },
    [
      tree.root.children.map((node: any) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          locale={locale ?? 'en-US'}
          dataSource={dataSource}
          isDragging={isDragging}
          isSelected={selectedNodeId === node.data.id}
          parentNode={tree.root}
        />
      )),
    ]
  )
}
