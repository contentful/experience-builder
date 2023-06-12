import { CompositionDataSource, CompositionNode, Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import react, { useEffect, useMemo, useState } from 'react'
import { useComponents } from '../hooks'
import React from 'react'
import { Asset, Entry } from 'contentful'

type CompositionPageProps = {
  node: CompositionNode
  locale: string
  entries: Entry[]
  assets: Asset[]
  dataSource: CompositionDataSource
}

export const CompositionBlock = ({
  node,
  locale,
  entries,
  assets,
  dataSource,
}: CompositionPageProps) => {
  const { getComponent } = useComponents()

  const definedComponent = useMemo(
    () => getComponent(node.definitionId as string),
    [node, getComponent]
  )

  if (!definedComponent) {
    return null
  }

  const props = useMemo(() => {
    if (!definedComponent) {
      return {}
    }
    return {}

    //const dataSourceForCurrentLocale = dataSource[locale] || {}
  }, [definedComponent])

  const { component } = definedComponent

  const children = node.children.map((childNode: any, index) => {
    return (
      <CompositionBlock
        node={childNode}
        key={index}
        locale={locale}
        entries={entries}
        assets={assets}
        dataSource={dataSource}
      />
    )
  })
  return React.createElement(component, props, children)
}
