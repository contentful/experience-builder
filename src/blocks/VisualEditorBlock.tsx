import tokens from '@contentful/f36-tokens'
import { css, cx } from '@emotion/css'
import React, { useMemo, useRef } from 'react'
import { BindingMapByBlockId, BoundData } from '../types'
import { useCommunication } from '../hooks/useCommunication'
import { useInteraction } from '../hooks/useInteraction'
import { VisualEditorTemplate } from './VisualEditorTemplate'
import { useComponents } from '../hooks'

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
  node: any
  template?: any
  binding: BindingMapByBlockId
  boundData: BoundData
}

export const VisualEditorBlock = ({
  node,
  template,
  binding,
  boundData,
}: VisualEditorBlockProps) => {
  const { sendMessage } = useCommunication()
  const { getComponent } = useComponents()
  const { onComponentDropped } = useInteraction()
  const wasMousePressed = useRef(false)

  const blockType = node.data.blockId.split(':')[0]

  const definedComponent = useMemo(() => getComponent(blockType), [blockType, getComponent])

  const { nodeBinding = {}, nodeBoundProps = {} } = useMemo(() => {
    // plain node, not a child of a template
    if (!template) {
      return {
        nodeBinding: binding[node.data.blockId],
        nodeBoundProps: boundData[node.data.blockId],
      }
    }

    // child of a template, but not template root node
    if (node.type !== 'template') {
      const parentTemplateBoundData = boundData[template.data.blockId]
      const parentTemplateBinding = binding[template.data.blockId]

      const parentTemplateBoundDataSourceData = parentTemplateBoundData
        ? parentTemplateBoundData[template.data.dataSource?.sys.id]
        : undefined

      return {
        nodeBinding: parentTemplateBinding ? parentTemplateBinding[node.data.blockId] : undefined,
        nodeBoundProps: parentTemplateBoundDataSourceData
          ? parentTemplateBoundDataSourceData[node.data.blockId]
          : undefined,
      }
    }

    // template root node
    const templateBoundData = boundData[node.data.blockId]
    return {
      nodeBinding: binding[node.data.blockId],
      nodeBoundProps: templateBoundData
        ? templateBoundData[template.data.dataSource.sys.id]
        : undefined,
    }
  }, [template, binding, node, boundData])

  const props = useMemo(() => {
    if (!definedComponent) {
      return {}
    }

    return Object.entries(definedComponent.componentDefinition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const boundValue = nodeBoundProps ? nodeBoundProps[variableName]?.value : undefined

        return {
          ...acc,
          [variableName]:
            boundValue || node.data.props[variableName] || variableDefinition.defaultValue,
        }
      },
      {}
    )
  }, [definedComponent, node.data.props, nodeBoundProps])

  if (node.type === 'template') {
    return (
      <VisualEditorTemplate
        key={node.data.id}
        node={node}
        binding={binding}
        boundData={boundData}
      />
    )
  }

  if (!definedComponent) {
    return null
  }

  const { component, componentDefinition } = definedComponent

  const children = node.children.map((childNode: any) => {
    if (childNode.type === 'string') {
      return (
        nodeBoundProps[childNode.data.propKey]?.value ||
        childNode.data.props[childNode.data.propKey]
      )
    }

    // if childnode's binding is present in the template, then pass the template on
    // if not, then template should be undefined as we consider it the end of the template's scope
    // there can be child nodes in the template that are dropped separtely and hence are unrelated to the current template
    const parentTemplateBoundData = template && boundData[template.data.blockId]
    const parentTemplateBoundDataSourceData = parentTemplateBoundData
      ? parentTemplateBoundData[template.data.dataSource?.sys.id]
      : undefined

    const childNodeTemplate = parentTemplateBoundDataSourceData?.[childNode.data.blockId]
      ? template
      : undefined

    return (
      <VisualEditorBlock
        node={childNode}
        key={childNode.data.id}
        template={childNodeTemplate}
        binding={binding}
        boundData={boundData}
      />
    )
  })

  return React.createElement(
    component,
    {
      onMouseUp: () => {
        onComponentDropped({ node, template })
        wasMousePressed.current = false
      },
      onMouseDown: (e: MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        wasMousePressed.current = true
        sendMessage('componentSelected', {
          node,
          template,
        })
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
