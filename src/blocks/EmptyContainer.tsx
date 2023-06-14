import { ReactComponent as EmptyStateIcon } from './emptyState.svg'
import React from 'react'
import { useInteraction } from '../hooks'

import './EmptyContainer.css'

export interface EmptyContainerProps {
  isFirst?: boolean
  isDragging?: boolean
  isHoveringOnRoot?: boolean
}

export const EmptyContainer = ({
  isFirst = true,
  isDragging = false,
  isHoveringOnRoot = false,
}: EmptyContainerProps) => {
  const { onComponentDropped, isMouseOver, onMouseOver, onMouseLeave } = useInteraction()

  const showContent = isFirst ? !isDragging || (isDragging && !isMouseOver) : false

  const isHighlighted = isDragging && (isHoveringOnRoot || isMouseOver)

  return (
    <div
      id="EmptyContainer"
      data-type="empty-container"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className={`container ${isHighlighted ? 'highlight' : ''}`}
      onMouseUp={() => {
        onComponentDropped({ node: { type: 'root', data: { id: 'root' } }, index: 0 })
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
