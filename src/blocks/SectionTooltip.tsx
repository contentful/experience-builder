import React from 'react'
import { color, typography, spacing, Flex, CopyIcon, DeleteIcon } from '../core'
import { css } from '@emotion/css'

const styles = {
  tooltip: css({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'absolute',
    top: '1px',
    right: '1px',
  }),
  button: css({
    color: color.colorWhite,
    backgroundColor: color.blue500,
    border: `1px solid ${color.blue500}`,
    cursor: 'pointer',
    boxShadow: '0px 1px 0px rgb(25,37,50,0.08)',
    fontWeight: 500,
    outline: 'none',
    opacity: 1,
    minwidth: 'auto',
    maxWidth: '240px',
    minHeight: '32px',
    padding: '0.25rem 0.75rem',
    '&:hover': {
      backgroundColor: color.blue600,
      borderColor: color.blue600,
      color: color.colorWhite,
    },
    '&:active': {
      backgroundColor: color.blue700,
      borderColor: color.blue700,
      fontSize: typography.fontSizeM,
      lineHeight: typography.lineHeightCondensed,
      padding: `${spacing.spacing2Xs} ${spacing.spacingS}`,
      minHeight: '32px',
    },
    '&:focus': {
      borderColor: color.blue600,
      boxShadow: color.glowPrimary,
    },
    '&:focus:not(:focus-visible)': {
      borderColor: color.blue500,
      boxShadow: 'unset',
    },
    '&:focus-visible': {
      borderColor: color.blue600,
      boxShadow: color.glowPrimary,
    },
  }),
  wrapper: css({
    display: 'inline-flex',
    position: 'relative',
    'button:first-child': {
      borderBottomLeftRadius: '6px',
      borderTopLeftRadius: '6px',
    },

    'button:last-child': {
      borderBottomRightRadius: '6px',
      borderTopRightRadius: '6px',
    },
  }),
}

export const SectionTooltip = ({ onComponentRemoved }: { onComponentRemoved: () => void }) => {
  return (
    <Flex className={styles.tooltip}>
      <div className={styles.wrapper}>
        <button className={styles.button}>
          <CopyIcon />
        </button>
        <button
          className={styles.button}
          onClick={() => {
            onComponentRemoved()
          }}>
          <DeleteIcon />
        </button>
      </div>
    </Flex>
  )
}
