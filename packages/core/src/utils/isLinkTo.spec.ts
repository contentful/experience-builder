import { describe, it, expect } from 'vitest';
import { isLinkToAsset } from './isLinkToAsset';
import { isLinkToEntry } from './isLinkToEntry';

const functionsToTest = {
  isLinkToEntry,
  isLinkToAsset,
};

['isLinkToEntry', 'isLinkToAsset'].forEach((isLinkToFnName) => {
  describe(`${isLinkToFnName}() degenerate cases`, () => {
    const fnIsLinkTo = functionsToTest[isLinkToFnName];
    it('should return false for undefined', () => {
      expect(fnIsLinkTo(undefined)).toBe(false);
    });

    it('should return false for null', () => {
      expect(fnIsLinkTo(null)).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(fnIsLinkTo('string')).toBe(false);
      expect(fnIsLinkTo(123)).toBe(false);
      expect(fnIsLinkTo(true)).toBe(false);
    });

    it('should return false for objects without sys property', () => {
      expect(fnIsLinkTo({})).toBe(false);
    });

    it('should return false for objects with sys but without linkType', () => {
      expect(fnIsLinkTo({ sys: {} })).toBe(false);
    });
  });
});

describe(`isLinkToAsset() valid cases`, () => {
  it('should return false for objects with sys.linkType not equal to "Asset"', () => {
    expect(isLinkToAsset({ sys: { linkType: 'Entry' } })).toBe(false);
  });

  it('should return false for objects with sys.type not equal to "Link"', () => {
    expect(isLinkToAsset({ sys: { linkType: 'Asset', type: 'NotLink' } })).toBe(false);
  });

  it('should return false for objects with sys.id not a string or empty', () => {
    expect(isLinkToAsset({ sys: { linkType: 'Asset', type: 'Link', id: 123 } })).toBe(false);
    expect(isLinkToAsset({ sys: { linkType: 'Asset', type: 'Link', id: '' } })).toBe(false);
  });

  it('should return true for valid Asset link object', () => {
    const validAssetLink = {
      sys: {
        linkType: 'Asset',
        type: 'Link',
        id: 'validAssetId',
      },
    };
    expect(isLinkToAsset(validAssetLink)).toBe(true);
  });
});

describe(`isLinkToEntry() valid cases`, () => {
  it('should return false for objects with sys.linkType not equal to "Entry"', () => {
    expect(isLinkToEntry({ sys: { linkType: 'Asset' } })).toBe(false);
  });

  it('should return false for objects with sys.type not equal to "Link"', () => {
    expect(isLinkToEntry({ sys: { linkType: 'Entry', type: 'NotLink' } })).toBe(false);
  });

  it('should return false for objects with sys.id not a string or empty', () => {
    expect(isLinkToEntry({ sys: { linkType: 'Entry', type: 'Link', id: 123 } })).toBe(false);
    expect(isLinkToEntry({ sys: { linkType: 'Entry', type: 'Link', id: '' } })).toBe(false);
  });

  it('should return true for valid Entry link object', () => {
    const validEntryLink = {
      sys: {
        linkType: 'Entry',
        type: 'Link',
        id: 'validEntryId',
      },
    };
    expect(isLinkToEntry(validEntryLink)).toBe(true);
  });
});
