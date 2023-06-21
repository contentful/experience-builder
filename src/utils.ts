import { LocalizedDataSource, CompositionTree } from './types'

export const getDataSourceFromTree = (tree: CompositionTree): LocalizedDataSource => {
  const dataSource: LocalizedDataSource = {}
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

    if (node.children.length) {
      queue.push(...node.children)
    }
  }

  return dataSource
}

export const isInsideIframe = (): boolean => {
  try {
    return window.top?.location.href !== window.location.href
  } catch (err) {
    // window.top.location.href is not accessable for non same origin iframes
    return true
  }
}
