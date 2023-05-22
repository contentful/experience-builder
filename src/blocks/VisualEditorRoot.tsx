import tokens from '@contentful/f36-tokens'
import { css, cx } from '@emotion/css'
import React from 'react'
import { Experience } from '../types'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'

const styles = {
  root: css({
    height: '45vh',
    paddingBottom: '355.05px',
    overflow: 'scroll',
  }),
  hover: css({
    border: `3px solid transparent`,
    '&:hover': {
      border: `3px solid ${tokens.blue500}`,
    },
  }),
}

type VisualEditorRootProps = {
  experience: Experience
  locale: string
}

export const VisualEditorRoot = ({ experience, locale }: VisualEditorRootProps) => {
  const { onComponentDropped } = useInteraction()

  const { tree, dataSource } = experience

  if (!tree) {
    return React.createElement(
      'div',
      {
        className: cx(styles.root, styles.hover),
        onMouseUp: () => {
          onComponentDropped({ node: { data: { id: 'root' } } })
        },
      },
      []
    )
  }

  return React.createElement(
    'div',
    {
      className: styles.root,
      onMouseUp: () => {
        onComponentDropped({ node: tree.root })
      },
    },
    tree.root.children.map((node: any) => (
      <VisualEditorBlock key={node.data.id} node={node} locale={locale} dataSource={dataSource} />
    ))
  )
}
