import { ManagementEntity } from '@contentful/experiences-core/types';
import { Asset, AssetFile, Entry } from 'contentful';

export const entityIds = {
  ENTRY1: 'entry1',
  ENTRY2: 'entry2',
  ASSET1: 'asset1',
};

// Please be mindful when testing preview logic which expects delivery entities while these
// fixtures can be used as management entities as well (additional version prop).
export const entries: (Entry & ManagementEntity)[] = [
  {
    sys: {
      id: entityIds.ENTRY1,
      version: 10,
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
export const assets: (Asset & ManagementEntity)[] = [
  {
    sys: {
      id: entityIds.ASSET1,
      type: 'Asset',
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
      version: 10,
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
      } as AssetFile,
    },
    metadata: {
      tags: [],
    },
  },
];

export const entities: Array<ManagementEntity> = [...entries, ...assets];
