import {
  LocalizedDataSource,
  CompositionTree,
  CompositionComponentNode,
  StyleProps,
  LocalizedUnboundValues,
  DroppedNodeParent,
} from './types'

export const getDataFromTree = (
  tree: CompositionTree
): {
  dataSource: LocalizedDataSource
  unboundValues: LocalizedUnboundValues
} => {
  const dataSource: LocalizedDataSource = {}
  const unboundValues: LocalizedUnboundValues = {}
  const queue = [...tree.root.children]

  while (queue.length) {
    const node = queue.shift()
    if (!node) {
      continue
    }

    for (const [locale, data] of Object.entries(node.data.dataSource)) {
      if (!dataSource[locale]) {
        dataSource[locale] = { ...data }
      }

      dataSource[locale] = {
        ...dataSource[locale],
        ...data,
      }
    }

    for (const [locale, data] of Object.entries(node.data.unboundValues)) {
      if (!unboundValues[locale]) {
        unboundValues[locale] = { ...data }
      }

      unboundValues[locale] = {
        ...unboundValues[locale],
        ...data,
      }
    }

    if (node.children.length) {
      queue.push(...node.children)
    }
  }

  return {
    dataSource,
    unboundValues,
  }
}

type GetInsertionDataParams = {
  dropReceiverNode: CompositionComponentNode
  dropReceiverParentNode: CompositionComponentNode
  flexDirection?: StyleProps['flexDirection']
  isMouseAtTopBorder: boolean
  isMouseAtBottomBorder: boolean
  isOverTopIndicator: boolean
  isOverBottomIndicator: boolean
}

export type InsertionData = {
  parent: DroppedNodeParent
  index: number
}

/**
 * Gets calculates the index to drop the dragged component based on the mouse position
 * @returns {InsertionData} a object containing a node that will become a parent for dragged component and index at which it must be inserted
 */
export const getInsertionData = ({
  dropReceiverParentNode,
  dropReceiverNode,
  isMouseAtTopBorder,
  isMouseAtBottomBorder,
  isOverTopIndicator,
  isOverBottomIndicator,
}: GetInsertionDataParams): InsertionData | null => {
  if (isMouseAtTopBorder || isMouseAtBottomBorder) {
    const indexOfSectionInParentChildren = dropReceiverParentNode.children.findIndex(
      (n) => n.data.id === dropReceiverNode.data.id
    )
    const APPEND_OUTSIDE = indexOfSectionInParentChildren + 1
    const PREPEND_OUTSIDE = indexOfSectionInParentChildren

    return {
      // when the mouse is around the border we want to drop the new component as a new section onto the root node

      parent: {
        nodeId: dropReceiverParentNode.data.id,
        blockId: dropReceiverParentNode.data.blockId,
        blockType: dropReceiverParentNode.type,
      },

      index: isMouseAtBottomBorder ? APPEND_OUTSIDE : PREPEND_OUTSIDE,
    }
  }

  // if over one of the section indicators
  if (isOverTopIndicator || isOverBottomIndicator) {
    const indexOfSectionInParentChildren = dropReceiverParentNode.children.findIndex(
      (n) => n.data.id === dropReceiverNode.data.id
    )
    const APPEND_OUTSIDE = indexOfSectionInParentChildren + 1
    const PREPEND_OUTSIDE = indexOfSectionInParentChildren

    return {
      // when the mouse is around the border we want to drop the new component as a new section onto the root node
      parent: {
        nodeId: dropReceiverParentNode.data.id,
        blockId: dropReceiverParentNode.data.blockId,
        blockType: dropReceiverParentNode.type,
      },
      index: isOverBottomIndicator ? APPEND_OUTSIDE : PREPEND_OUTSIDE,
    }
  }
  return null
}
export const isInsideIframe = (): boolean => {
  try {
    return window.top?.location.href !== window.location.href
  } catch (err) {
    // window.top.location.href is not accessable for non same origin iframes
    return true
  }
}
