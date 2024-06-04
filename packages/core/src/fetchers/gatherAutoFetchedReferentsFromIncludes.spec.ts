import { describe, it, expect } from 'vitest';
import { gatherAutoFetchedReferentsFromIncludes } from './gatherAutoFetchedReferentsFromIncludes';
import { DeepReference } from '@/deep-binding';
import { assets, createEntry } from '@/test/__fixtures__/entities';
import { ExperienceDataSource } from '@contentful/experiences-validators';

const collection = {
  items: [
    createEntry('entry1', {
      fields: {
        title: 'Entry 1',
        logo: { sys: { id: 'asset1', linkType: 'Asset', type: 'Link' } },
      },
    }),
    createEntry('entry2', {
      fields: {
        title: 'Entry 2',
        reference1: { sys: { id: 'entry3', linkType: 'Entry', type: 'Link' } },
        reference2: { sys: { id: 'entry4', linkType: 'Entry', type: 'Link' } },
      },
    }),
  ],
  includes: {
    Entry: [
      createEntry('entry3', {
        fields: {
          title: 'Entry 3',
        },
      }),
      createEntry('entry4', {
        fields: {
          title: 'Entry 4',
        },
      }),
    ],
    Asset: assets,
  },
};

const dataSource: ExperienceDataSource = {
  uuid1: { sys: { id: 'entry1', linkType: 'Entry', type: 'Link' } },
  uuid2: { sys: { id: 'entry2', linkType: 'Entry', type: 'Link' } },
};

describe('gatherAutoFetchedReferentsFromIncludes', () => {
  it('gathers referents from includes', () => {
    const deepReferences = [
      new DeepReference({
        path: '/uuid1/fields/logo/~locale/fields/file/~locale',
        dataSource,
      }),
      new DeepReference({
        path: '/uuid2/fields/reference1/~locale/fields/title/~locale',
        dataSource,
      }),
    ];

    const result = gatherAutoFetchedReferentsFromIncludes(deepReferences, collection);
    expect(result).toEqual({
      autoFetchedReferentAssets: [collection.includes.Asset[0]],
      autoFetchedReferentEntries: [collection.includes.Entry[0]],
    });
  });
  it('resolves nothing if field is not a reference field', () => {
    const deepReferences = [
      new DeepReference({
        path: '/uuid1/fields/title/~locale/fields/file/~locale',
        dataSource,
      }),
    ];

    const result = gatherAutoFetchedReferentsFromIncludes(deepReferences, collection);
    expect(result).toEqual({
      autoFetchedReferentAssets: [],
      autoFetchedReferentEntries: [],
    });
  });

  it('resolves nothing if field does not exist in the target entity', () => {
    const deepReferences = [
      new DeepReference({
        path: '/uuid2/fields/nonexisting/~locale/fields/file/~locale',
        dataSource,
      }),
    ];

    const result = gatherAutoFetchedReferentsFromIncludes(deepReferences, collection);
    expect(result).toEqual({
      autoFetchedReferentAssets: [],
      autoFetchedReferentEntries: [],
    });
  });

  it('throws an error if head entity not in collection', () => {
    const deepReferences = [
      new DeepReference({
        path: '/uuid1/fields/logo/~locale/fields/file/~locale',
        dataSource,
      }),
    ];

    const newCollection = { items: [], includes: { ...collection.includes } };
    expect(() =>
      gatherAutoFetchedReferentsFromIncludes(deepReferences, newCollection),
    ).toThrowError(
      `LogicError: When resolving deep-references could not find headEntry (id=entry1)`,
    );
  });
});
