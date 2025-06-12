import { describe, it, expect } from 'vitest';
import { extractLeafLinksReferencedFromExperience } from './experienceSchema';
import type { Experience, Link } from '@/types';
import type { Entry, Asset } from 'contentful';

describe('extractLeafLinksReferencedFromExperience', () => {
  it('should throw error if entityStore is not present', () => {
    const experience = {
      entityStore: undefined, // Simulating missing entityStore
    } as Experience;

    expect(() => extractLeafLinksReferencedFromExperience(experience)).toThrow(
      'Parameter `experience` should have valid `experience.entityStore` object',
    );
  });

  it('should extract leaf links from experience', () => {
    const linkToAsset: Link<'Asset'> = {
      sys: {
        type: 'Link',
        linkType: 'Asset',
        id: 'asset1',
      },
    };

    const linkToEntry: Link<'Entry'> = {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: 'entry1',
      },
    };

    const mockEntry: Entry = {
      sys: { id: 'parentEntry', type: 'Entry' } as unknown as Entry['sys'],
      fields: {
        refEntry: linkToEntry,
        refAsset: linkToAsset,
      },
      metadata: {
        tags: [],
      },
    };

    const experience: Experience = {
      entityStore: {
        entities: [mockEntry],
        getEntityFromLink: () => undefined,
      } as unknown as Experience['entityStore'],
    };

    const result = extractLeafLinksReferencedFromExperience(experience);

    expect(result.assetLinks).toEqual([linkToAsset]);
    expect(result.entryLinks).toEqual([linkToEntry]);
    expect(result.assetIds).toEqual(['asset1']);
    expect(result.entryIds).toEqual(['entry1']);
  });

  it('should deduplicate repeated links', () => {
    const linkToAsset: Link<'Asset'> = {
      sys: {
        type: 'Link',
        linkType: 'Asset',
        id: 'asset1',
      },
    };

    const mockEntry1: Entry = {
      sys: { id: 'entry1', type: 'Entry' } as unknown as Entry['sys'],
      fields: { asset: linkToAsset },
      metadata: {
        tags: [],
      },
    };

    const mockEntry2: Entry = {
      sys: { id: 'entry2', type: 'Entry' } as unknown as Entry['sys'],
      fields: { asset: linkToAsset },
      metadata: {
        tags: [],
      },
    };

    const experience: Experience = {
      entityStore: {
        entities: [mockEntry1, mockEntry2],
        getEntityFromLink: () => null,
      },
    } as unknown as Experience;

    const result = extractLeafLinksReferencedFromExperience(experience);

    expect(result.assetLinks).toHaveLength(1);
    expect(result.assetLinks[0]).toEqual(linkToAsset);
  });
});
