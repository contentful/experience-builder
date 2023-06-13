import React from 'react'
import { tokens } from '../coreLayouts'
import { css, cx } from '../emotionStub'
import { ReactComponent as EmptyStateIcon } from './emptyState.svg'
import { useInteraction } from '../hooks'
import { useDynamicStyles } from '../hooks/useDynamicStyle'

const styles = {
  container: css({
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    color: tokens.gray500,
    fontSize: tokens.fontSizeM,
    fontFamily: tokens.fontStackPrimary,
    border: `1px dashed ${tokens.gray500}`,
  }),
  highlight: css({
    border: `1px dashed ${tokens.blue500}`,
    backgroundColor: tokens.blue100,
  }),
  icon: css({
    marginLeft: tokens.spacingS,
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

  const { isStyleReady } = useDynamicStyles({
    classNames: [styles.container, styles.highlight, styles.icon],
  })
  if (!isStyleReady) {
    return null
  }

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
