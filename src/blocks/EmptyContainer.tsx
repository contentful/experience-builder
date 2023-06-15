import { css, cx } from '@emotion/css'
import { ReactComponent as EmptyStateIcon } from './emptyState.svg'
import React from 'react'
import { color, typography, spacing } from '../core'
import { useInteraction } from '../hooks'

const styles = {
  container: css({
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    color: color.gray500,
    fontSize: typography.fontSizeM,
    fontFamily: typography.fontStackPrimary,
    border: `1px dashed ${color.gray500}`,
  }),
  highlight: css({
    border: `1px dashed ${color.blue500}`,
    backgroundColor: color.blue100,
  }),
  icon: css({
    marginLeft: spacing.spacingS,
  }),
}

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
      data-type="empty-container"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className={isHighlighted ? cx(styles.container, styles.highlight) : styles.container}
      onMouseUp={() => {
        onComponentDropped({ node: { type: 'root', data: { id: 'root' } } })
      }}>
      {showContent ? (
        <>
          <EmptyStateIcon />
          <span className={styles.icon}>Add components to begin</span>
        </>
      ) : null}
    </div>
  )
}
