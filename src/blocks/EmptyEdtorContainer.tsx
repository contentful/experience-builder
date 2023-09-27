import { ReactComponent as EmptyStateIcon } from '../svg/emptyState.svg'
import React from 'react'

import './EmptyContainer.css'
import { onComponentDropped } from '../communication/onComponentDrop'

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
      data-type="empty-container"
      className={`container`}
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
