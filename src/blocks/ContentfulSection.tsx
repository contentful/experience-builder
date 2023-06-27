import React, { MouseEventHandler } from 'react'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import { ContentfulSectionIndicator } from './ContentfulSectionIndicator'
import { CompositionComponentNode, StyleProps } from '../types'
import { transformBorderStyle, transformFill } from './transformers'
import { getInsertionData } from '../utils'

import './ContentfulSection.css'
import { CONTENTFUL_SECTION_ID } from '../constants'
import classNames from 'classnames'
import { Flex } from '../core'

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
  onMouseDown,
}: ContentfulSectionProps) => {
  const { mouseInUpperHalf, mouseInLeftHalf, mouseAtBottomBorder, mouseAtTopBorder, componentRef } =
    useMousePosition()

  const isTopLevel = node.data.blockId === CONTENTFUL_SECTION_ID

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
    ...alignment,
    flexDirection,
    flexWrap,
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
        onMouseUp={onMouseUp}
        onMouseLeave={sectionInteraction.onMouseLeave}
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
