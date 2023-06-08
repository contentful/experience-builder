import { css } from '@emotion/css'
import React, { useState } from 'react'
import { Experience } from '../types'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyContainer } from './EmptyContainer'
import { useContentfulSection } from '../hooks/useContentfulSection'

const styles = {
  root: css({
    minHeight: '45vh',
    paddingBottom: '100px',
    overflow: 'scroll',
  }),
}

type VisualEditorRootProps = {
  experience: Experience
  locale: string
}

export const VisualEditorRoot = ({ experience, locale }: VisualEditorRootProps) => {
  const { onComponentDropped } = useInteraction()
  useContentfulSection()

  const { tree, dataSource, isDragging, selectedNodeId } = experience

  if (!tree?.root.children.length) {
    return React.createElement(EmptyContainer, { isDragging }, [])
  }

  return React.createElement(
    'div',
    {
      className: styles.root,
      onMouseUp: () => {
        onComponentDropped({ node: tree.root, index: 0 })
      },
      'data-type': 'root',
    },
    [
      tree.root.children.map((node: any, index) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          locale={locale}
          dataSource={dataSource}
          isDragging={isDragging}
          isSelected={selectedNodeId === node.data.id}
          rootNode={tree.root}
          index={index}
        />
      )),
    ]
  )
}
