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
  const { onComponentDropped } = useInteraction()

  const showContent = isFirst ? !isDragging || isDragging : false

  return (
    <div
      id="EmptyContainer"
      data-type="empty-container"
      className={`container`}
      onMouseUp={() => {
        onComponentDropped({
          node: {
            type: 'root',
            data: { id: 'root', props: {}, dataSource: {}, unboundValues: {} },
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
