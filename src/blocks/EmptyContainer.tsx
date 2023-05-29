import { css, cx } from '@emotion/css'
import { ReactComponent as EmptyStateIcon } from './emptyState.svg'
import React, { useState } from 'react'
import tokens from '@contentful/f36-tokens'
import { useInteraction } from '../hooks'

const styles = {
  emptyContainer: css({
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
  activeState: css({
    border: `1px dashed ${tokens.blue500}`,
    backgroundColor: tokens.blue100,
  }),
  icon: css({
    marginLeft: tokens.spacingS,
  }),
}

export interface EmptyContainerProps {
  isFirst?: boolean;
  isDragging?: boolean;
}

export const EmptyContainer = ({ isFirst = true, isDragging = false }: EmptyContainerProps) => {
  const { onComponentDropped } = useInteraction()
  const [isHovering, setIsHovering] = useState(false)

  const showContent = isFirst ? (!isDragging || isDragging && !isHovering) : false

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={isDragging && isHovering ? cx(styles.emptyContainer, styles.activeState) : styles.emptyContainer}
      onMouseUp={() => {
        onComponentDropped({ node: { type: 'root', data: { id: 'root' } } })
      }}>
      {showContent ?
        <>
          <EmptyStateIcon />
          <span className={styles.icon}>Add components to begin</span>
        </>
        : null}
    </div>
  )
}
