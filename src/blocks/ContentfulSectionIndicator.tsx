import React, { MouseEventHandler } from 'react'
import './ContentfulSectionIndicator.css'

type ContentfulSectionIndicatorProps = {
  onMouseEnter: MouseEventHandler<HTMLDivElement>
  onMouseLeave: MouseEventHandler<HTMLDivElement>
  onMouseUp: MouseEventHandler<HTMLDivElement>
  isShown: boolean
}

export const ContentfulSectionIndicator = ({
  isShown,
  onMouseLeave,
  onMouseEnter,
  onMouseUp,
}: ContentfulSectionIndicatorProps) => {
  if (!isShown) {
    return null
  }

  return (
    <div
      id="ContentfulSectionIndicator"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      key="lineIndicator_new_section">
      <div className="indicatorLineHorizontal" />
      <div className="text">New section</div>
    </div>
  )
}

export const ContentfulSectionIndicatorPlaceholder = ({ isShown }: { isShown: boolean }) => {
  if (!isShown) {
    return null
  }

  return (
    <div id="ContentfulSectionIndicatorPlaceholder" key="lineIndicator_new_section_placeholder">
      <div className="indicatorLineHorizontalTransparent"></div>
      <div className="text">New section</div>
    </div>
  )
}
