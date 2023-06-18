import { css } from '@emotion/css'
import React, { useState } from 'react'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyContainer } from './EmptyContainer'
import { useExperienceBuilder } from '../hooks'

const styles = {
  root: css({
    minHeight: '45vh',
    paddingBottom: '100px',
    overflow: 'scroll',
  }),
}

type VisualEditorRootProps = {
  locale: string
}

export const VisualEditorRoot = ({ locale }: VisualEditorRootProps) => {
  debugger
  const { experience } = useExperienceBuilder()
  const { onComponentDropped } = useInteraction()

  const { tree, dataSource, isDragging, selectedNodeId } = experience

  if (!tree?.root.children.length) {
    return React.createElement(EmptyContainer, { isDragging }, [])
  }

  return React.createElement(
    'div',
    {
      className: styles.root,
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
          isDragging={isDragging}
          isSelected={selectedNodeId === node.data.id}
          rootNode={tree.root}
        />
      )),
    ]
  )
}
