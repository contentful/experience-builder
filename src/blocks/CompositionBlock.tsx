import { CompositionDataSource, CompositionNode } from '../types'
import get from 'lodash.get'

import react, { useMemo } from 'react'
import { useComponents } from '../hooks'
import React from 'react'
import { Asset, Entry } from 'contentful'
import { Link } from 'contentful-management'

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

    const propMap: Record<string, string> = {}

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      let _empty: string, uuid: string, path: string[]
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = variable.value as string
          break
        case 'BoundValue':
          ;[_empty, uuid, ...path] = variable.path.split('/')
          const binding = dataSource[uuid] as Link<'Entry' | 'Asset'>
          const entity =
            binding.sys?.linkType === 'Entry'
              ? entries.find(({ sys: { id } }) => id === binding.sys?.id)
              : assets.find(({ sys: { id } }) => id === binding.sys?.id)

          if (entity) {
            acc[variableName] = get(entity, path.slice(0, -1))
          }
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
  }, [definedComponent, dataSource, entries, assets, node])

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
