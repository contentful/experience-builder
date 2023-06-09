import { Flex } from '@contentful/f36-core'
import tokens from '@contentful/f36-tokens'
import { css, cx } from '@emotion/css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useInteraction } from '../hooks'
import { SectionTooltip } from './SectionTooltip'
import { ContentfulSectionIndicator } from './ContentfulSectionIndicator'

const styles = {
  defaultStyles: css({
    minHeight: '200px',
    overflow: 'scroll',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
  }),
  lineHorizontal: css({
    width: '3px',
    background: tokens.blue500,
    margin: '10px',
  }),
  lineVertical: css({
    height: '3px',
    background: tokens.blue500,
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
    border: `1px solid ${tokens.blue500}`,
    boxSizing: 'border-box',
  }),
}

interface StyleProps {
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
  onMouseUp: (append: boolean) => void
  isDragging: boolean
  children: React.ReactNode
  className?: string
  isSelected: boolean
}

export const ContentfulSection = ({
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
  onComponentRemoved,
  onMouseUp,
  ...props
}: ContentfulSectionProps) => {
  const { isMouseOver, onMouseOver, onMouseLeave } = useInteraction()

  const componentRef = useRef<HTMLDivElement>(null)
  const [componentHeight, setComponentHeight] = useState<number>(0)
  const [componentWidth, setComponentWidth] = useState<number>(0)
  const [mouseInUpperHalf, setMouseInUpperHalf] = useState<boolean>(false)
  const [mouseAtTopBorder, setMouseAtTopBorder] = useState<boolean>(false)
  const [mouseAtBottomBorder, setMouseAtBottomBorder] = useState<boolean>(false)

  const styleOverrides = css({ margin, padding, backgroundColor, width, height, border, gap })

  const lineStyles = flexDirection === 'row' ? styles.lineHorizontal : styles.lineVertical

  const sectionOutline = isDragging ? <ContentfulSectionIndicator /> : null

  useEffect(() => {
    // This code ensures that we can keep track of the real size of the section in the DOM
    const observer = new ResizeObserver((entries) => {
      const newHeight = entries[0].target.clientHeight
      const newWidth = entries[0].target.clientWidth
      if (newHeight !== componentHeight) {
        setComponentHeight(newHeight)
      }
      if (newWidth !== componentWidth) {
        setComponentWidth(newWidth)
      }
    })

    const checkMousePosition = (mouseY: number) => {
      if (componentRef.current) {
        const { top, height } = componentRef.current.getBoundingClientRect()
        const offset = mouseY - top
        const isMouseInUpperHalf = offset < height / 2
        setMouseInUpperHalf(isMouseInUpperHalf)

        const isMouseAtTopBorder = offset < 20
        setMouseAtTopBorder(isMouseAtTopBorder)

        const isMouseAtBottomBorder = offset > height - 20
        setMouseAtBottomBorder(isMouseAtBottomBorder)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      checkMousePosition(e.clientY)
    }

    if (componentRef.current) {
      componentRef.current.addEventListener('mousemove', onMouseMove)
      observer.observe(componentRef.current)
    }

    return () => {
      if (componentRef.current) {
        componentRef.current.removeEventListener('mousemove', onMouseMove)
      }
      observer.disconnect()
    }
  }, [componentHeight])

  return (
    <div>
      {isDragging && mouseAtTopBorder && isMouseOver && sectionOutline}
      <div className={cx(isSelected ? cx(styles.containerBorder) : '')}>
        <Flex
          ref={componentRef}
          flexDirection={flexDirection}
          onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
            onMouseOver()
          }}
          onMouseUp={() => {
            // Passing this to the function to notify the experience builder about where to drop new components
            onMouseUp(!mouseInUpperHalf)
          }}
          onMouseLeave={onMouseLeave}
          className={cx(styles.defaultStyles, styleOverrides, className)}
          {...props}>
          {mouseInUpperHalf &&
            !mouseAtBottomBorder &&
            !mouseAtTopBorder &&
            isDragging &&
            isMouseOver && <div key="lineIndicator" className={lineStyles}></div>}
          {props.children}
          {!mouseInUpperHalf &&
            !mouseAtBottomBorder &&
            !mouseAtTopBorder &&
            isDragging &&
            isMouseOver && <div key="lineIndicator" className={lineStyles}></div>}
          {isSelected && <SectionTooltip onComponentRemoved={onComponentRemoved} />}
        </Flex>
      </div>
      {isDragging && mouseAtBottomBorder && isMouseOver && sectionOutline}
    </div>
  )
}
