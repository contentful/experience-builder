import { describe, it, expect } from 'vitest';
import { isExperienceEntry, isPatternEntry, isEntry, isAsset, isArrayOfLinks } from './typeguards';
import type { Entry } from 'contentful';

const validExperienceEntryFixture = {
  sys: {
    type: 'Entry',
  } as unknown as Entry['sys'],
  fields: {
    title: 'Test Title',
    slug: 'test-slug',
    componentTree: {
      breakpoints: [],
      children: [],
      schemaVersion: '2023-09-28',
    },
  },
  metadata: {
    tags: [],
  },
} as Entry;

describe('typeguards', () => {
  describe('isExperienceEntry', () => {
    const validExperienceEntry = structuredClone(validExperienceEntryFixture);
    it('should return true for valid experience entry', () => {
      expect(isExperienceEntry(validExperienceEntry)).toBe(true);
    });

    [
      function removingType(e: Entry): Entry {
        // @ts-expect-error - removing type to make it invalid
        delete e.sys.type;
        return e;
      },
      function removingTitle(e: Entry): Entry {
        delete e.fields.title;
        return e;
      },
      function removingSlug(e: Entry): Entry {
        delete e.fields.slug;
        return e;
      },
      function removingComponentTree(e: Entry): Entry {
        delete e.fields.componentTree;
        return e;
      },
      function removingBreakpoints(e: Entry): Entry {
        // @ts-expect-error - removing breakpoints to make it invalid
        delete e.fields.componentTree.breakpoints;
        return e;
      },
      function removingChildren(e: Entry): Entry {
        // @ts-expect-error - removing children to make it invalid
        delete e.fields.componentTree.children;
        return e;
      },
      function removingSchemaVersion(e: Entry): Entry {
        // @ts-expect-error - removing schemaVersion to make it invalid
        delete e.fields.componentTree.schemaVersion;
        return e;
      },
    ].forEach((fnMutateValidEntryIntoInvalid) => {
      const humanFnName = fnMutateValidEntryIntoInvalid.name.replace(/([a-z])([A-Z])/g, '$1 $2');
      it(`should return false when valid entry turned invalid by ${humanFnName}`, () => {
        const invalidEntry = fnMutateValidEntryIntoInvalid(structuredClone(validExperienceEntry));
        expect(isExperienceEntry(invalidEntry)).toBe(false);
      });
    });

    describe('isPatternEntry', () => {
      it('should return true for valid pattern entry', () => {
        const validPatternEntry = Object.assign({}, validExperienceEntry, {
          fields: {
            ...validExperienceEntry.fields,
            componentSettings: {},
          },
        });

        expect(isPatternEntry(validPatternEntry)).toBe(true);
      });

      it('should return false for experience entry without componentSettings', () => {
        expect(isPatternEntry(validExperienceEntry)).toBe(false);
      });
    });
  });
});

describe('isEntry', () => {
  it('should return true for valid entry', () => {
    const validEntry = {
      sys: {
        type: 'Entry',
      },
    };
    expect(isEntry(validEntry)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isEntry(null)).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isEntry('string')).toBe(false);
    expect(isEntry(123)).toBe(false);
  });

  it('should return false when sys is missing', () => {
    expect(isEntry({})).toBe(false);
  });

  it('should return false when type is not Entry', () => {
    expect(isEntry({ sys: { type: 'Asset' } })).toBe(false);
  });
});

describe('isAsset', () => {
  it('should return true for valid asset', () => {
    const validAsset = {
      sys: {
        type: 'Asset',
      },
    };
    expect(isAsset(validAsset)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isAsset(null)).toBe(false);
  });

  it('should return false for non-objects', () => {
    expect(isAsset('string')).toBe(false);
    expect(isAsset(123)).toBe(false);
  });

  it('should return false when sys is missing', () => {
    expect(isAsset({})).toBe(false);
  });

  it('should return false when type is not Asset', () => {
    expect(isAsset({ sys: { type: 'Entry' } })).toBe(false);
  });
});

describe('isArrayOfLinks', () => {
  // By convention, we consider empty arrays as valid "arrays of links"
  it('should return true for empty array', () => {
    expect(isArrayOfLinks([])).toBe(true);
  });

  it('should return true for array of valid links', () => {
    const validLinks = [
      { sys: { type: 'Link', linkType: 'Entry', id: 'e123' } },
      { sys: { type: 'Link', linkType: 'Asset', id: 'a123' } },
    ];
    expect(isArrayOfLinks(validLinks)).toBe(true);
  });

  it('should return false for non-arrays', () => {
    expect(isArrayOfLinks(null)).toBe(false);
    expect(isArrayOfLinks({})).toBe(false);
    expect(isArrayOfLinks('string')).toBe(false);
  });

  it('should return false if any item is not a valid link', () => {
    const invalidLinks = [
      { sys: { type: 'Link', linkType: 'Entry', id: 'e123' } },
      { sys: { type: 'NotLink' } },
    ];
    expect(isArrayOfLinks(invalidLinks)).toBe(false);
  });

  it('should return false if any item is undefined', () => {
    const invalidLinks = [{ sys: { type: 'Link', linkType: 'Entry', id: 'e123' } }, undefined];
    expect(isArrayOfLinks(invalidLinks)).toBe(false);
  });
});
