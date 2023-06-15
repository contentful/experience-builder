import React from 'react'
import { Flex, color } from '../core'
import { css, cx } from '@emotion/css'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import {
  ContentfulSectionIndicator,
  ContentfulSectionIndicatorPlaceholder,
} from './ContentfulSectionIndicator'
import { CompositionComponentNode } from '../types'

const styles = {
  defaultStyles: css({
    minHeight: '200px',
    overflow: 'scroll',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
    display: 'flex',
  }),
  lineHorizontal: css({
    height: '3px',
    width: '200px',
    background: color.blue500,
    margin: '10px',
  }),
  lineVertical: css({
    height: '190px',
    width: '3px',
    background: color.blue500,
    margin: '10px',
  }),
  tooltip: css({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'absolute',
    top: '1px',
    right: '1px',
  }),
  containerBorder: css({
    border: `1px solid ${color.blue500}`,
    boxSizing: 'border-box',
  }),
}

interface StyleProps {
  horizontalAlignment: 'start' | 'end' | 'center'
  verticalAlignment: 'start' | 'end' | 'center'
  margin: string
  padding: string
  backgroundColor: string
  width: string
  height: string
  flexDirection: 'row' | 'column'
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

export const ContentfulSection = ({
  horizontalAlignment,
  verticalAlignment,
  flexDirection,
  margin,
  padding,
  backgroundColor,
  width,
  height,
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
      ? css({
          alignItems: `${horizontalAlignment}`,
          justifyContent: `${verticalAlignment}`,
        })
      : css({
          alignItems: `${verticalAlignment}`,
          justifyContent: `${horizontalAlignment}`,
        })

  const styleOverrides = css({ margin, padding, backgroundColor, width, height, border, gap })

  const lineStyles = flexDirection === 'row' ? styles.lineVertical : styles.lineHorizontal

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
    <div ref={componentRef}>
      {isDragging && isMouseOver ? (
        mouseAtTopBorder ? (
          <ContentfulSectionIndicator />
        ) : (
          <ContentfulSectionIndicatorPlaceholder />
        )
      ) : null}
      <div className={cx(isSelected ? cx(styles.containerBorder) : '')}>
        <Flex
          flexDirection={flexDirection}
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
          className={cx(styles.defaultStyles, styleOverrides, className, alignment)}
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
