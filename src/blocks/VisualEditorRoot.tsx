import React, { useEffect, useRef, useState } from 'react'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyEditorContainer } from './EmptyEdtorContainer'

import './VisualEditorRoot.css'
import { useHoverIndicator } from '../hooks/useHoverIndicator'
import { onComponentDropped } from '../communication/onComponentDrop'
import { useBreakpoints } from '../hooks/useBreakpoints'
import { ExperienceBuilderEditorEntityStore } from '../core/ExperienceBuilderEditorEntityStore'
import { useEditorMode } from '../hooks/useEditorMode'
import { CompositionMode } from '../types'

type VisualEditorRootProps = {
  initialLocale: string
  mode: CompositionMode
}

export const VisualEditorRoot = ({ initialLocale, mode }: VisualEditorRootProps) => {
  // in editor mode locale can change via sendMessage from web app, hence we use the locale from props only as initial locale
  const { tree, dataSource, isDragging, locale, selectedNodeId, unboundValues, breakpoints } =
    useEditorMode({ initialLocale, mode })

  // We call it here instead of on block-level to avoid registering too many even listeners for media queries
  const { resolveDesignValue } = useBreakpoints(breakpoints)
  useHoverIndicator(isDragging)
  const [areEntitiesFetched, setEntitiesFetched] = useState(false)

  const entityStore = useRef<ExperienceBuilderEditorEntityStore>(
    new ExperienceBuilderEditorEntityStore({
      entities: [],
      locale: locale,
    })
  )

  useEffect(() => {
    entityStore.current = new ExperienceBuilderEditorEntityStore({
      entities: [],
      locale: locale,
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
          areEntitiesFetched={areEntitiesFetched}
        />
      )),
    ]
  )
}
