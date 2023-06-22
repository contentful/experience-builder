import React, { MouseEventHandler } from 'react'
import { Flex } from '../core'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import {
  ContentfulSectionIndicator,
} from './ContentfulSectionIndicator'
import { CompositionComponentNode, StyleProps } from '../types'
import { transformBorderStyle, transformFill } from './transformers'

import './ContentfulSection.css'

interface ContentfulSectionProps extends StyleProps {
  onComponentRemoved: () => void
  handleComponentDrop: (data: { index: number; node: CompositionComponentNode }) => void
  onMouseDown: MouseEventHandler<HTMLDivElement>
  isDragging: boolean
  children: React.ReactNode
  className?: string
  isSelected: boolean
  node: CompositionComponentNode
  parentNode: CompositionComponentNode
}

export const ContentfulSection = ({
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
  isDragging,
  className,
  isSelected,
  parentNode,
  node,
  children,
  onComponentRemoved,
  handleComponentDrop,
  onMouseDown
}: ContentfulSectionProps) => {
  const { mouseInUpperHalf, mouseInLeftHalf, mouseAtBottomBorder, mouseAtTopBorder, componentRef } =
    useMousePosition()

  const sectionInteraction = useInteraction()
  const sectionIndicatorTopInteraction = useInteraction()
  const sectionIndicatorBottomInteraction = useInteraction()

  // when direction is 'column' the axis are reversed
  const alignment =
    flexDirection === 'row'
      ? {
          alignItems: `${horizontalAlignment}`,
          justifyContent: `${verticalAlignment}`,
        }
      : {
          alignItems: `${verticalAlignment}`,
          justifyContent: `${horizontalAlignment}`,
        }

  const styleOverrides = {
    margin,
    padding,
    backgroundColor,
    width: transformFill(width),
    height: transformFill(height),
    maxWidth,
    ...transformBorderStyle(border),
    gap,
  }

  const lineStyles = flexDirection === 'row' ? 'lineVertical' : 'lineHorizontal'

  const showPrependLine =
    flexDirection === 'row'
      ? mouseInLeftHalf &&
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
      ? !mouseInLeftHalf &&
        !mouseAtBottomBorder &&
        !mouseAtTopBorder &&
        isDragging &&
        sectionInteraction.isMouseOver
      : !mouseInUpperHalf &&
        !mouseAtBottomBorder &&
        !mouseAtTopBorder &&
        isDragging &&
        sectionInteraction.isMouseOver

  // This function determines if a dragged component should be appended or prepended when dropping it on the section
  const getInsertionData = (): { node: CompositionComponentNode; index: number } => {
    const APPEND_INSIDE = parentNode.children.length
    const PREPEND_INSIDE = 0

    if (mouseAtTopBorder || mouseAtBottomBorder) {
      const indexOfSectionInParentChildren = parentNode.children.findIndex(
        (n) => n.data.id === node.data.id
      )
      const APPEND_OUTSIDE = indexOfSectionInParentChildren + 1
      const PREPEND_OUTSIDE = indexOfSectionInParentChildren

      return {
        // when the mouse is around the border we want to drop the new component as a new section onto the root node
        node: parentNode,
        index: mouseAtBottomBorder ? APPEND_OUTSIDE : PREPEND_OUTSIDE,
      }
    }

    // if over one of the section indicators
    if (
      sectionIndicatorTopInteraction.isMouseOver ||
      sectionIndicatorBottomInteraction.isMouseOver
    ) {
      const indexOfSectionInParentChildren = parentNode.children.findIndex(
        (n) => n.data.id === node.data.id
      )
      const APPEND_OUTSIDE = indexOfSectionInParentChildren + 1
      const PREPEND_OUTSIDE = indexOfSectionInParentChildren

      return {
        // when the mouse is around the border we want to drop the new component as a new section onto the root node
        node: parentNode,
        index: sectionIndicatorBottomInteraction.isMouseOver ? APPEND_OUTSIDE : PREPEND_OUTSIDE,
      }
    }

    if (flexDirection === undefined || flexDirection === 'row') {
      return {
        node,
        index: mouseInLeftHalf ? PREPEND_INSIDE : APPEND_INSIDE,
      }
    } else {
      return {
        node,
        index: mouseInUpperHalf ? PREPEND_INSIDE : APPEND_INSIDE,
      }
    }
  }

  // if isDragging something and over the section's top border, or over the top indicator (which already appeared by that time)
  const showTopSectionIndicator =
    isDragging &&
    ((sectionInteraction.isMouseOver && mouseAtTopBorder) ||
      sectionIndicatorTopInteraction.isMouseOver)

  // if isDragging something and over the section's bottom border, or over the bottom indicator (which already appeared by that time)
  const showBottomSectionIndicator =
    isDragging &&
    ((sectionInteraction.isMouseOver && mouseAtBottomBorder) ||
      sectionIndicatorBottomInteraction.isMouseOver)

  return (
    <>
      <ContentfulSectionIndicator
        onMouseEnter={sectionIndicatorTopInteraction.onMouseEnter}
        onMouseLeave={sectionIndicatorTopInteraction.onMouseLeave}
        onMouseUp={() => {
          // Passing this to the function to notify the experience builder about where to drop new components
          handleComponentDrop(getInsertionData())
        }}
        isShown={showTopSectionIndicator}
        key="new_section_indicator_top"
      />
      <div ref={componentRef} id="ContentfulSection">
        <div className={isSelected ? 'containerBorder' : ''}>
          <Flex
            cssStyles={{
              ...styleOverrides,
              ...alignment,
            }}
            flexDirection={flexDirection}
            flexWrap={flexWrap}
            onMouseEnter={sectionInteraction.onMouseEnter}
            onMouseUp={() => {
              // Passing this to the function to notify the experience builder about where to drop new components
              handleComponentDrop(getInsertionData())
            }}
            onMouseLeave={sectionInteraction.onMouseLeave}
            className={`defaultStyles ${className}`}
            onMouseDown={onMouseDown}
          >
            {showPrependLine && <div key="lineIndicator_top" className={lineStyles}></div>}
            {children}
            {showAppendLine && <div key="lineIndicator_bottom" className={lineStyles}></div>}
            {isSelected && <SectionTooltip onComponentRemoved={onComponentRemoved} />}
          </Flex>
        </div>
      </div>
      <ContentfulSectionIndicator
        onMouseEnter={sectionIndicatorBottomInteraction.onMouseEnter}
        onMouseLeave={sectionIndicatorBottomInteraction.onMouseLeave}
        onMouseUp={() => {
          // Passing this to the function to notify the experience builder about where to drop new components
          handleComponentDrop(getInsertionData())
        }}
        isShown={showBottomSectionIndicator}
        key="new_section_indicator_bottom"
      />
    </>
  )
}
