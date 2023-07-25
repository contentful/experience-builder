import React, { MouseEventHandler } from 'react'
import { useInteraction, useMousePosition } from '../hooks'
import { ContentfulSectionIndicator } from './ContentfulSectionIndicator'
import { CompositionComponentNode, StyleProps } from '../types'
import { transformAlignment, transformBorderStyle, transformFill } from './transformers'
import { getInsertionData } from '../utils'

import './ContentfulSection.css'
import { CONTENTFUL_SECTION_ID } from '../constants'
import classNames from 'classnames'
import { Flex } from '../core'

type ContentfulSectionProps<EditorMode = boolean> = StyleProps &
  (EditorMode extends true
    ? {
        handleComponentDrop: (data: { index: number; node: CompositionComponentNode }) => void
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
    className,
    children,
  } = props
  const { mouseInUpperHalf, mouseInLeftHalf, mouseAtBottomBorder, mouseAtTopBorder, componentRef } =
    useMousePosition()

  const sectionInteraction = useInteraction()
  const sectionIndicatorTopInteraction = useInteraction()
  const sectionIndicatorBottomInteraction = useInteraction()

  const styleOverrides = {
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
  const { isDragging, parentNode, node, handleComponentDrop, onMouseDown } = props

  const isTopLevel = node?.data.blockId === CONTENTFUL_SECTION_ID

  // if isDragging something and over the section's top border, or over the top indicator (which already appeared by that time)
  const showTopSectionIndicator =
    isTopLevel &&
    isDragging &&
    ((sectionInteraction.isMouseOver && mouseAtTopBorder) ||
      sectionIndicatorTopInteraction.isMouseOver)

  // if isDragging something and over the section's bottom border, or over the bottom indicator (which already appeared by that time)
  const showBottomSectionIndicator =
    isTopLevel &&
    isDragging &&
    ((sectionInteraction.isMouseOver && mouseAtBottomBorder) ||
      sectionIndicatorBottomInteraction.isMouseOver)

  const onMouseUp = () => {
    // Passing this to the function to notify the experience builder about where to drop new components
    handleComponentDrop(
      getInsertionData({
        dropReceiverNode: node,
        dropReceiverParentNode: parentNode,
        flexDirection,
        isMouseAtTopBorder: mouseAtTopBorder,
        isMouseAtBottomBorder: mouseAtBottomBorder,
        isMouseInLeftHalf: mouseInLeftHalf,
        isMouseInUpperHalf: mouseInUpperHalf,
        isOverTopIndicator: sectionIndicatorTopInteraction.isMouseOver,
        isOverBottomIndicator: sectionIndicatorBottomInteraction.isMouseOver,
      })
    )
  }

  return (
    <>
      <ContentfulSectionIndicator
        onMouseEnter={sectionIndicatorTopInteraction.onMouseEnter}
        onMouseLeave={sectionIndicatorTopInteraction.onMouseLeave}
        onMouseUp={onMouseUp}
        isShown={showTopSectionIndicator}
        key="new_section_indicator_top"
      />
      <Flex
        ref={componentRef}
        cssStyles={styleOverrides}
        id="ContentfulSection"
        onMouseEnter={sectionInteraction.onMouseEnter}
        onMouseLeave={sectionInteraction.onMouseLeave}
        data-cf-node-id={node.data.id}
        data-cf-node-block-id={node.data.blockId}
        data-cf-node-block-type={node.type}
        className={classNames('defaultStyles', className, {
          empty: !children || (Array.isArray(children) && children.length === 0),
        })}
        onMouseDown={onMouseDown}>
        {children}
      </Flex>
      <ContentfulSectionIndicator
        onMouseEnter={sectionIndicatorBottomInteraction.onMouseEnter}
        onMouseLeave={sectionIndicatorBottomInteraction.onMouseLeave}
        onMouseUp={onMouseUp}
        isShown={showBottomSectionIndicator}
        key="new_section_indicator_bottom"
      />
    </>
  )
}
