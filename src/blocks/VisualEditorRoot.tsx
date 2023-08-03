import React from 'react'
import { Experience } from '../types'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyEditorContainer } from './EmptyEditorContainer'

import './VisualEditorRoot.css'
import { useHoverIndicator } from '../hooks/useHoverIndicator'
import { useBreakpoints } from '../hooks/useBreakpoints'

type VisualEditorRootProps = {
  experience: Experience
  defaultLocaleCode: string
}

export const VisualEditorRoot = ({ experience, defaultLocaleCode }: VisualEditorRootProps) => {
  const { tree, dataSource, isDragging, selectedNodeId, unboundValues, breakpoints, config } =
    experience

  const { locale } = config

  const { onComponentDropped } = useInteraction()
  // We call it here instead of on block-level to avoid registering too many even listeners for media queries
  const { resolveDesignValue } = useBreakpoints(breakpoints)
  useHoverIndicator()

  if (!tree?.root.children.length) {
    return React.createElement(EmptyEditorContainer, { isDragging }, [])
  }

  return React.createElement(
    'div',
    {
      id: 'VisualEditorRoot',
      className: 'root',
      onMouseUp: () => {
        onComponentDropped({ node: { ...tree.root, type: 'editorRoot' } })
      },
      'data-type': 'root',
    },
    [
      tree.root.children.map((node: any) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          selectedLocaleCode={locale || defaultLocaleCode}
          defaultLocaleCode={defaultLocaleCode}
          dataSource={dataSource}
          unboundValues={unboundValues}
          isDragging={isDragging}
          selectedNodeId={selectedNodeId}
          parentNode={tree.root}
          resolveDesignValue={resolveDesignValue}
        />
      )),
    ]
  )
}
