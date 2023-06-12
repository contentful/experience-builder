import { CompositionNode, Experience } from "../types"
import { VisualEditorRoot } from "./VisualEditorRoot"
import react, { useEffect, useMemo, useState } from 'react'
import { useComponents } from "../hooks"
import React from "react"

type CompositionPageProps = {
  node: CompositionNode,
  locale: string
}

export const CompositionBlock = ({ node, locale }: CompositionPageProps) => {
  const { getComponent } = useComponents()

  const definedComponent = useMemo(
    () => getComponent(node.definitionId as string),
    [node, getComponent]
  )

  if (!definedComponent) {
    return null
  }

  const props = useMemo(() => {
    if (!definedComponent) {
      return {}
    }
    return {}

    //const dataSourceForCurrentLocale = dataSource[locale] || {}

  }, [definedComponent])

  const { component } = definedComponent

  const children = node.children.map((childNode: any) => {
    return (
      <CompositionBlock
        node={childNode}
        key={childNode.data.id}
        locale={locale}
      />
    )
  })
  return React.createElement(
    component,
    props,
    children
  )
}