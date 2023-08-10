import React, { useEffect, useRef, useState } from 'react'
import { Experience } from '../types'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyEditorContainer } from './EmptyEdtorContainer'

import './VisualEditorRoot.css'
import { useHoverIndicator } from '../hooks/useHoverIndicator'
import { onComponentDropped } from '../communication/onComponentDrop'
import { useBreakpoints } from '../hooks/useBreakpoints'
import { ExperienceBuilderEditorEntityStore } from '../core/ExperienceBuilderEditorEntityStore'

type VisualEditorRootProps = {
  experience: Experience
  locale: string
}

export const VisualEditorRoot = ({ experience, locale }: VisualEditorRootProps) => {
  const { tree, dataSource, isDragging, selectedNodeId, unboundValues, breakpoints } = experience

  // We call it here instead of on block-level to avoid registering too many even listeners for media queries
  const { resolveDesignValue } = useBreakpoints(breakpoints)
  useHoverIndicator()
  const [entitiesFetched, setEntitiesFetched] = React.useState(false)

  const [entityStore, setEntityStore] = useState(() => new ExperienceBuilderEditorEntityStore({
    entities: [],
    locale,
  }))

  useEffect(() => {
    setEntityStore(new ExperienceBuilderEditorEntityStore({
      entities: [],
      locale,
    }))
  }, [locale])

  useEffect(() => {
    if (!tree || !tree?.root.children.length || !isDragging) return
    const onMouseUp = () => {
      onComponentDropped({ node: tree.root })
    }
    document.addEventListener('mouseup', onMouseUp)
    return () => document.removeEventListener('mouseup', onMouseUp)
  }, [tree, isDragging])

  useEffect(() => {
    const resolveEntities = async () => {
      setEntitiesFetched(false)
      console.log('fetching entities', dataSource, locale)
      const entityLinks = Object.values(dataSource[locale] || {})
      await entityStore?.fetchEntities(entityLinks)
      setEntitiesFetched(true)
    }

    resolveEntities()
  }, [dataSource, locale])

  if (!tree?.root.children.length) {
    return React.createElement(EmptyEditorContainer, { isDragging }, [])
  }

  return React.createElement(
    'div',
    {
      id: 'VisualEditorRoot',
      className: 'root',
      'data-type': 'root',
    },
    [
      tree.root.children.map((node: any) => (
        <VisualEditorBlock
          key={node.data.id}
          node={node}
          locale={locale}
          dataSource={dataSource}
          unboundValues={unboundValues}
          selectedNodeId={selectedNodeId}
          resolveDesignValue={resolveDesignValue}
          entityStore={entityStore}
          entitiesFetched={entitiesFetched}
        />
      )),
    ]
  )
}