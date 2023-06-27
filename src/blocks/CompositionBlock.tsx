import { CompositionDataSource, CompositionNode } from '../types'

import react, { useMemo } from 'react'
import { useComponents } from '../hooks'
import React from 'react'
import { UnresolvedLink } from 'contentful'
import { EntityStore } from '../core/EntityStore'

type CompositionPageProps = {
  node: CompositionNode
  locale: string
  dataSource: CompositionDataSource
  entityStore?: EntityStore
}

export const CompositionBlock = ({
  node,
  locale,
  entityStore,
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

    const propMap: Record<string, string | number | boolean | undefined> = {}

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      let _empty: string, uuid: string, path: string[]
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = variable.value as string
          break
        case 'BoundValue':
          ;[_empty, uuid, ...path] = variable.path.split('/')
          const binding = dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>
          acc[variableName] = entityStore?.getValue(binding, path.slice(0, -1))
          break
        case 'UnboundValue':
          ;[_empty, uuid, ...path] = variable.path.split('/')
          // @ts-expect-error value may not exist
          acc[variableName] = dataSource[uuid].value
          break
        default:
          break
      }
      return acc
    }, propMap)
  }, [definedComponent, dataSource, entityStore, node])

  const { component } = definedComponent

  const children = node.children.map((childNode: any, index) => {
    return (
      <CompositionBlock
        node={childNode}
        key={index}
        locale={locale}
        dataSource={dataSource}
        entityStore={entityStore}
      />
    )
  })

  return React.createElement(component, props, children)
}
