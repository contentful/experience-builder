import { LocalizedDataSource, CompositionTree } from './types'

export const getDataSourceFromTree = (tree: CompositionTree): LocalizedDataSource => {
  const dataSource: LocalizedDataSource = {}
  const queue = [tree.root]

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
  }

  return dataSource
}
