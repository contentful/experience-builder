import React from 'react'
import { Button, ButtonGroup } from '@contentful/f36-button'
import { Flex } from '@contentful/f36-core'
import { CopyIcon, DeleteIcon } from '@contentful/f36-icons'
import { css } from '@emotion/css'

const styles = {
  tooltip: css({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'absolute',
    top: '1px',
    right: '1px',
  }),
}

export const SectionTooltip = ({ onComponentRemoved }: { onComponentRemoved: () => void }) => {
  return (
    <Flex className={styles.tooltip}>
      <ButtonGroup variant="merged">
        <Button variant="primary" size="small">
          <CopyIcon variant="white" />
        </Button>
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            onComponentRemoved()
          }}>
          <DeleteIcon variant="white" />
        </Button>
      </ButtonGroup>
    </Flex>
  )
}
