import tokens from '@contentful/f36-tokens'
import { css, cx } from '@emotion/css'
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
      border: `3px solid ${tokens.blue500}`,
    },
  }),
  emptyContainer: css({
    padding: tokens.spacing4Xl,
  }),
  container: css({
    backgroundColor: '#ffffff',
    opacity: 0.8,
    backgroundImage:
      'repeating-linear-gradient(45deg, #f6f6f6 25%, transparent 25%, transparent 75%, #f6f6f6 75%, #f6f6f6), repeating-linear-gradient(45deg, #f6f6f6 25%, #ffffff 25%, #ffffff 75%, #f6f6f6 75%, #f6f6f6)',
    backgroundPosition: '0 0, 10px 10px',
    backgroundSize: '20px 20px',
  }),
}

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
}

export const VisualEditorBlock = ({ node, locale, dataSource }: VisualEditorBlockProps) => {
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
      className: cx(
        styles.hover,
        componentDefinition.children && !children?.length ? styles.emptyContainer : undefined,
        componentDefinition.children ? styles.container : undefined
      ),
      ...props,
    },
    children
  )
}
