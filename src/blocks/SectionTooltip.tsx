import React from 'react'
import { Flex, CopyIcon, DeleteIcon } from '../core'

import './SectionTooltip.css'

export const SectionTooltip = ({ onComponentRemoved }: { onComponentRemoved: () => void }) => {
  return (
    <Flex data-cf-editor-tool="true" id="SectionTooltip" className="tooltip">
      <div className="wrapper">
        <button className="button">
          <CopyIcon />
        </button>
        <button
          className="button"
          onClick={() => {
            onComponentRemoved()
          }}>
          <DeleteIcon />
        </button>
      </div>
    </Flex>
  )
}
