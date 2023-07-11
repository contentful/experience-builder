import React, { MouseEventHandler, useState } from 'react'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import { ContentfulSectionIndicator } from './ContentfulSectionIndicator'
import { CompositionComponentNode, StyleProps } from '../types'
import { transformAlignment, transformBorderStyle, transformFill } from './transformers'
import { getInsertionData } from '../utils'

import './ContentfulSection.css'
import { CONTENTFUL_SECTION_ID } from '../constants'
import classNames from 'classnames'
import { Flex } from '../core'

const EDGE_SIZE = 10

type ContentfulSectionProps<EditorMode = boolean> = StyleProps &
  (EditorMode extends true
    ? {
        onComponentRemoved: () => void
        handleComponentDrop: (data: { index: number; node: CompositionComponentNode }) => void
        onMouseDown: MouseEventHandler<HTMLDivElement>
        isDragging: boolean
        children: React.ReactNode
        className?: string
        isSelected: boolean
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
  const [currentHoveredElement, setCurrentHoveredElement] = useState<HTMLElement | null>(null)
  const lineStyles = flexDirection === 'row' ? 'lineVertical' : 'lineHorizontal'
  const removeSiblings = () => {
    // Remove the previously added sibling div (if any)
    const previousSiblingDiv = document.getElementById('hover-indicator')
    if (previousSiblingDiv) {
      previousSiblingDiv.remove()
    }
  }

  const [hoveredParentId, setHoveredParentId] = useState<undefined | string>(undefined)
  const [hoveredParentBlockId, setHoveredParentBlockId] = useState<undefined | string>(undefined)
  const [hoveredInsertIndex, setHoveredInsertIndex] = useState<number>(-1)

  const onMouseMove = (e: MouseEvent) => {
    if (!isTopLevel || !componentRef.current) return

    const hoveredElement = e.target as HTMLElement

    // if it is the root section don't add a sibling as this is already handled
    if (hoveredElement === componentRef.current || !isDragging) {
      setCurrentHoveredElement(null)
      removeSiblings()
      return
    }

    const hoverIndicator = document.getElementById('hover-indicator')
    const parentId = hoveredElement.parentElement?.dataset.cfNodeId
    const isEditorTool = hoveredElement.dataset.cfEditorTool

    if (!parentId || isEditorTool) {
      // if the parent is not a section we don't want to allow to drop for now
      return
    }

    if (currentHoveredElement === hoveredElement || hoveredElement === hoverIndicator) {
      // Already hovering over the element or its sibling, no action needed
      return
    }

    removeSiblings()

    const { left, width, top, height } = hoveredElement.getBoundingClientRect()
    const offsetX = e.clientX - left
    const offsetY = e.clientY - top
    const isHoveredOnLeft = offsetX < EDGE_SIZE
    const isHoveredOnRight = offsetX > width - EDGE_SIZE
    const isHoveredOnTheTop = offsetY < EDGE_SIZE
    const isHoveredOnTheBottom = offsetY > height - EDGE_SIZE
    if (!isHoveredOnLeft && !isHoveredOnRight && !isHoveredOnTheTop && !isHoveredOnTheBottom) {
      setCurrentHoveredElement(null)
      removeSiblings()
      return
    }

    // Add a new sibling div to the hovered element
    const siblingDiv = document.createElement('div')
    siblingDiv.id = 'hover-indicator'
    siblingDiv.classList.add('hovered-sibling')

    siblingDiv.classList.add(lineStyles)

    let childIndex = -1

    if (hoveredElement.parentElement?.children && hoveredElement !== hoverIndicator) {
      const childArr = Array.from(hoveredElement.parentElement.children)
      childIndex = childArr.findIndex((child) => child === hoveredElement)
      if (hoveredElement !== hoverIndicator && parentId && childIndex !== -1) {
        console.log(hoveredElement.parentElement, 'parent')
        const parentBlockId = hoveredElement.parentElement?.dataset.cfNodeBlockId
        console.log({ parentBlockId })
        setHoveredParentId(parentId)
        setHoveredParentBlockId(parentBlockId)
        setHoveredInsertIndex(
          flexDirection === 'column'
            ? isHoveredOnTheTop
              ? childIndex
              : childIndex + 1
            : isHoveredOnLeft
            ? childIndex
            : childIndex + 1
        )
      }
    }

    if (flexDirection === 'column') {
      hoveredElement.insertAdjacentElement(
        isHoveredOnTheTop ? 'beforebegin' : 'afterend',
        siblingDiv
      )
    } else {
      hoveredElement.insertAdjacentElement(isHoveredOnLeft ? 'beforebegin' : 'afterend', siblingDiv)
    }

    // Update the currently hovered element state
    setCurrentHoveredElement(hoveredElement)
  }

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
  const {
    isDragging,
    isSelected,
    parentNode,
    node,
    onComponentRemoved,
    handleComponentDrop,
    onMouseDown,
  } = props

  const isTopLevel = node?.data.blockId === CONTENTFUL_SECTION_ID

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
    console.log({ hoveredInsertIndex, hoveredParentId })
    if (hoveredInsertIndex !== -1 && hoveredParentId) {
      console.log({
        node: { type: 'block', data: { id: hoveredParentId, blockId: hoveredParentBlockId } },
        index: hoveredInsertIndex,
      })
      handleComponentDrop({
        node: { type: 'block', data: { id: hoveredParentId, blockId: hoveredParentBlockId } },
        index: hoveredInsertIndex,
      })
    } else {
      // Passing this to the function to notify the experience builder about where to drop new components
      handleComponentDrop(
        getInsertionData({
          dropReceiverNode: node,
          dropReceiverParentNode: parentNode,
          hoveredInsertIndex,
          hoveredParentId,
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
            removeSiblings()
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
