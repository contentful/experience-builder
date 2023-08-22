import React, { CSSProperties, MouseEventHandler } from 'react'

import { CompositionComponentNode, StyleProps } from '../types'
import {
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformFill,
} from './transformers'

import './ContentfulSection.css'

import classNames from 'classnames'
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
  const {
    cfHorizontalAlignment,
    cfVerticalAlignment,
    cfFlexDirection,
    cfFlexWrap,
    cfMargin,
    cfPadding,
    cfBackgroundColor,
    cfWidth,
    cfHeight,
    cfMaxWidth,
    cfBorder,
    cfGap,
    cfBackgroundImageUrl,
    cfBackgroundImageAlignment,
    cfBackgroundImageScaling,
    className,
    children,
  } = props

  const styleOverrides: CSSProperties = {
    margin: cfMargin,
    padding: cfPadding,
    backgroundColor: cfBackgroundColor,
    width: transformFill(cfWidth),
    height: transformFill(cfHeight),
    maxWidth: cfMaxWidth,
    ...transformBorderStyle(cfBorder),
    gap: cfGap,
    ...transformAlignment(cfHorizontalAlignment, cfVerticalAlignment, cfFlexDirection),
    flexDirection: cfFlexDirection,
    flexWrap: cfFlexWrap,
    ...transformBackgroundImage(
      cfBackgroundImageUrl,
      cfBackgroundImageScaling,
      cfBackgroundImageAlignment
    ),
  }

  if (props.editorMode === false) {
    return (
      <Flex
        cssStyles={styleOverrides as Record<string, string>}
        id="ContentfulSection"
        className={classNames('defaultStyles', className)}>
        {children}
      </Flex>
    )
  }

  // Extract properties that are only available in editor mode
  const { node, onMouseDown } = props

  return (
    <Flex
      cssStyles={styleOverrides as Record<string, string>}
      id="ContentfulSection"
      data-cf-node-id={node.data.id}
      data-cf-node-block-id={node.data.blockId}
      data-cf-node-block-type={node.type}
      className={classNames('defaultStyles', className, {
        empty: !children || (Array.isArray(children) && children.length === 0),
      })}
      onMouseDown={onMouseDown}>
      {children}
    </Flex>
  )
}
