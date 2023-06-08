import { css, cx } from '@emotion/css'
import { ReactComponent as EmptyStateIcon } from './emptyState.svg'
import React, { useState } from 'react'
import tokens from '@contentful/f36-tokens'
import { useInteraction } from '../hooks'

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

  const showContent = isFirst ? !isDragging || (isDragging && !isMouseOver) : false

  const isHighlighted = isDragging && (isHoveringOnRoot || isMouseOver)

  return (
    <div
      data-type="empty-container"
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className={isHighlighted ? cx(styles.container, styles.highlight) : styles.container}
      onMouseUp={() => {
        console.log("DROPPER: In empty container")
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
