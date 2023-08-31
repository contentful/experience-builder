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
import { CF_STYLE_ATTRIBUTES, CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'
import { ResolveDesignValueType } from '../hooks/useBreakpoints'
import { transformContentValue } from './transformers'
import { buildCfStyles } from '../core/stylesUtils'
import { useStyleTag } from '../hooks/useStyleTag'
import omit from 'lodash.omit'

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
  const { getComponentConfig } = useComponents()

  const registeredComponentConfig = useMemo(
    () => getComponentConfig(node.definitionId as string),
    [node, getComponentConfig]
  )

  const props = useMemo(() => {
    if (!registeredComponentConfig) {
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
          const variableDefinition = registeredComponentConfig.definition.variables[variableName]
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
  }, [
    registeredComponentConfig,
    node.variables,
    resolveDesignValue,
    dataSource,
    entityStore,
    unboundValues,
  ])

  const cfStyles = buildCfStyles(props)
  const { className } = useStyleTag({ styles: cfStyles })

  if (!registeredComponentConfig) {
    return null
  }

  const { component } = registeredComponentConfig

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
      <ContentfulSection
        editorMode={false}
        cfStyles={cfStyles}
        {...(omit(props, CF_STYLE_ATTRIBUTES) as unknown as StyleProps)}
        className={className}>
        {children}
      </ContentfulSection>
    )
  }

  return React.createElement(
    component,
    { ...omit(props, CF_STYLE_ATTRIBUTES), className },
    children
  )
}
