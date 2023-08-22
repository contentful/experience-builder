import React, { MouseEventHandler } from 'react'

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
    horizontalAlignment,
    verticalAlignment,
    flexDirection,
    flexWrap,
    margin,
    padding,
    backgroundColor,
    width,
    height,
    maxWidth,
    border,
    gap,
    backgroundImageUrl,
    backgroundImageAlignment,
    backgroundImageScaling,
    className,
    children,
  } = props

  const styleOverrides: Partial<StyleProps> = {
    margin,
    padding,
    backgroundColor,
    width: transformFill(width),
    height: transformFill(height),
    maxWidth,
    ...transformBorderStyle(border),
    gap,
    ...transformAlignment(horizontalAlignment, verticalAlignment, flexDirection),
    flexDirection,
    flexWrap,
    ...transformBackgroundImage(
      backgroundImageUrl,
      backgroundImageScaling,
      backgroundImageAlignment
    ),
  }

  if (props.editorMode === false) {
    return (
      <Flex
        cssStyles={styleOverrides}
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
      cssStyles={styleOverrides}
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
