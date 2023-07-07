import {
  CompositionDataSource,
  CompositionNode,
  CompositionUnboundValues,
  StyleProps,
} from '../types'

import React, { useMemo } from 'react'
import { useComponents } from '../hooks'
import { UnresolvedLink } from 'contentful'
import { EntityStore } from '../core/EntityStore'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'

type CompositionBlockProps = {
  node: CompositionNode
  locale: string
  dataSource: CompositionDataSource
  unboundValues: CompositionUnboundValues
  entityStore?: EntityStore
}

export const CompositionBlock = ({
  node,
  locale,
  entityStore,
  dataSource,
  unboundValues,
}: CompositionBlockProps) => {
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

    const propMap: Record<string, string | number | boolean | Record<any, any> | undefined> = {}

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = variable.value as string
          break
        case 'BoundValue': {
          const [, uuid, ...path] = variable.path.split('/')
          const binding = dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>
          acc[variableName] = entityStore?.getValue(binding, path.slice(0, -1))
          break
        }
        case 'UnboundValue': {
          const uuid = variable.key
          acc[variableName] = unboundValues[uuid].value
          break
        }
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
        unboundValues={unboundValues}
        entityStore={entityStore}
      />
    )
  })

  if ([CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID].includes(node.definitionId)) {
    return (
      <ContentfulSection editorMode={false} {...(props as unknown as StyleProps)}>
        {children}
      </ContentfulSection>
    )
  }

  return React.createElement(component, props, children)
}
