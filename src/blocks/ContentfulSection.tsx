import React, { MouseEventHandler } from 'react'
import { Flex } from '../core'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import {
  ContentfulSectionIndicator,
  ContentfulSectionIndicatorPlaceholder,
} from './ContentfulSectionIndicator'
import { CompositionComponentNode, StyleProps } from '../types'
import { transformBorderStyle, transformFill } from './transformers'

import './ContentfulSection.css'

interface ContentfulSectionProps extends StyleProps {
  onClick: MouseEventHandler<HTMLDivElement>
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
  onMouseDown,
  onClick,
}: ContentfulSectionProps) => {
  const { isMouseOver, onMouseOver, onMouseLeave } = useInteraction()
  const { mouseInUpperHalf, mouseInLeftHalf, mouseAtBottomBorder, mouseAtTopBorder, componentRef } =
    useMousePosition()

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

  const showPrependLine = () => {
    if (flexDirection === 'row') {
      return (
        mouseInLeftHalf && !mouseAtBottomBorder && !mouseAtTopBorder && isDragging && isMouseOver
      )
    } else {
      return (
        mouseInUpperHalf && !mouseAtBottomBorder && !mouseAtTopBorder && isDragging && isMouseOver
      )
    }
  }
  const showAppendLine = () => {
    if (flexDirection === 'row') {
      return (
        !mouseInLeftHalf && !mouseAtBottomBorder && !mouseAtTopBorder && isDragging && isMouseOver
      )
    } else {
      return (
        !mouseInUpperHalf && !mouseAtBottomBorder && !mouseAtTopBorder && isDragging && isMouseOver
      )
    }
  }

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

  return (
    <div ref={componentRef} id="ContentfulSection">
      {isDragging && isMouseOver ? (
        mouseAtTopBorder ? (
          <ContentfulSectionIndicator key={'new_section_indicator_top'} />
        ) : (
          <ContentfulSectionIndicatorPlaceholder key={'placeholder_section_indicator_bottom'} />
        )
      ) : null}
      <div className={isSelected ? 'containerBorder' : ''}>
        <Flex
          cssStyles={{
            ...styleOverrides,
            ...alignment,
          }}
          flexDirection={flexDirection}
          flexWrap={flexWrap}
          onMouseOver={onMouseOver}
          onMouseUp={() => {
            // Passing this to the function to notify the experience builder about where to drop new components
            handleComponentDrop(getInsertionData())
          }}
          onMouseLeave={onMouseLeave}
          className={`defaultStyles ${className}`}
        >
          {showPrependLine() && <div key="lineIndicator_top" className={lineStyles}></div>}
          {children}
          {showAppendLine() && <div key="lineIndicator_bottom" className={lineStyles}></div>}
          {isSelected && <SectionTooltip onComponentRemoved={onComponentRemoved} />}
        </Flex>
      </div>
      {isDragging && isMouseOver ? (
        mouseAtBottomBorder ? (
          <ContentfulSectionIndicator key={'new_section_indicator_bottom'} />
        ) : (
          <ContentfulSectionIndicatorPlaceholder key={'placeholder_section_indicator_bottom'} />
        )
      ) : null}
    </div>
  )
}
