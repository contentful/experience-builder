import { tokens } from '../coreLayouts'
import { css } from '@emotion/css'
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

const styles = {
  hover: css({
    ':hover': {
      border: `1px solid ${tokens.blue500}`,
      boxSizing: 'border-box',
    },
  }),
}

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
  isDragging: boolean
  isSelected?: boolean
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  isDragging,
  isSelected,
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
      />
    )
  })

  return React.createElement(
    component,
    {
      onMouseUp: () => {
        onComponentDropped({ node })
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
      className: styles.hover,
      isDragging,
      isSelected: !!isSelected,
      ...props,
    },
    children
  )
}
