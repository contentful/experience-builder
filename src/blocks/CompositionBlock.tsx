import {
  Breakpoint,
  CompositionDataSource,
  CompositionNode,
  CompositionUnboundValues,
  CompositionVariableValueType,
  StyleProps,
} from '../types'

import React, { useMemo } from 'react'
import { useComponents } from '../hooks'
import { UnresolvedLink } from 'contentful'
import { EntityStore } from '../core/EntityStore'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'
import { ResolveDesignValueType } from '../hooks/useBreakpoints'
import { transformContentValue } from './transformers'

type CompositionBlockProps = {
  node: CompositionNode
  locale: string
  dataSource: CompositionDataSource
  unboundValues: CompositionUnboundValues
  entityStore?: EntityStore
  breakpoints: Breakpoint[]
  resolveDesignValue: ResolveDesignValueType
}

export const CompositionBlock = ({
  node,
  locale,
  entityStore,
  dataSource,
  unboundValues,
  breakpoints,
  resolveDesignValue,
}: CompositionBlockProps) => {
  const { getComponent } = useComponents()

  const definedComponent = useMemo(
    () => getComponent(node.definitionId as string),
    [node, getComponent]
  )

  const props = useMemo(() => {
    if (!definedComponent) {
      return {}
    }

    const propMap: Record<string, CompositionVariableValueType> = {}

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = resolveDesignValue(variable.valuesByBreakpoint)
          break
        case 'BoundValue': {
          const [, uuid, ...path] = variable.path.split('/')
          const binding = dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>
          const value = entityStore?.getValue(binding, path.slice(0, -1))
          const variableDefinition = definedComponent.componentDefinition.variables[variableName]
          acc[variableName] = transformContentValue(value, variableDefinition)
          break
        }
        case 'UnboundValue': {
          const uuid = variable.key
          acc[variableName] = unboundValues[uuid]?.value
          break
        }
        default:
          break
      }
      return acc
    }, propMap)
  }, [definedComponent, node.variables, resolveDesignValue, dataSource, entityStore, unboundValues])

  if (!definedComponent) {
    return null
  }

  const { component } = definedComponent

  const children = node.children.map((childNode: CompositionNode, index) => {
    return (
      <CompositionBlock
        node={childNode}
        key={index}
        locale={locale}
        dataSource={dataSource}
        unboundValues={unboundValues}
        entityStore={entityStore}
        breakpoints={breakpoints}
        resolveDesignValue={resolveDesignValue}
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
