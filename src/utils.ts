import { LocalizedDataSource, Tree } from './types'

export const getDataSourceFromTree = (tree: Tree): LocalizedDataSource => {
  const dataSource: LocalizedDataSource = {}
  const queue = [tree.root]

  while (queue.length) {
    const node = queue.shift()
    if (!node) {
      continue
    }

    for (const [locale, data] of Object.entries(node.data.dataSource)) {
      if (!dataSource[locale]) {
        // @ts-expect-error some type mismatches
        dataSource[locale] = { ...data }
      }

      // @ts-expect-error some type mismatches
      dataSource[locale] = {
        ...dataSource[locale],
        ...data,
      }
    }
  }

  return dataSource
}
