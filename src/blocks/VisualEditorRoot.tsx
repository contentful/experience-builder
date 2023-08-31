import React, { useEffect, useRef, useState } from 'react'
import { ExperienceBuilderSettings } from '../types'
import { VisualEditorBlock } from './VisualEditorBlock'
import { EmptyEditorContainer } from './EmptyEdtorContainer'

import './VisualEditorRoot.css'
import { useHoverIndicator } from '../hooks/useHoverIndicator'
import { onComponentDropped } from '../communication/onComponentDrop'
import { useBreakpoints } from '../hooks/useBreakpoints'
import { ExperienceBuilderEditorEntityStore } from '../core/ExperienceBuilderEditorEntityStore'
import { useEditorMode } from '../hooks/useEditorMode'

type VisualEditorRootProps = {
  settings: ExperienceBuilderSettings
}

export const VisualEditorRoot = ({ settings }: VisualEditorRootProps) => {
  const { tree, dataSource, isDragging, selectedNodeId, unboundValues, breakpoints } =
    useEditorMode(settings)

  // We call it here instead of on block-level to avoid registering too many even listeners for media queries
  const { resolveDesignValue } = useBreakpoints(breakpoints)
  useHoverIndicator(isDragging)
  const [areEntitiesFetched, setEntitiesFetched] = useState(false)

  const [entityStore, setEntityStore] = useState<ExperienceBuilderEditorEntityStore>(
    new ExperienceBuilderEditorEntityStore({
      entities: [],
      locale: settings.locale,
    })
  )

  useEffect(() => {
    setEntityStore(new ExperienceBuilderEditorEntityStore({
      entities: [],
      locale: settings.locale,
    }));
  }, [settings.locale])

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
      await entityStore.fetchEntities(entityLinks)
      setEntitiesFetched(true)
    }

    resolveEntities()
  }, [dataSource, entityStore])

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
          locale={settings.locale}
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
