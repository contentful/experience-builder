import tokens from '@contentful/f36-tokens'
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
    },
  }),
}

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
  isDragging: boolean
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  isDragging,
}: VisualEditorBlockProps) => {
  const { sendMessage } = useCommunication()
  const { getComponent } = useComponents()
  const { onComponentDropped } = useInteraction()
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
      const lodashPath = pathWithoutFirstSlash.split('/').join('.')
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

        if (variableMapping.type === 'UnboundValue') {
          const value = getValueFromDataSource({
            path: variableMapping.path,
            fallback: variableDefinition.defaultValue,
          })
          return {
            ...acc,
            [variableName]: value,
          }
        } else if (variableMapping.type === 'DesignValue') {
          return {
            ...acc,
            [variableName]: variableMapping.value,
          }
        } else {
          // TODO: do the same stuff, but for the fetched entity (do we pass the fetched entity or does fetching)
          // happen on the sdk side?
          return acc
        }
      },
      {}
    )
  }, [definedComponent, node.data.props, dataSource, locale])

  if (!definedComponent) {
    return null
  }

  const { component, componentDefinition } = definedComponent

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
      className: styles.hover,
      isDragging,
      ...props,
    },
    children
  )
}
