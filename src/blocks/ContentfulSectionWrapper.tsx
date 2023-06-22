import React, { Children } from 'react'
import { Flex } from '../core'
import { useInteraction, useMousePosition } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import { CompositionComponentNode } from '../types'
import './ContentfulSection.css'
import { ContentfulSectionIndicator, ContentfulSectionIndicatorPlaceholder } from './ContentfulSectionIndicator'

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
  className?: string
  isSelected: boolean
  rootNode: CompositionComponentNode
}

type WrapperProps = {
  mouseAtBottomBorder: boolean
  mouseAtTopBorder: boolean
  isMouseOver: boolean
  showPrependLine: () => boolean
  showAppendLine: () => boolean
}

interface ContentfulWrapperProps extends ContentfulSectionProps {
  children: (arg0: WrapperProps) => React.ReactNode
}

export const ContainerWrapper = (props: ContentfulWrapperProps) => {
  const { isMouseOver, onMouseOver, onMouseLeave } = useInteraction()
  const { mouseInUpperHalf, mouseInLeftHalf, mouseAtBottomBorder, mouseAtTopBorder, componentRef } =
    useMousePosition()

  const { flexDirection, isDragging, onMouseUp, rootNode } = props

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
    <div
      ref={componentRef}
      id="ContentfulSection"
      style={{
        display: 'flex',
        width: '100%',
        margin: '10px',
        boxShadow: 'inset 0px 0px 0px 1px gray',
      }}
      onMouseOver={onMouseOver}
      onMouseUp={() => {
        // Passing this to the function to notify the experience builder about where to drop new components
        onMouseUp(
          shouldAppend(),
          // when the mouse is around the border we want to drop the new component as a new section onto the root node
          mouseAtTopBorder || mouseAtBottomBorder ? rootNode : undefined
        )
      }}
      onMouseLeave={onMouseLeave}>
      {props.children({
        isMouseOver,
        mouseAtTopBorder,
        mouseAtBottomBorder,
        showPrependLine,
        showAppendLine,
      })}
    </div>
  )
}

const transformFill = (value: string) => (value === 'fill' ? '100%' : value)
export const Container = ({
  margin,
  padding,
  horizontalAlignment,
  verticalAlignment,
  flexDirection,
  backgroundColor,
  width,
  height,
  border,
  gap,
  flexWrap,
  className,
  isSelected,
  children,
  onComponentRemoved,
  shouldAppendLine,
  shouldPrependLine,
  onMouseOver,
  onMouseLeave,
  onMouseUp,
}: ContentfulSectionProps & {
  onMouseUp: () => void
  onMouseOver: () => void
  onMouseLeave: () => void
  shouldPrependLine: boolean
  shouldAppendLine: boolean
  children: React.ReactNode
}) => {
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
    border,
    gap,
    ...alignment,
  }
  const selectedStyles = isSelected ? 'containerBorder' : ''
  const lineStyles = flexDirection === 'row' ? 'lineVertical' : 'lineHorizontal'

  return (
    <Flex
      cssStyles={{ ...styleOverrides }}
      flexDirection={flexDirection}
      flexWrap={flexWrap}
      className={`defaultStyles ${className} ${selectedStyles}`}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}>
      <>
        {shouldPrependLine && (
          <div key="lineIndicator_top" className={`${lineStyles} visible`}></div>
        )}
        {children}
        {shouldAppendLine && (
          <div key="lineIndicator_bottom" className={`${lineStyles} visible`}></div>
        )}
        {isSelected && <SectionTooltip onComponentRemoved={onComponentRemoved} />}
      </>
    </Flex>
  )
}

export const NewSectionWrapper = ({
  isDragging,
  isMouseOver,
  mouseAtTopBorder,
  mouseAtBottomBorder,
  children,
}: {
  isDragging: boolean
  isMouseOver: any
  mouseAtTopBorder: boolean
  mouseAtBottomBorder: boolean
  children: React.ReactNode
}) => (
  <>
    {isDragging && isMouseOver ? (
      mouseAtTopBorder ? (
        <ContentfulSectionIndicator />
      ) : (
        <ContentfulSectionIndicatorPlaceholder />
      )
    ) : null}
    {children}
    {isDragging && isMouseOver ? (
      mouseAtBottomBorder ? (
        <ContentfulSectionIndicator />
      ) : (
        <ContentfulSectionIndicatorPlaceholder />
      )
    ) : null}
  </>
)
