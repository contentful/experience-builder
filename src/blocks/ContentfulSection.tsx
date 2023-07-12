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

  const { mouseAtBottomBorder, mouseAtTopBorder, componentRef } = useMousePosition(onMouseMove)

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
    if (mouseAtTopBorder || mouseAtBottomBorder) {
      const insertData = getInsertionData({
        dropReceiverNode: node,
        dropReceiverParentNode: parentNode,
        flexDirection,
        isMouseAtTopBorder: mouseAtTopBorder,
        isMouseAtBottomBorder: mouseAtBottomBorder,
        isOverTopIndicator: sectionIndicatorTopInteraction.isMouseOver,
        isOverBottomIndicator: sectionIndicatorBottomInteraction.isMouseOver,
      })
      if (insertData) {
        handleComponentDrop(insertData)
      }
    } else {
      const hoverIndicatorElement = document.getElementById('hover-indicator')
      if (hoverIndicatorElement) {
        const hoveredParent = hoverIndicatorElement.parentElement
        if (hoveredParent) {
          const childArr = Array.from(hoveredParent.children)
          const insertIndex = childArr.findIndex((child) => child === hoverIndicatorElement)
          const parentNodeId = hoveredParent.dataset.cfNodeId
          const parentBlockId = hoveredParent.dataset.cfNodeBlockId
          if (!parentNodeId || !parentBlockId || insertIndex === -1) {
            return
          }
          handleComponentDrop({
            parent: {
              nodeId: parentNodeId,
              blockId: parentBlockId!,
              blockType: 'block',
            },
            index: insertIndex,
          })
          return
        }
      }
    }

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
        {children}
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
