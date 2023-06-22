import React from 'react'
import './ContentfulSectionIndicator.css'

export const ContentfulSectionIndicator = () => {
  return (
    <div id="ContentfulSectionIndicator" key="lineIndicator_new_section" className="indicatorLineHorizontal">
      <div className="text">New section</div>
    </div>
  )
}

export const ContentfulSectionIndicatorPlaceholder = () => {
  return (
    <div
      id="ContentfulSectionIndicatorPlaceholder"
      key="lineIndicator_new_section_placeholder"
      className="indicatorLineHorizontalTransparent">
      <div className="textTransparent">New section</div>
    </div>
  )
}
