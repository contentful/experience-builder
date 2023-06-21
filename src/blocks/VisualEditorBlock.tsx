import React, { useMemo } from 'react'
import get from 'lodash.get'
import {
  CompositionVariableValueType,
  LocalizedDataSource,
  OutgoingExperienceBuilderEvent,
  CompositionComponentNode,
  StyleProps,
} from '../types'
import { useCommunication } from '../hooks/useCommunication'
import { useInteraction } from '../hooks/useInteraction'
import { useComponents } from '../hooks'
import { Link } from 'contentful-management'
import { CONTENTFUL_SECTION_ID } from '../constants'
import { ContentfulSection } from './ContentfulSection'

import './VisualEditorBlock.css'

type VisualEditorBlockProps = {
  node: CompositionComponentNode
  locale: string
  dataSource: LocalizedDataSource
  isDragging: boolean
  isSelected?: boolean
  parentNode: CompositionComponentNode
}

export const VisualEditorBlock = ({
  node,
  locale,
  dataSource,
  isDragging,
  isSelected,
  parentNode,
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

  const { component, componentDefinition } = definedComponent

  const children = node.children.map((childNode: any) => {
    return (
      <VisualEditorBlock
        node={childNode}
        parentNode={parentNode}
        key={childNode.data.id}
        locale={locale}
        dataSource={dataSource}
        isDragging={isDragging}
      />
    )
  })

  // contentful section
  if (componentDefinition.id === CONTENTFUL_SECTION_ID) {
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
          sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, { node })
        }}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
        onComponentRemoved={() => {
          onComponentRemoved(node)
        }}
        className='visualEditorBlockHover'
        isDragging={isDragging}
        isSelected={!!isSelected}
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
        sendMessage(OutgoingExperienceBuilderEvent.COMPONENT_SELECTED, { node })
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
      isSelected: !!isSelected,
      ...props,
    },
    children
  )
}
