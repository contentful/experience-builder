import { merge } from 'lodash-es';
import type { PartialDeep } from 'type-fest';
import type { Asset } from 'contentful';

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
        contentSourceMaps: {},
      },
      fields: {},
      metadata: {
        tags: [],
      },
    },
    overrides as Asset, // otherwise PartialDeep<Asset> is not compatible with Asset
  );
};
