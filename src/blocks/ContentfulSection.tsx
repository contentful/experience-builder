import React from 'react'

import '../styles/ContentfulSection.css'

import classNames from 'classnames'
import { ContentfulSectionAsHyperlink } from './ContentfulSectionAsHyperlink'
import type { ContentfulSectionProps } from './ContentfulSectionAsHyperlink'
import { Flex } from '../core'

export const ContentfulSection = (sectionProps: ContentfulSectionProps) => {
  const { children, className, editorMode } = sectionProps
  if (sectionProps.cfHyperlink) {
    return <ContentfulSectionAsHyperlink {...sectionProps}>{children}</ContentfulSectionAsHyperlink>
  }

  if (editorMode === false) {
    return (
      <Flex id="ContentfulSection" className={classNames(className, 'defaultStyles')}>
        {children}
      </Flex>
    )
  }

  // Extract properties that are only available in editor mode
  const { node, onMouseDown } = sectionProps

  return (
    <Flex
      id="ContentfulSection"
      data-cf-node-id={node.data.id}
      data-cf-node-block-id={node.data.blockId}
      data-cf-node-block-type={node.type}
      className={classNames(className, 'defaultStyles')}
      onMouseDown={onMouseDown}>
      {children}
    </Flex>
  )
}
