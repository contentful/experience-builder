import { Asset, AssetFile, Entry } from 'contentful';
import merge from 'lodash.merge';
import type { PartialDeep } from 'type-fest';

export const entityIds = {
  ENTRY1: 'entry1',
  ENTRY2: 'entry2',
  ENTRY_WITH_EMBEDDED_ENTRY: 'entryWithEmbeddedEntry',
  ENTRY_WITH_EMBEDDED_ENTRIES: 'entryWithEmbeddedEntries',
  ENTRY_WITH_ANOTHER_EMBEDDED_ENTRY: 'entryWithAnotherEmbeddedEntry',
  ENTRY_WITH_EMBEDDED_ENTRY_IN_RICH_TEXT: 'entryWithEmbeddedEntryInRichText',
  ENTRY_WITH_EMBEDDED_ASSET_IN_RICH_TEXT: 'entryWithEmbeddedAssetInRichText',
  ENTRY_WITH_DEEPLY_EMBEDDED_ENTITIES_IN_RICH_TEXT: 'entryWithDeeplyEmbeddedEntitiesInRichText',
  ASSET1: 'asset1',
};

export const entries: Entry[] = [
  {
    sys: {
      id: entityIds.ENTRY1,
      type: 'Entry',
      contentType: {
        sys: {
          id: 'bar',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
      revision: 10,
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'cfexampleapi',
        },
      },
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      locale: 'en-US',
    },
    fields: {
      title: 'Entry 1',
      logo: {
        sys: {
          id: entityIds.ASSET1,
          type: 'Link',
          linkType: 'Asset',
        },
      },
    },
    metadata: {
      tags: [],
    },
  },
  {
    sys: {
      id: entityIds.ENTRY2,
      type: 'Entry',
      contentType: {
        sys: {
          id: 'bar',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
      revision: 10,
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'cfexampleapi',
        },
      },
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      locale: 'en-US',
    },
    fields: {
      title: 'Entry 2',
    },
    metadata: {
      tags: [],
    },
  },
];

export const entryWithEmbeddedEntry: Entry = {
  sys: {
    id: entityIds.ENTRY_WITH_EMBEDDED_ENTRY,
    type: 'Entry',
    contentType: {
      sys: {
        id: 'bar',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    revision: 10,
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'cfexampleapi',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    locale: 'en-US',
  },
  fields: {
    referencedEntry: {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: entityIds.ENTRY_WITH_ANOTHER_EMBEDDED_ENTRY,
      },
    },
  },
  metadata: {
    tags: [],
  },
};

export const entryWithEmbeddedEntries: Entry = {
  sys: {
    id: entityIds.ENTRY_WITH_EMBEDDED_ENTRIES,
    type: 'Entry',
    contentType: {
      sys: {
        id: 'bar',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    revision: 10,
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'cfexampleapi',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    locale: 'en-US',
  },
  fields: {
    referencedEntries: [
      {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: entityIds.ENTRY_WITH_EMBEDDED_ENTRY,
        },
      },
      {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: entityIds.ENTRY_WITH_ANOTHER_EMBEDDED_ENTRY,
        },
      },
    ],
  },
  metadata: {
    tags: [],
  },
};

export const entryWithAnotherEmbeddedEntry: Entry = {
  sys: {
    id: entityIds.ENTRY_WITH_ANOTHER_EMBEDDED_ENTRY,
    type: 'Entry',
    contentType: {
      sys: {
        id: 'bar',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    revision: 10,
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'cfexampleapi',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    locale: 'en-US',
  },
  fields: {
    referencedEntry: {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: entityIds.ENTRY2,
      },
    },
  },
  metadata: {
    tags: [],
  },
};

export const entryWithEmbeddedEntryInRichText: Entry = {
  sys: {
    id: entityIds.ENTRY_WITH_EMBEDDED_ENTRY_IN_RICH_TEXT,
    type: 'Entry',
    contentType: {
      sys: {
        id: 'bar',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    revision: 10,
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'cfexampleapi',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    locale: 'en-US',
  },
  fields: {
    body: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'embedded-entry-block',
          data: {
            target: {
              sys: {
                id: entityIds.ENTRY1,
                type: 'Link',
                linkType: 'Entry',
              },
            },
          },
          content: [],
        },
      ],
    },
  },
  metadata: {
    tags: [],
  },
};

export const entryWithEmbeddedAssetInRichText: Entry = {
  sys: {
    id: entityIds.ENTRY_WITH_EMBEDDED_ASSET_IN_RICH_TEXT,
    type: 'Entry',
    contentType: {
      sys: {
        id: 'bar',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    revision: 10,
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'cfexampleapi',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    locale: 'en-US',
  },
  fields: {
    body: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'embedded-asset-block',
          data: {
            target: {
              sys: {
                id: entityIds.ASSET1,
                type: 'Link',
                linkType: 'Asset',
              },
            },
          },
          content: [],
        },
      ],
    },
  },
  metadata: {
    tags: [],
  },
};

export const entryWithDeeplyEmbeddedEntitiesInRichText: Entry = {
  sys: {
    id: entityIds.ENTRY_WITH_DEEPLY_EMBEDDED_ENTITIES_IN_RICH_TEXT,
    type: 'Entry',
    contentType: {
      sys: {
        id: 'bar',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
    revision: 10,
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'cfexampleapi',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    locale: 'en-US',
  },
  fields: {
    body: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'unordered-list',
          data: {},
          content: [
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'embedded-asset-block',
                  data: {
                    target: {
                      sys: {
                        type: 'Link',
                        id: entityIds.ASSET1,
                        linkType: 'Asset',
                      },
                    },
                  },
                  content: [],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'embedded-entry-block',
                  data: {
                    target: {
                      sys: {
                        type: 'Link',
                        id: entityIds.ENTRY1,
                        linkType: 'Entry',
                      },
                    },
                  },
                  content: [],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'asset-hyperlink',
                  data: {
                    target: {
                      sys: {
                        id: entityIds.ASSET1,
                        type: 'Link',
                        linkType: 'Asset',
                      },
                    },
                  },
                  content: [],
                },
              ],
            },
            {
              nodeType: 'list-item',
              data: {},
              content: [
                {
                  nodeType: 'entry-hyperlink',
                  data: {
                    target: {
                      sys: {
                        id: entityIds.ENTRY2,
                        type: 'Link',
                        linkType: 'Entry',
                      },
                    },
                  },
                  content: [],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  metadata: {
    tags: [],
  },
};

export const assets: Asset[] = [
  {
    sys: {
      id: entityIds.ASSET1,
      type: 'Asset',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
      revision: 10,
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'cfexampleapi',
        },
      },
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      locale: 'en-US',
    },
    fields: {
      title: 'Asset 1',
      file: {
        url: 'https://test.com/test.jpg',
        fileName: 'example.jpg',
        contentType: '',
        details: {
          size: 3147977,
          image: {
            width: 1024,
            height: 1024,
          },
        },
      } as AssetFile,
    },
    metadata: {
      tags: [],
    },
  },
];

export const entities: Array<Entry | Asset> = [...entries, ...assets];
export const createEntry = (id: string, overrides?: PartialDeep<Entry>): Entry => {
  return merge(
    {
      sys: {
        id,
        type: 'Entry',
        contentType: {
          sys: {
            id: 'bar',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
        revision: 10,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'cfexampleapi',
          },
        },
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        locale: 'en-US',
      },
      fields: {},
      metadata: {
        tags: [],
      },
    },
    overrides,
  );
};

export const createAsset = (id: string, overrides?: PartialDeep<Asset>): Asset => {
  return merge(
    {
      sys: {
        id,
        type: 'Asset',
        createdAt: '2020-01-01T00:00:00.000Z',
        updatedAt: '2020-01-01T00:00:00.000Z',
        revision: 10,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'cfexampleapi',
          },
        },
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        locale: 'en-US',
      },
      fields: {},
      metadata: {
        tags: [],
      },
    },
    overrides,
  );
};
