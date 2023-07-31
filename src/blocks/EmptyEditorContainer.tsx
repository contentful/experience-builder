import { ReactComponent as EmptyStateIcon } from './emptyState.svg'
import React from 'react'
import { useInteraction } from '../hooks'

import './EmptyContainer.css'

export interface EmptyContainerProps {
  isFirst?: boolean
  isDragging?: boolean
  isHoveringOnRoot?: boolean
}

export const EmptyEditorContainer = ({
  isFirst = true,
  isDragging = false,
  isHoveringOnRoot = false,
}: EmptyContainerProps) => {
  const { onComponentDropped, isMouseOver, onMouseEnter, onMouseLeave } = useInteraction()

  const showContent = isFirst ? !isDragging || (isDragging && !isMouseOver) : false

  const isHighlighted = isDragging && (isHoveringOnRoot || isMouseOver)

  return (
    <div
      id="EmptyContainer"
      data-type="empty-container"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`container ${isHighlighted ? 'highlight' : ''}`}
      onMouseUp={() => {
        onComponentDropped({
          node: {
            type: 'root',
            data: {
              id: 'root',
              props: {},
              dataSource: {},
              unboundValues: {},
              breakpoints: [],
              pathOverrides: {},
            },
            children: [],
          },
        })
      }}>
      {showContent ? (
        <>
          <EmptyStateIcon />
          <span className="icon">Add components to begin</span>
        </>
      ) : null}
    </div>
  )
}
