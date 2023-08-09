import React, { useEffect, useRef } from 'react'
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
  const [areEntitiesFetched, setEntitiesFetched] = React.useState(false)

  const entityStore = useRef(
    new ExperienceBuilderEditorEntityStore({
      entities: [],
      locale,
    })
  )

  useEffect(() => {
    entityStore.current = new ExperienceBuilderEditorEntityStore({
      entities: [],
      locale,
    })
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
      const entityLinks = Object.values(dataSource || {})
      await entityStore.current.fetchEntities(entityLinks)
      setEntitiesFetched(true)
    }

    resolveEntities()
  }, [dataSource, locale, setEntitiesFetched])

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
          areEntitiesFetched={areEntitiesFetched}
        />
      )),
    ]
  )
}
