import React, { MouseEventHandler, useMemo, useState } from 'react'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import { ContentfulSectionIndicator } from './ContentfulSectionIndicator'
import { CompositionComponentNode, DroppedNodeParent, StyleProps } from '../types'
import { transformAlignment, transformBorderStyle, transformFill } from './transformers'
import { getInsertionData } from '../utils'

import './ContentfulSection.css'
import { CONTENTFUL_SECTION_ID } from '../constants'
import classNames from 'classnames'
import { Flex } from '../core'
import { useHoverIndicator } from '../hooks/useHoverIndicator'

const EDGE_SIZE = 10

type ContentfulEditorSectionProps = {
  onComponentRemoved: () => void
  handleComponentDrop: (data: { index: number; parent: DroppedNodeParent }) => void
  onMouseDown: MouseEventHandler<HTMLDivElement>
  isDragging: boolean
  children: React.ReactNode
  className?: string
  isSelected: boolean
  node: CompositionComponentNode
  parentNode: CompositionComponentNode
  editorMode?: true
}

type ContentfulSectionProps<EditorMode = boolean> = StyleProps &
  (EditorMode extends true
    ? ContentfulEditorSectionProps
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

  return <ContentfulEditorSection {...props} />
}

export const ContentfulEditorSection = (props: ContentfulEditorSectionProps & StyleProps) => {
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
    isDragging,
    isSelected,
    parentNode,
    node,
    onComponentRemoved,
    handleComponentDrop,
    onMouseDown,
  } = props

  const isTopLevel = useMemo(() => node?.data.blockId === CONTENTFUL_SECTION_ID, [node])

  const lineStyles = flexDirection === 'row' ? 'lineVertical' : 'lineHorizontal'

  const {
    onMouseMove,
    removeHoverIndicator,
    hoveredParentId,
    hoveredParentBlockId,
    hoveredInsertIndex,
  } = useHoverIndicator({
    direction: flexDirection === 'row' ? 'vertical' : 'horizontal',
    componentId: node.data.id,
    isDragging,
    isTopLevel,
  })

  const {
    mouseInUpperHalf,
    mouseInLeftHalf,
    mouseAtBottomBorder,
    mouseAtTopBorder,
    componentRef,
    targetIsComponent,
  } = useMousePosition(onMouseMove)

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

  const showPrependLine =
    flexDirection === 'row'
      ? targetIsComponent &&
        mouseInLeftHalf &&
        !mouseAtBottomBorder &&
        !mouseAtTopBorder &&
        isDragging &&
        sectionInteraction.isMouseOver
      : mouseInUpperHalf &&
        !mouseAtBottomBorder &&
        !mouseAtTopBorder &&
        isDragging &&
        sectionInteraction.isMouseOver

  const showAppendLine =
    flexDirection === 'row'
      ? targetIsComponent &&
        !mouseInLeftHalf &&
        !mouseAtBottomBorder &&
        !mouseAtTopBorder &&
        isDragging &&
        sectionInteraction.isMouseOver
      : !mouseInUpperHalf &&
        !mouseAtBottomBorder &&
        !mouseAtTopBorder &&
        isDragging &&
        sectionInteraction.isMouseOver

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
    if (hoveredInsertIndex !== -1 && hoveredParentId) {
      handleComponentDrop({
        parent: {
          nodeId: hoveredParentId,
          blockId: hoveredParentBlockId!,
          blockType: 'block',
        },
        index: hoveredInsertIndex,
      })
      removeHoverIndicator()
    } else {
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
        data-cf-node-id={node.data.id}
        data-cf-node-block-id={node.data.blockId}
        onMouseEnter={sectionInteraction.onMouseEnter}
        onMouseUp={onMouseUp}
        onMouseLeave={(e) => {
          if (isTopLevel) {
            removeHoverIndicator()
          }
          sectionInteraction.onMouseLeave()
        }}
        className={classNames('defaultStyles', className, { containerBorder: isSelected })}
        onMouseDown={onMouseDown}>
        {showPrependLine && <div key="lineIndicator_top" className={lineStyles}></div>}
        {children}
        {showAppendLine && <div key="lineIndicator_bottom" className={lineStyles}></div>}
        {isSelected && <SectionTooltip onComponentRemoved={onComponentRemoved} />}
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
