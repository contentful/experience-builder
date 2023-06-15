import React from 'react'
import { color } from '../core'
import { css } from '@emotion/css'

const styles = {
  lineHorizontal: css({
    height: '3px',
    background: color.blue500,
    margin: '10px',
    position: 'relative',
  }),
  lineHorizontalTransparent: css({
    height: '3px',
    margin: '10px',
    position: 'relative',
  }),
  text: css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: color.blue200,
    border: `1px dotted ${color.blue500}`,
    borderRadius: '5px',
    padding: '5px',
    color: color.blue500,
  }),
  textTransparent: css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: `1px dotted transparent`,
    borderRadius: '5px',
    padding: '5px',
    color: 'transparent',
  }),
}

export const ContentfulSectionIndicator = () => {
  return (
    <div key="lineIndicator_new_section" className={styles.lineHorizontal}>
      <div className={styles.text}>New section</div>
    </div>
  )
}

export const ContentfulSectionIndicatorPlaceholder = () => {
  return (
    <div key="lineIndicator_new_section_placeholder" className={styles.lineHorizontalTransparent}>
      <div className={styles.textTransparent}>New section</div>
    </div>
  )
}
