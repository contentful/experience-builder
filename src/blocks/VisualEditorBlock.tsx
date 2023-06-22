import React, { useMemo, useRef } from 'react'
import get from 'lodash.get'
import {
  CompositionVariableValueType,
  LocalizedDataSource,
  OutgoingExperienceBuilderEvent,
  CompositionComponentNode,
} from '../types'
import { useCommunication } from '../hooks/useCommunication'
import { useInteraction } from '../hooks/useInteraction'
import { useComponents } from '../hooks'
import { Link } from 'contentful-management'

import './VisualEditorBlock.css'

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
  isDragging: boolean
  isSelected?: boolean
  rootNode: CompositionComponentNode
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  isDragging,
  isSelected,
  rootNode,
}: VisualEditorBlockProps) => {
  const { sendMessage } = useCommunication()
  const { getComponent } = useComponents()
  const { onComponentDropped, onComponentRemoved } = useInteraction()
  const wasMousePressed = useRef(false)

  const definedComponent = useMemo(
    () => getComponent(node.data.blockId as string),
    [node, getComponent]
  )

  const props = useMemo(() => {
    if (!definedComponent) {
      return {}
    }

    const dataSourceForCurrentLocale = dataSource[locale] || {}

    const getValueFromDataSource = ({
      path,
      fallback,
    }: {
      path: string
      fallback: CompositionVariableValueType
    }): Link<'Entry'> | Link<'Asset'> | CompositionVariableValueType => {
      const pathWithoutFirstSlash = path.slice(1)
      const lodashPath = `${pathWithoutFirstSlash.split('/')[0]}.value`

      return get(dataSourceForCurrentLocale, lodashPath, fallback) as
        | Link<'Entry'>
        | Link<'Asset'>
        | CompositionVariableValueType
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
        } else {
          // take value from the datasource for both bound and unbound value types
          const value = getValueFromDataSource({
            path: variableMapping.path,
            fallback: variableDefinition.defaultValue,
          })

          return {
            ...acc,
            [variableName]: value,
          }
        }
      },
      {}
    )
  }, [definedComponent, node.data.props, dataSource, locale])

  if (!definedComponent) {
    return null
  }

  const { component } = definedComponent

  const children = node.children.map((childNode: any) => {
    return (
      <VisualEditorBlock
        node={childNode}
        key={childNode.data.id}
        locale={locale}
        dataSource={dataSource}
        isDragging={isDragging}
        rootNode={rootNode}
      />
    )
  })

  return React.createElement(
    component,
    {
      onMouseUp: (append: boolean, nodeOverride?: CompositionComponentNode) => {
        if (typeof append !== 'boolean') {
          // When this event is called by the ContentfulSection it is a boolean, otherwise it is a MouseEvent
          // object which we don't want to process
          append = true
        }
        let dropNode = node
        if (nodeOverride && nodeOverride.type) {
          dropNode = nodeOverride
        }
        onComponentDropped({ node: dropNode, append })
        wasMousePressed.current = false
      },
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        wasMousePressed.current = true
        sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, { node })
      },
      onClick: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
      },
      onComponentRemoved: () => {
        onComponentRemoved(node)
      },
      id: 'VisualEditorBlock',
      className: 'hover',
      isDragging,
      isSelected: !!isSelected,
      rootNode,
      ...props,
    },
    children
  )
}
