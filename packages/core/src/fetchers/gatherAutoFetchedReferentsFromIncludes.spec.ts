import { describe, it, expect } from 'vitest';
import { gatherAutoFetchedReferentsFromIncludes } from './gatherAutoFetchedReferentsFromIncludes';
import { entriesCollection } from '@/test/__fixtures__/entriesCollection';
import { experienceEntry } from '@/test/__fixtures__/experience';

describe.skip('gatherAutoFetchedReferentsFromIncludes', () => {
  it('works', () => {
    const deepReferences = [
      {
        entityId: 'entryId',
        headEntityId: 'headEntityId',
        field: 'field',
        originalPath: 'originalPath',
      },
      {
        entityId: 'entryId',
        headEntityId: 'headEntityId',
        field: 'field',
        originalPath: 'originalPath',
      },
    ];

    const result = gatherAutoFetchedReferentsFromIncludes(deepReferences, entriesCollection);
    expect(result).toEqual({
      autoFetchedReferentAssets: [],
      autoFetchedReferentEntries: [
        {
          sys: {
            id: 'entryId',
          },
        },
      ],
    });
  });
});
