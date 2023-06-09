import tokens from '@contentful/f36-tokens'
import { css } from '@emotion/css'
import React, { useState } from 'react'
import { Experience } from '../types'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyContainer } from './EmptyContainer'
import { useContentfulSection } from '../hooks/useContentfulSection'
import { ContentfulSectionIndicator } from './ContentfulSectionIndicator'

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
  const [isHoveringOnRoot, setIsHoveringOnRoot] = useState(false)

  const { tree, dataSource, isDragging, selectedNodeId } = experience

  const onMouseOver = (e: React.MouseEvent) => {
    if (!(e.currentTarget instanceof HTMLElement)) {
      return
    }
    if (['root', 'empty-container'].includes(e.currentTarget.dataset.type || '')) {
      setIsHoveringOnRoot(true)
    }
  }

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
      onMouseOver,
      onMouseOut: () => setIsHoveringOnRoot(false),
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
        />
      )),
    ]
  )
}
