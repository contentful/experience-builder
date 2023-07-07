import { Composition } from '../../src/types'
import { entityIds } from './entities'

const compositionFields: Composition = {
  title: 'Test Composition',
  slug: 'test',
  children: [
    {
      definitionId: 'component-1',
      variables: {},
      children: [],
    },
    {
      definitionId: 'component-2',
      variables: {},
      children: [],
    },
  ],
  dataSource: {
    uuid2: {
      sys: {
        id: entityIds.ENTRY1,
        type: 'Link',
        linkType: 'Entry',
      },
    },
    uuid3: {
      sys: {
        id: entityIds.ENTRY2,
        type: 'Link',
        linkType: 'Entry',
      },
    },
    uuid4: {
      sys: {
        id: entityIds.ASSET1,
        type: 'Link',
        linkType: 'Asset',
      },
    },
  },
  unboundValues: {
    uuid1: {
      value: 'test',
    },
  },
}

export const compositionEntry = {
  sys: {
    id: 'composition-id',
    type: 'Entry',
    contentType: {
      sys: {
        id: 'layout',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
  },
  fields: compositionFields,
}
