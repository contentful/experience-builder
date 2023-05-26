import tokens from '@contentful/f36-tokens'
import { css } from '@emotion/css'
import React from 'react'
import { Experience } from '../types'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyContainer } from './EmptyContainer'
import { useContentfulSection } from '../hooks/useContentfulSection'

const styles = {
  root: css({
    minHeight: '45vh',
    paddingBottom: '100px',
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

  useContentfulSection()
  const { tree, dataSource } = experience

  if (!tree?.root.children.length) {
    return React.createElement(EmptyContainer, { onComponentDropped }, [])
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
