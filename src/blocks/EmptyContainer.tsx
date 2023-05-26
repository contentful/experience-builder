import { css } from '@emotion/css'
import { ReactComponent as EmptyStateIcon } from './emptyState.svg'
import React from 'react'
import tokens from '@contentful/f36-tokens'

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
    '&:hover': {
      border: `1px dashed ${tokens.blue500}`,
      backgroundColor: tokens.blue100,
    },
  }),
  icon: css({
    marginLeft: tokens.spacingS,
  }),
}

export const EmptyContainer = ({ onComponentDropped, isFirst = true }: any) => {
  return (
    <div
      className={styles.emptyContainer}
      onMouseUp={() => {
        onComponentDropped({ node: { data: { id: 'root' } } })
      }}>
        {isFirst ?
          <>
      <EmptyStateIcon />
      <span className={styles.icon}>Add components to begin</span>
        </>
        : null }
    </div>
  )
}
