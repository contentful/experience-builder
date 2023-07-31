import React, { MouseEventHandler } from 'react'

import { CompositionComponentNode, StyleProps } from '../types'
import { transformAlignment, transformBorderStyle, transformFill } from './transformers'

import './ContentfulSection.css'

import classNames from 'classnames'
import { Flex } from '../core'

type ContentfulSectionProps<EditorMode = boolean> = StyleProps &
  (EditorMode extends true
    ? {
        onMouseDown: MouseEventHandler<HTMLDivElement>
        isDragging: boolean
        children: React.ReactNode
        className?: string
        node: CompositionComponentNode
        parentNode: CompositionComponentNode
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

  console.warn(
    `[exp-builder.sdk::ContentfulSection] backgroundImageXXX prop`,
    { 
      backgroundImageUrl,
      backgroundImageAlignment,
      backgroundImageScaling,
    }
  );

  const cssBackgroundLine = `url(${backgroundImageUrl})`;


  // const styleOverrides : Partial<StyleProps> = {
  const styleOverrides  = {
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
  }

  if ( backgroundImageUrl ) {
    // @ts-expect-error
    styleOverrides.backgroundImage = `url(${backgroundImageUrl})`;
    
    // @ts-expect-error
    styleOverrides.backgroundRepeat = backgroundImageScaling === 'tile' ? 'repeat' : 'no-repeat'; 
    // @ts-expect-error
    styleOverrides.backgroundPosition = backgroundImageAlignment || undefined;
    if ( 'fill' === backgroundImageScaling ) {
      // @ts-expect-error
      styleOverrides.backgroundSize = 'cover';
    }
    if ( 'fit' === backgroundImageScaling) {
      // @ts-expect-error
      styleOverrides.backgroundSize = 'contain';
    }
    
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
