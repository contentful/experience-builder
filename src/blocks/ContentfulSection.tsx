import React from 'react'

import '../styles/ContentfulSection.css'

import classNames from 'classnames'
import { ContentfulSectionAsHyperlink } from './ContentfulSectionAsHyperlink'
import type { ContentfulSectionProps } from './ContentfulSectionAsHyperlink'
import { Flex } from '../core'

export const ContentfulSection = ({
  children,
  className,
  cfHyperlink,
  cfOpenInNewTab,
  editorMode,
  ...editorModeProps
}: ContentfulSectionProps) => {
  if (cfHyperlink) {
    return (
      <ContentfulSectionAsHyperlink
        className={className}
        editorMode={editorMode}
        cfHyperlink={cfHyperlink}
        cfOpenInNewTab={cfOpenInNewTab}
        onMouseDown={(editorModeProps as ContentfulSectionProps<true>).onMouseDown}
        node={(editorModeProps as ContentfulSectionProps<true>).node}>
        {children}
      </ContentfulSectionAsHyperlink>
    )
  }

  if (editorMode === false) {
    return (
      <Flex id="ContentfulSection" className={classNames(className, 'defaultStyles')}>
        {children}
      </Flex>
    )
  }

  // Extract properties that are only available in editor mode
  const { node, onMouseDown } = editorModeProps as ContentfulSectionProps<true>

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
