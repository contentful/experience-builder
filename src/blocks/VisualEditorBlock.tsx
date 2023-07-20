import React, { useMemo } from 'react'
import {
  LocalizedDataSource,
  OutgoingExperienceBuilderEvent,
  CompositionComponentNode,
  StyleProps,
  LocalizedUnboundValues,
  Breakpoint,
  CompositionVariableValueType,
} from '../types'
import { useCommunication } from '../hooks/useCommunication'
import { useInteraction } from '../hooks/useInteraction'
import { useComponents } from '../hooks'
import { CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'

import './VisualEditorBlock.css'
import { getValueFromDataSource } from '../core/getValueFromDataSource'
import { getUnboundValues } from '../core/getUnboundValues'
import { useSelectedInstanceCoordinates } from '../hooks/useSelectedInstanceCoordinates'

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
  unboundValues: LocalizedUnboundValues
  isDragging: boolean
  selectedNodeId?: string
  parentNode: CompositionComponentNode
  breakpoints: Breakpoint[]
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  unboundValues,
  isDragging,
  parentNode,
  selectedNodeId,
  breakpoints,
}: VisualEditorBlockProps) => {
  useSelectedInstanceCoordinates({ instanceId: selectedNodeId, node })

  const { sendMessage } = useCommunication()
  const { getComponent } = useComponents()
  const { onComponentDropped, onComponentRemoved } = useInteraction()

  const definedComponent = useMemo(
    () => getComponent(node.data.blockId as string),
    [node, getComponent]
  )

  const props: StyleProps = useMemo(() => {
    if (!definedComponent) {
      return {} as StyleProps
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
            // TODO: Remove old value access as soon as this PR is ready
            [variableName]: (variableMapping as any).value ?? variableMapping.valuesPerBreakpoint,
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
      {} as StyleProps
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
          breakpoints={breakpoints}
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
          })
        }}
        className="visualEditorBlockHover"
        isDragging={isDragging}
        parentNode={parentNode}
        breakpoints={breakpoints}
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
      className: 'visualEditorBlockHover',
      'data-cf-node-id': node.data.id,
      'data-cf-node-block-id': node.data.blockId,
      ...props,
    },
    children
  )
}
