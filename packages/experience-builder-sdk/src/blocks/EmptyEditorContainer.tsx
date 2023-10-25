import React from 'react'
import { onComponentDropped } from '../communication/onComponentDrop'
import EmptyStateIcon from '../svg/emptyState.svg?react'
import '../styles/EmptyContainer.css'

export interface EmptyContainerProps {
  isFirst?: boolean
  isDragging?: boolean
  isHoveringOnRoot?: boolean
}

export const EmptyEditorContainer = ({
  isFirst = true,
  isDragging = false,
}: EmptyContainerProps) => {
  return (
    <div
      id="EmptyContainer"
      className={isDragging ? 'highlight' : undefined}
      data-type="empty-container"
      onMouseUp={() => {
        if (!isDragging) {
          return
        }

        onComponentDropped({
          node: {
            type: 'root',
            data: { id: 'root', props: {}, dataSource: {}, unboundValues: {}, breakpoints: [] },
            children: [],
          },
        })
      }}>
      {isFirst || isDragging ? (
        <>
          <EmptyStateIcon />
          <span className="icon">Add components to begin</span>
        </>
      ) : null}
    </div>
  )
}
