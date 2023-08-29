import React, { useMemo } from 'react'
import {
  OutgoingExperienceBuilderEvent,
  CompositionComponentNode,
  StyleProps,
  Link,
  CompositionVariableValueType,
  CompositionDataSource,
  CompositionUnboundValues,
} from '../types'

import { useComponents } from '../hooks'
import { CF_STYLE_ATTRIBUTES, CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'

import { getUnboundValues } from '../core/getUnboundValues'
import { ResolveDesignValueType } from '../hooks/useBreakpoints'
import { useSelectedInstanceCoordinates } from '../hooks/useSelectedInstanceCoordinates'
import { ExperienceBuilderEditorEntityStore } from '../core/ExperienceBuilderEditorEntityStore'
import { transformContentValue } from './transformers'

import { useStyleTag } from '../hooks/useStyleTag'
import { buildCfStyles } from '../core/stylesUtils'
import omit from 'lodash.omit'
import { sendMessage } from '../communication/sendMessage'
import { getDefinedComponent } from '../hooks/useComponents'

type PropsType =
  | StyleProps
  | Record<string, CompositionVariableValueType | Link<'Entry'> | Link<'Asset'>>

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: CompositionDataSource
  unboundValues: CompositionUnboundValues
  selectedNodeId?: string
  resolveDesignValue: ResolveDesignValueType
  entityStore: React.RefObject<ExperienceBuilderEditorEntityStore>
  areEntitiesFetched: boolean
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  unboundValues,
  selectedNodeId,
  resolveDesignValue,
  entityStore,
  areEntitiesFetched,
}: VisualEditorBlockProps) => {

  const definedComponent = useMemo(
    () => getDefinedComponent(node.data.blockId as string),
    [node]
  )

  useSelectedInstanceCoordinates({ instanceId: selectedNodeId, node })

  const props: PropsType = useMemo(() => {
    if (!definedComponent) {
      return {}
    }

    return Object.entries(definedComponent.componentDefinition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const variableMapping = node.data.props[variableName]
        if (!variableMapping) {
          return {
            ...acc,
            [variableName]: variableDefinition.defaultValue,
          }
        }

        if (variableMapping.type === 'DesignValue') {
          return {
            ...acc,
            [variableName]: resolveDesignValue(variableMapping.valuesByBreakpoint),
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
    definedComponent,
    node.data.props,
    resolveDesignValue,
    dataSource,
    areEntitiesFetched,
    entityStore,
    unboundValues,
  ])

  const cfStyles = buildCfStyles(props)
  const { className } = useStyleTag({ styles: cfStyles, nodeId: node.data.id })

  if (!definedComponent) {
    return null
  }

  const { component, componentDefinition } = definedComponent

  const children =
    definedComponent.componentDefinition.children &&
    node.children.map((childNode) => {
      return (
        <VisualEditorBlock
          node={childNode}
          key={childNode.data.id}
          locale={locale}
          dataSource={dataSource}
          unboundValues={unboundValues}
          selectedNodeId={selectedNodeId}
          resolveDesignValue={resolveDesignValue}
          entityStore={entityStore}
          areEntitiesFetched={areEntitiesFetched}
        />
      )
    })

  // contentful section
  if ([CONTENTFUL_SECTION_ID, CONTENTFUL_CONTAINER_ID].includes(componentDefinition.id)) {
    return (
      <ContentfulSection
        className={className}
        editorMode={true}
        key={node.data.id}
        node={node}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, {
            node,
          })
        }}
        cfStyles={cfStyles}
        {...(omit(props, CF_STYLE_ATTRIBUTES) as unknown as StyleProps)}>
        {children}
      </ContentfulSection>
    )
  }

  // imported component
  return React.createElement(
    component,
    {
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
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
      ...omit(props, CF_STYLE_ATTRIBUTES),
    },
    children
  )
}
