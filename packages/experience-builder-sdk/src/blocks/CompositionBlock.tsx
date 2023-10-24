import type {
  Breakpoint,
  CompositionDataSource,
  CompositionNode,
  CompositionUnboundValues,
  CompositionVariableValueType,
  StyleProps,
} from '../types'

import React, { useMemo } from 'react'
import type { UnresolvedLink } from 'contentful'
import { CF_STYLE_ATTRIBUTES, CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { EntityStore } from '@contentful/visual-sdk'
import { ContentfulContainer } from './ContentfulContainer'
import { ResolveDesignValueType } from '../hooks/useBreakpoints'
import { transformContentValue } from './transformers'
import { buildCfStyles } from '../core/stylesUtils'
import { useStyleTag } from '../hooks/useStyleTag'
import omit from 'lodash.omit'
import { getComponentRegistration } from '../core/componentRegistry'

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
  const componentRegistration = useMemo(
    () => getComponentRegistration(node.definitionId as string),
    [node]
  )

  const nodeProps = useMemo(() => {
    if (!componentRegistration) {
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
          const variableDefinition = componentRegistration.definition.variables[variableName]
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
    componentRegistration,
    node.variables,
    resolveDesignValue,
    dataSource,
    entityStore,
    unboundValues,
  ])

  const cfStyles = buildCfStyles(nodeProps)
  const { className } = useStyleTag({ styles: cfStyles })

  if (!componentRegistration) {
    return null
  }

  const { component } = componentRegistration

  const children =
    componentRegistration.definition.children === true
      ? node.children.map((childNode: CompositionNode, index) => {
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
      : null

  // remove CONTENTFUL_SECTION_ID when all customers are using 2023-09-28 schema version
  if ([CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID].includes(node.definitionId)) {
    return (
      <ContentfulContainer
        editorMode={false}
        cfHyperlink={(nodeProps as StyleProps).cfHyperlink}
        cfOpenInNewTab={(nodeProps as StyleProps).cfOpenInNewTab}
        className={className}>
        {children}
      </ContentfulContainer>
    )
  }

  return React.createElement(
    component,
    {
      ...omit(nodeProps, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
      className,
    },
    children
  )
}
