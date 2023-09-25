import React, { MouseEventHandler } from 'react'

import { CompositionComponentNode, StyleProps } from '../types'

import './ContentfulSection.css'

import classNames from 'classnames'
import { ContentfulSectionHyperlinkWrapper } from './ContentfulSectionHyperlinkWrapper'
import { Flex } from '../core'

type ContentfulSectionProps<EditorMode = boolean> = StyleProps &
  (EditorMode extends true
    ? {
        onMouseDown: MouseEventHandler<HTMLDivElement>
        children: React.ReactNode
        className?: string
        node: CompositionComponentNode
        editorMode?: true
      }
    : {
        className?: string
        children: React.ReactNode
        editorMode: false
      })

export const ContentfulSection = (props: ContentfulSectionProps) => {
  const { children, className, cfHyperlink, cfOpenInNewTab } = props

  let childrenHyperlinkWrapper = children

  // If hyperlink for ContentfulSection is bounded
  if (cfHyperlink) {
    childrenHyperlinkWrapper = (
      <ContentfulSectionHyperlinkWrapper
        editorMode={props.editorMode === true}
        cfHyperlink={cfHyperlink}
        cfOpenInNewTab={cfOpenInNewTab}>
        {children}
      </ContentfulSectionHyperlinkWrapper>
    )
  }

  if (props.editorMode === false) {
    return (
      <Flex id="ContentfulSection" className={classNames(className, 'defaultStyles')}>
        {childrenHyperlinkWrapper}
      </Flex>
    )
  }

  // Extract properties that are only available in editor mode
  const { node, onMouseDown } = props

  return (
    <Flex
      id="ContentfulSection"
      data-cf-node-id={node.data.id}
      data-cf-node-block-id={node.data.blockId}
      data-cf-node-block-type={node.type}
      className={classNames(className, 'defaultStyles')}
      onMouseDown={onMouseDown}>
      {childrenHyperlinkWrapper}
    </Flex>
  )
}
