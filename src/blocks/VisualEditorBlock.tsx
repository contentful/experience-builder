import React, { useEffect, useMemo } from 'react'
import {
  LocalizedDataSource,
  OutgoingExperienceBuilderEvent,
  CompositionComponentNode,
  StyleProps,
  LocalizedUnboundValues,
  Link,
  CompositionVariableValueType,
} from '../types'

import { useComponents } from '../hooks'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'

import { getValueFromDataSource } from '../core/getValueFromDataSource'
import { getUnboundValues } from '../core/getUnboundValues'
import { sendMessage } from '../sendMessage'
import { updateSelectedComponentCoordinates } from '../communication/updateSelectedComponentCoordinates'
import { ResolveDesignValueType } from '../hooks/useBreakpoints'

type PropsType =
  | StyleProps
  | Record<string, CompositionVariableValueType | Link<'Entry'> | Link<'Asset'>>

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
  unboundValues: LocalizedUnboundValues
  isDragging: boolean
  selectedNodeId?: string
  parentNode: CompositionComponentNode
  resolveDesignValue: ResolveDesignValueType
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  unboundValues,
  isDragging,
  parentNode,
  selectedNodeId,
  resolveDesignValue,
}: VisualEditorBlockProps) => {
  const { getComponent } = useComponents()

  const definedComponent = useMemo(
    () => getComponent(node.data.blockId as string),
    [node, getComponent]
  )

  useEffect(() => {
    updateSelectedComponentCoordinates({ instanceId: selectedNodeId })
  }, [selectedNodeId])

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
          const value = getValueFromDataSource({
            path: variableMapping.path,
            fallback: variableDefinition.defaultValue,
            dataSourceForCurrentLocale: dataSource[locale] || {},
          })

          return {
            ...acc,
            [variableName]: value,
          }
        } else {
          /**
           * Extracting default locale code from unboundValues Object.
           * As unboundValues is non-localized and will always have values against
           * default locale code.
           * TODO: This is a temp solution and will be fixed in upcoming tickets.
           */
          const keys = Object.keys(unboundValues)
          const unboundValuesLocale = keys[0]

          const value = getUnboundValues({
            key: variableMapping.key,
            fallback: variableDefinition.defaultValue,
            unboundValuesForCurrentLocale: unboundValues[unboundValuesLocale] || {},
          })

          return {
            ...acc,
            [variableName]: value,
          }
        }
      },
      {}
    )
  }, [resolveDesignValue, definedComponent, node.data.props, dataSource, locale, unboundValues])

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
          parentNode={parentNode}
          key={childNode.data.id}
          locale={locale}
          dataSource={dataSource}
          unboundValues={unboundValues}
          isDragging={isDragging}
          selectedNodeId={selectedNodeId}
          resolveDesignValue={resolveDesignValue}
        />
      )
    })

  // contentful section
  if ([CONTENTFUL_SECTION_ID, CONTENTFUL_CONTAINER_ID].includes(componentDefinition.id)) {
    return (
      <ContentfulSection
        key={node.data.id}
        node={node}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, {
            node,
          })
        }}
        isDragging={isDragging}
        parentNode={parentNode}
        {...(props as unknown as StyleProps)}>
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
      ...props,
    },
    children
  )
}
