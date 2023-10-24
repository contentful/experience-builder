import React, { RefObject, useMemo } from 'react'
import {
  OutgoingExperienceBuilderEvent,
  CompositionComponentNode,
  StyleProps,
  Link,
  CompositionVariableValueType,
  CompositionDataSource,
  CompositionUnboundValues,
} from '../types'

import { CF_STYLE_ATTRIBUTES, CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulContainer } from './ContentfulContainer'

import { getUnboundValues } from '../core/getUnboundValues'
import { ResolveDesignValueType } from '../hooks/useBreakpoints'
import { useSelectedInstanceCoordinates } from '../hooks/useSelectedInstanceCoordinates'
import type { EntityStore } from '@contentful/visual-sdk'
import { transformContentValue } from './transformers'

import { useStyleTag } from '../hooks/useStyleTag'
import { buildCfStyles, calculateNodeDefaultHeight } from '../core/stylesUtils'
import omit from 'lodash.omit'
import { sendMessage } from '../communication/sendMessage'
import { getComponentRegistration } from '../core/componentRegistry'
import { useEditorContext } from './useEditorContext'
import { ImportedComponentErrorBoundary } from './ErrorBoundary'

type PropsType =
  | StyleProps
  | Record<string, CompositionVariableValueType | Link<'Entry'> | Link<'Asset'>>

type VisualEditorBlockProps = {
  node: CompositionComponentNode

  dataSource: CompositionDataSource
  unboundValues: CompositionUnboundValues

  resolveDesignValue: ResolveDesignValueType
  entityStore: RefObject<EntityStore>
  areEntitiesFetched: boolean
}

export const VisualEditorBlock = ({
  node,
  dataSource,
  unboundValues,
  resolveDesignValue,
  entityStore,
  areEntitiesFetched,
}: VisualEditorBlockProps) => {
  const componentRegistration = useMemo(
    () => getComponentRegistration(node.data.blockId as string),
    [node]
  )

  const { setSelectedNodeId } = useEditorContext()

  useSelectedInstanceCoordinates({ node })

  const props: PropsType = useMemo(() => {
    if (!componentRegistration) {
      return {}
    }

    return Object.entries(componentRegistration.definition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const variableMapping = node.data.props[variableName]
        if (!variableMapping) {
          return {
            ...acc,
            [variableName]: variableDefinition.defaultValue,
          }
        }

        if (variableMapping.type === 'DesignValue') {
          const valueByBreakpoint = resolveDesignValue(variableMapping.valuesByBreakpoint)
          const designValue =
            variableName === 'cfHeight'
              ? calculateNodeDefaultHeight({
                  blockId: node.data.blockId,
                  children: node.children,
                  value: valueByBreakpoint,
                })
              : valueByBreakpoint

          return {
            ...acc,
            [variableName]: designValue,
          }
        } else if (variableMapping.type === 'BoundValue') {
          // take value from the datasource for both bound and unbound value types
          const [, uuid, ...path] = variableMapping.path.split('/')
          const binding = dataSource[uuid] as Link<'Entry' | 'Asset'>

          const boundValue = areEntitiesFetched
            ? entityStore.current?.getValue(binding, path.slice(0, -1))
            : undefined
          const value = boundValue || variableDefinition.defaultValue

          return {
            ...acc,
            [variableName]: transformContentValue(value, variableDefinition),
          }
        } else {
          const value = getUnboundValues({
            key: variableMapping.key,
            fallback: variableDefinition.defaultValue,
            unboundValues: unboundValues || {},
          })

          return {
            ...acc,
            [variableName]: value,
          }
        }
      },
      {}
    )
  }, [
    componentRegistration,
    node.data.props,
    node.data.blockId,
    node.children,
    resolveDesignValue,
    dataSource,
    areEntitiesFetched,
    entityStore,
    unboundValues,
  ])

  const cfStyles = buildCfStyles(props)
  const { className } = useStyleTag({ styles: cfStyles, nodeId: node.data.id })

  if (!componentRegistration) {
    return null
  }

  const { component, definition } = componentRegistration

  const children =
    definition.children === true
      ? node.children.map((childNode) => {
          return (
            <VisualEditorBlock
              node={childNode}
              key={childNode.data.id}
              dataSource={dataSource}
              unboundValues={unboundValues}
              resolveDesignValue={resolveDesignValue}
              entityStore={entityStore}
              areEntitiesFetched={areEntitiesFetched}
            />
          )
        })
      : null

  // remove CONTENTFUL_SECTION_ID when all customers are using 2023-09-28 schema version
  if ([CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID].includes(definition.id)) {
    return (
      <ContentfulContainer
        className={className}
        editorMode={true}
        key={node.data.id}
        node={node}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setSelectedNodeId(node.data.id)
          sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, {
            node,
          })
        }}
        // something is off with conditional types and eslint can't recognize it
        // eslint-disable-next-line react/prop-types
        cfHyperlink={(props as StyleProps).cfHyperlink}
        // eslint-disable-next-line react/prop-types
        cfOpenInNewTab={(props as StyleProps).cfOpenInNewTab}>
        {children}
      </ContentfulContainer>
    )
  }

  const importedComponent = React.createElement(
    component,
    {
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        setSelectedNodeId(node.data.id)
        sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, {
          node,
        })
      },
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
      },
      'data-cf-node-id': node.data.id,
      'data-cf-node-block-id': node.data.blockId,
      'data-cf-node-block-type': node.type,
      className,
      // TODO: do we really need lodash just for this?
      ...omit(props, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
    },
    children
  )

  return <ImportedComponentErrorBoundary>{importedComponent}</ImportedComponentErrorBoundary>
}
