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

  const { tree, dataSource, isDragging, selectedNodeId, mode, unboundValues } = experience

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
          locale={locale}
          dataSource={dataSource}
					unboundValues={unboundValues}
          isDragging={isDragging}
          selectedNodeId={selectedNodeId}
          parentNode={tree.root}
        />
      )),
    ]
  )
}
