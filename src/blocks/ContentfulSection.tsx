import React from 'react'
import { Flex } from '../core'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import {
  ContentfulSectionIndicator,
  ContentfulSectionIndicatorPlaceholder,
} from './ContentfulSectionIndicator'
import { CompositionComponentNode } from '../types'

import './ContentfulSection.css'

interface StyleProps {
  horizontalAlignment: 'start' | 'end' | 'center'
  verticalAlignment: 'start' | 'end' | 'center'
  distribution: 'stacked' | 'absolute'
  margin: string
  padding: string
  backgroundColor: string
  width: string
  maxWidth: string
  height: string
  flexDirection: 'row' | 'column'
  flexWrap: 'nowrap' | 'wrap'
  border: string
  gap: string
}

interface ContentfulSectionProps extends StyleProps {
  onClick: () => void
  onComponentRemoved: () => void
  onMouseUp: (append: boolean, nodeOverride?: CompositionComponentNode) => void
  isDragging: boolean
  children: React.ReactNode
  className?: string
  isSelected: boolean
  rootNode: CompositionComponentNode
}

const transformFill = (value: string) => (value === 'fill' ? '100%' : value)
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
  rootNode,
  onComponentRemoved,
  onMouseUp,
  ...props
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
    border,
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
  const shouldAppend = () => {
    if (mouseAtTopBorder || mouseAtBottomBorder) {
      return mouseAtBottomBorder
    }

    if (flexDirection === 'row') {
      return !mouseInLeftHalf
    } else {
      return !mouseInUpperHalf
    }
  }

  return (
    <div ref={componentRef} id="ContentfulSection">
      {isDragging && isMouseOver ? (
        mouseAtTopBorder ? (
          <ContentfulSectionIndicator />
        ) : (
          <ContentfulSectionIndicatorPlaceholder />
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
            onMouseUp(
              shouldAppend(),
              // when the mouse is around the border we want to drop the new component as a new section onto the root node
              mouseAtTopBorder || mouseAtBottomBorder ? rootNode : undefined
            )
          }}
          onMouseLeave={onMouseLeave}
          className={`defaultStyles ${className}`}
          {...props}>
          {showPrependLine() && <div key="lineIndicator_top" className={lineStyles}></div>}
          {props.children}
          {showAppendLine() && <div key="lineIndicator_bottom" className={lineStyles}></div>}
          {isSelected && <SectionTooltip onComponentRemoved={onComponentRemoved} />}
        </Flex>
      </div>
      {isDragging && isMouseOver ? (
        mouseAtBottomBorder ? (
          <ContentfulSectionIndicator />
        ) : (
          <ContentfulSectionIndicatorPlaceholder />
        )
      ) : null}
    </div>
  )
}
