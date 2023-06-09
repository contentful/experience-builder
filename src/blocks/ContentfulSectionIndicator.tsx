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
}

export const ContentfulSectionIndicator = () => {
  return (
    <div key="lineIndicator" className={styles.lineHorizontal}>
      <div className={styles.text}>New section</div>
    </div>
  )
}
