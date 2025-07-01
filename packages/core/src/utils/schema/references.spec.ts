import { describe, expect, it } from 'vitest';
import {
  referencesOf,
  extractReferencesFromEntries,
  extractReferencesFromEntriesAsIds,
} from './references';
import type { Entry } from 'contentful';

describe('referencesOf', () => {
  it('should extract single reference from entry', () => {
    const entry = {
      sys: { id: '1' },
      fields: {
        singleRef: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'ref1',
          },
        },
      },
    } as unknown as unknown as Entry;

    const refs = referencesOf(entry);
    expect(refs).toHaveLength(1);
    expect(refs[0].sys.id).toBe('ref1');
  });

  it('should extract multiple references from array field', () => {
    const entry = {
      sys: { id: '1' },
      fields: {
        arrayRef: [
          {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'ref1',
            },
          },
          {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'asset1',
            },
          },
        ],
      },
    } as unknown as Entry;

    const refs = referencesOf(entry);
    expect(refs).toHaveLength(2);
    expect(refs.map((r) => r.sys.id)).toEqual(['ref1', 'asset1']);
  });

  it('should handle undefined field values', () => {
    const entry = {
      sys: { id: '1' },
      fields: {
        undefinedField: undefined,
      },
    } as unknown as Entry;

    const refs = referencesOf(entry);
    expect(refs).toHaveLength(0);
  });

  it('should filter references based on provided function', () => {
    const entry = {
      sys: { id: '1' },
      fields: {
        include: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'ref1',
          },
        },
        exclude: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'ref2',
          },
        },
      },
    } as unknown as Entry;

    const refs = referencesOf(entry, (fieldName) => fieldName === 'include');
    expect(refs).toHaveLength(1);
    expect(refs[0].sys.id).toBe('ref1');
  });

  it('should deduplicate repeated references', () => {
    const entry = {
      sys: { id: '1' },
      fields: {
        field1: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'repeat',
          },
        },
        field2: {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: 'repeat',
          },
        },
      },
    } as unknown as Entry;

    const refs = referencesOf(entry);
    expect(refs).toHaveLength(1);
    expect(refs[0].sys.id).toBe('repeat');
  });
});

describe('extractReferencesFromEntries', () => {
  it('should handle empty entries array', () => {
    const [entries, assets, all] = extractReferencesFromEntries([]);

    expect(entries).toHaveLength(0);
    expect(assets).toHaveLength(0);
    expect(all).toHaveLength(0);
  });

  it('should extract references from multiple entries', () => {
    const entries = [
      {
        sys: { id: '1' },
        fields: {
          ref: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'entry1',
            },
          },
        },
      },
      {
        sys: { id: '2' },
        fields: {
          asset: {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'asset1',
            },
          },
        },
      },
    ] as unknown as Entry[];

    const [entryLinks, assetLinks, allLinks] = extractReferencesFromEntries(entries);

    expect(entryLinks).toHaveLength(1);
    expect(entryLinks[0].sys.id).toBe('entry1');

    expect(assetLinks).toHaveLength(1);
    expect(assetLinks[0].sys.id).toBe('asset1');

    expect(allLinks).toHaveLength(2);
    expect(allLinks.map((link) => link.sys.id)).toEqual(['entry1', 'asset1']);
  });

  it('should deduplicate repeated references across entries', () => {
    const entries = [
      {
        sys: { id: '1' },
        fields: {
          ref: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'repeat',
            },
          },
        },
      },
      {
        sys: { id: '2' },
        fields: {
          ref: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'repeat',
            },
          },
        },
      },
    ] as unknown as Entry[];

    const [entryLinks, assetLinks, allLinks] = extractReferencesFromEntries(entries);

    expect(entryLinks).toHaveLength(1);
    expect(assetLinks).toHaveLength(0); // No assets in this case
    expect(allLinks).toHaveLength(1);
    expect(entryLinks[0].sys.id).toBe('repeat');
  });

  it('should handle multiple entries with multiple overlapping references', () => {
    const entries = [
      {
        sys: { id: '1' },
        fields: {
          ref1: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'entry1',
            },
          },
          ref2: {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'asset1',
            },
          },
          arrayRef: [
            {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: 'entry2',
              },
            },
          ],
        },
      },
      {
        sys: { id: '2' },
        fields: {
          ref1: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'entry1', // Repeated reference
            },
          },
          asset: {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'asset2',
            },
          },
          arrayRef: [
            {
              sys: {
                type: 'Link',
                linkType: 'Entry',
                id: 'entry3',
              },
            },
          ],
        },
      },
    ] as unknown as Entry[];

    const [entryLinks, assetLinks, allLinks] = extractReferencesFromEntries(entries);

    expect(entryLinks).toHaveLength(3);
    expect(entryLinks.map((link) => link.sys.id).sort()).toEqual(['entry1', 'entry2', 'entry3']);

    expect(assetLinks).toHaveLength(2);
    expect(assetLinks.map((link) => link.sys.id).sort()).toEqual(['asset1', 'asset2']);

    expect(allLinks).toHaveLength(5);
    expect(allLinks.map((link) => link.sys.id).sort()).toEqual([
      'asset1',
      'asset2',
      'entry1',
      'entry2',
      'entry3',
    ]);
  });
});

describe('extractReferencesFromEntriesAsIds', () => {
  it('should convert references to ids', () => {
    const entries = [
      {
        sys: { id: '1' },
        fields: {
          ref: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: 'entry1',
            },
          },
          asset: {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: 'asset1',
            },
          },
        },
      },
    ] as unknown as Entry[];

    const [entryIds, assetIds, allIds] = extractReferencesFromEntriesAsIds(entries);

    expect(entryIds).toEqual(['entry1']);
    expect(assetIds).toEqual(['asset1']);
    expect(allIds).toEqual(['entry1', 'asset1']);
  });

  it('should handle empty array', () => {
    const [entryIds, assetIds, allIds] = extractReferencesFromEntriesAsIds([]);

    expect(entryIds).toEqual([]);
    expect(assetIds).toEqual([]);
    expect(allIds).toEqual([]);
  });
});
