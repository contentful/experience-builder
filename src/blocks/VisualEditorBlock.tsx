import React, { useMemo } from 'react'
import {
  LocalizedDataSource,
  OutgoingExperienceBuilderEvent,
  CompositionComponentNode,
  StyleProps,
  LocalizedUnboundValues,
} from '../types'
import { useCommunication } from '../hooks/useCommunication'
import { useInteraction } from '../hooks/useInteraction'
import { useComponents } from '../hooks'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'

import './VisualEditorBlock.css'
import { getValueFromDataSource } from '../core/getValueFromDataSource'
import { getUnboundValues } from '../core/getUnboundValues'
import { getAllElementsBoundingBox } from '../core/dom-values'

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
  unboundValues: LocalizedUnboundValues
  isDragging: boolean
  selectedNodeId?: string
  parentNode: CompositionComponentNode
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  unboundValues,
  isDragging,
  parentNode,
  selectedNodeId,
}: VisualEditorBlockProps) => {
  const { sendMessage } = useCommunication()
  const { getComponent } = useComponents()
  const { onComponentDropped, onComponentRemoved } = useInteraction()

  const definedComponent = useMemo(
    () => getComponent(node.data.blockId as string),
    [node, getComponent]
  )

  const props = useMemo(() => {
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
            [variableName]: variableMapping.value,
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
          const value = getUnboundValues({
            key: variableMapping.key,
            fallback: variableDefinition.defaultValue,
            unboundValuesForCurrentLocale: unboundValues[locale] || {},
          })

          return {
            ...acc,
            [variableName]: value,
          }
        }
      },
      {}
    )
  }, [definedComponent, node.data.props, dataSource, locale, unboundValues])

  if (!definedComponent) {
    return null
  }

  const { component, componentDefinition } = definedComponent

  const children =
    definedComponent.componentDefinition.children &&
    node.children.map((childNode: any) => {
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
        />
      )
    })

  // contentful section
  if ([CONTENTFUL_SECTION_ID, CONTENTFUL_CONTAINER_ID].includes(componentDefinition.id)) {
    return (
      <ContentfulSection
        key={node.data.id}
        handleComponentDrop={({ index, node }) => {
          onComponentDropped({ node, index })
        }}
        node={node}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, {
						node,
						rect: e.target && getAllElementsBoundingBox(e.target as HTMLElement)
					})
        }}
        className="visualEditorBlockHover"
        isDragging={isDragging}
        parentNode={parentNode}
        {...(props as StyleProps)}>
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
					rect: e.target && getAllElementsBoundingBox(e.target as HTMLElement)
				})
      },
      onMouseUp: () => {
        if (definedComponent.componentDefinition.children) {
          // TODO: follow the logic from the section and based on mouse position and node.children.length, define the new index
          onComponentDropped({ node })
        }
      },
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
      },
      onComponentRemoved: () => {
        onComponentRemoved(node)
      },
      className: 'visualEditorBlockHover',
      isDragging,
      ...props,
    },
    children
  )
}
