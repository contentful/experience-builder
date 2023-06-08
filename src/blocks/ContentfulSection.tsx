import { Flex } from '@contentful/f36-core'
import tokens from '@contentful/f36-tokens'
import { css, cx } from '@emotion/css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useInteraction } from '../hooks'
import { SectionTooltip } from './SectionTooltip'

const styles = {
  defaultStyles: css({
    minHeight: '200px',
    overflow: 'scroll',
    flexWrap: 'wrap',
    justifyContent: 'center',
    position: 'relative',
  }),
  lineHorizontal: css({
    margin: '10px',
    height: '0px',
    borderTop: `3px solid ${tokens.blue500}`,
  }),
  lineVertical: css({
    width: '0px',
    margin: '10px',
    borderLeft: `3px solid ${tokens.blue500}`,
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
  upperHalfBackground: css({
    background: 'linear-gradient(to bottom, red 50%, transparent 50%)',
  }),
  lowerHalfBackground: css({
    background: 'linear-gradient(to bottom, transparent 50%, blue 50%)',
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
  const [mouseInLowerHalf, setMouseInLowerHalf] = useState<boolean>(false)

  console.log({ margin, padding, backgroundColor, width, height, border, gap })

  const styleOverrides = css({ margin, padding, backgroundColor, width, height, border, gap })

  const lineStyles = flexDirection === 'row' ? styles.lineVertical : styles.lineHorizontal

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

    const checkMousePosition = (mouseX: number, mouseY: number) => {
      if (mouseY < componentHeight / 2) {
        setMouseInUpperHalf(true)
        setMouseInLowerHalf(false)
      } else {
        setMouseInUpperHalf(false)
        setMouseInLowerHalf(true)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      if (componentRef.current) {
        checkMousePosition(e.pageX, e.pageY)
      }
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
    <div
      className={cx(
        isSelected ? cx(styles.containerBorder) : '',
        mouseInUpperHalf && isDragging ? styles.upperHalfBackground : '',
        mouseInLowerHalf && isDragging ? styles.lowerHalfBackground : ''
      )}>
      <Flex
        ref={componentRef}
        flexDirection={flexDirection}
        onMouseOver={(e: React.MouseEvent<HTMLDivElement>) => {
          onMouseOver()
        }}
        onMouseUp={() => {
          onMouseUp(mouseInLowerHalf)
        }}
        onMouseLeave={onMouseLeave}
        className={cx(styles.defaultStyles, className, styleOverrides)}
        {...props}>
        {props.children}
        {isDragging && isMouseOver && <div key="lineIndicator" className={lineStyles}></div>}
        {isSelected && <SectionTooltip onComponentRemoved={onComponentRemoved} />}
      </Flex>
    </div>
  )
}
