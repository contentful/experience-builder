import React, { MouseEventHandler, useEffect, useMemo, useState } from 'react'
import { useInteraction, useMousePosition } from '../hooks'
import { ContentfulSectionIndicator } from './ContentfulSectionIndicator'
import { Breakpoint, CompositionComponentNode, StyleProps } from '../types'
import { transformAlignment, transformBorderStyle, transformFill } from './transformers'
import { getInsertionData } from '../utils'

import './ContentfulSection.css'
import { CONTENTFUL_SECTION_ID } from '../constants'
import classNames from 'classnames'
import { Flex } from '../core'

type ContentfulSectionProps<EditorMode = boolean> = StyleProps &
  (EditorMode extends true
    ? {
        handleComponentDrop: (data: { index: number; node: CompositionComponentNode }) => void
        onMouseDown: MouseEventHandler<HTMLDivElement>
        isDragging: boolean
        children: React.ReactNode
        className?: string
        node: CompositionComponentNode
        parentNode: CompositionComponentNode
        editorMode?: true
        breakpoints: Breakpoint[]
      }
    : {
        className?: string
        children: React.ReactNode
        editorMode: false
        breakpoints: Breakpoint[]
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
    breakpoints,
  } = props
  const {
    mouseInUpperHalf,
    mouseInLeftHalf,
    mouseAtBottomBorder,
    mouseAtTopBorder,
    componentRef,
    targetIsComponent,
  } = useMousePosition()

  const sectionInteraction = useInteraction()
  const sectionIndicatorTopInteraction = useInteraction()
  const sectionIndicatorBottomInteraction = useInteraction()

  // TODO: move this to a separate hook
  // We assume that the first breakpoint is the default one with query being "*"
  const [mediaQueryMatches, setMediaQueryMatches] = useState<Record<string, boolean>>({})
  const fallbackBreakpointIndex =
    breakpoints.findIndex((breakpoint) => breakpoint.query === '*') ?? 0
  const mediaQuerySignals = useMemo(() => {
    const mediaQueries = breakpoints
      .map((breakpoint) => {
        if (breakpoint.query === '*') return undefined
        const maxScreenWidth = breakpoint.query.match(/<(\w+)/)?.[1]
        if (!maxScreenWidth) return undefined
        return [breakpoint.id, `(max-width: ${maxScreenWidth})`]
      })
      .filter((query): query is [string, string] => !!query)
    return mediaQueries.map(
      ([breakpointId, query]) => [breakpointId, window.matchMedia(query)] as const
    )
  }, [breakpoints])
  useEffect(() => {
    console.log(mediaQuerySignals)
    const listeners = mediaQuerySignals.map(([breakpointId, signal]) => {
      const onChange = () => {
        setMediaQueryMatches((prev) => ({
          ...prev,
          [breakpointId]: signal.matches,
        }))
      }
      // initialise with match value
      setMediaQueryMatches((prev) => ({
        ...prev,
        [breakpointId]: signal.matches,
      }))
      signal.addEventListener('change', onChange)
      return onChange
    })

    return () => {
      listeners.forEach((eventListener, index) => {
        mediaQuerySignals[index][1].removeEventListener('change', eventListener)
      })
    }
  }, [mediaQuerySignals])

  const activeBreakpointIndex = useMemo(() => {
    if (Object.values(mediaQueryMatches).length === 0) return fallbackBreakpointIndex
    const firstNotMatchingIndex = mediaQuerySignals.findIndex(
      ([breakpointId]) => mediaQueryMatches[breakpointId] !== true
    )
    if (firstNotMatchingIndex === -1) return breakpoints.length - 1
    if (firstNotMatchingIndex === 0) return fallbackBreakpointIndex
    return firstNotMatchingIndex
  }, [mediaQueryMatches, fallbackBreakpointIndex])

  const activeBreakpointId = breakpoints[activeBreakpointIndex].id
  const fallbackBreakpointId = breakpoints[fallbackBreakpointIndex].id

  // TODO: Write media queries
  const styleOverrides = {
    margin,
    padding,
    width: transformFill(width),
    height: transformFill(height),
    maxWidth,
    backgroundColor:
      backgroundColor[activeBreakpointId] ??
      backgroundColor[fallbackBreakpointId] ??
      backgroundColor,
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
  const { isDragging, parentNode, node, handleComponentDrop, onMouseDown } = props

  const isTopLevel = node?.data.blockId === CONTENTFUL_SECTION_ID

  // TODO: Use media queries in JS with a hook like shown in this post:
  // https://blog.tomaszgil.me/how-to-use-css-media-queries-in-react-components
  const lineStyles = flexDirection === 'row' ? 'lineVertical' : 'lineHorizontal'

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
        data-cf-node-id={node.data.id}
        data-cf-node-block-id={node.data.blockId}
        onMouseEnter={sectionInteraction.onMouseEnter}
        onMouseUp={onMouseUp}
        onMouseLeave={sectionInteraction.onMouseLeave}
        className={classNames('defaultStyles', className, {
          empty: !children || (Array.isArray(children) && children.length === 0),
        })}
        onMouseDown={onMouseDown}>
        {showPrependLine && <div key="lineIndicator_top" className={lineStyles}></div>}
        {children}
        {showAppendLine && <div key="lineIndicator_bottom" className={lineStyles}></div>}
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
