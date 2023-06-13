import React from 'react'
import tokens from '@contentful/f36-tokens'
import { css } from '@emotion/css'

const styles = {
  lineHorizontal: css({
    height: '3px',
    background: tokens.blue500,
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
    background: tokens.blue200,
    border: `1px dotted ${tokens.blue500}`,
    borderRadius: '5px',
    padding: '5px',
    color: tokens.blue500,
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
