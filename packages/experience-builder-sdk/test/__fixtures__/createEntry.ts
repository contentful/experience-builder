import { merge } from 'lodash-es';
import type { PartialDeep } from 'type-fest';
import type { Entry } from 'contentful';

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
    overrides as Entry, // Otherwise PartialDeep does not match Entry type
  );
};
