import { Flex } from '@contentful/f36-core'
import tokens from '@contentful/f36-tokens'
import { css, cx } from '@emotion/css'
import React from 'react'
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
  ...props
}: ContentfulSectionProps) => {
  const { isMouseOver, onMouseOver, onMouseLeave } = useInteraction()

  console.log({ margin, padding, backgroundColor, width, height, border, gap })

  const styleOverrides = css({ margin, padding, backgroundColor, width, height, border, gap })

  const lineStyles = flexDirection === 'row' ? styles.lineVertical : styles.lineHorizontal

  return (
    <div className={isSelected ? cx(styles.containerBorder) : ''}>
      <Flex
        flexDirection={flexDirection}
        onMouseOver={onMouseOver}
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
