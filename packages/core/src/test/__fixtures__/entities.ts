import { Asset, AssetFile, Entry } from 'contentful';
import merge from 'lodash.merge';
import type { PartialDeep } from 'type-fest';

export const entityIds = {
  ENTRY1: 'entry1',
  ENTRY2: 'entry2',
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
