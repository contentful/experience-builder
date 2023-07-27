import React, { useEffect } from 'react'
import { Experience } from '../types'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyEditorContainer } from './EmptyEdtorContainer'

import './VisualEditorRoot.css'
import { useHoverIndicator } from '../hooks/useHoverIndicator'
import { onComponentDropped } from '../communication/onComponentDrop'

type VisualEditorRootProps = {
  experience: Experience
  locale: string
}

export const VisualEditorRoot = ({ experience, locale }: VisualEditorRootProps) => {
  useHoverIndicator()

  const { tree, dataSource, isDragging, selectedNodeId, unboundValues } = experience

  useEffect(() => {
    if (!tree || !tree?.root.children.length) return
    const onMouseUp = () => {
      onComponentDropped({ node: tree.root })
    }
    document.addEventListener('mouseup', onMouseUp)
    return () => document.removeEventListener('mouseup', onMouseUp)
  }, [tree])

  if (!tree?.root.children.length) {
    return React.createElement(EmptyEditorContainer, { isDragging }, [])
  }

  return React.createElement(
    'div',
    {
      id: 'VisualEditorRoot',
      className: 'root',
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
