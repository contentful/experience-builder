import { isLinkToAsset } from './isLinkToAsset';
import { describe, it, expect } from 'vitest';
describe('isLinkToAsset', () => {
  it('should return false for undefined', () => {
    expect(isLinkToAsset(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    expect(isLinkToAsset(null)).toBe(false);
  });

  it('should return false for non-object types', () => {
    expect(isLinkToAsset('string')).toBe(false);
    expect(isLinkToAsset(123)).toBe(false);
    expect(isLinkToAsset(true)).toBe(false);
  });

  it('should return false for objects without sys property', () => {
    expect(isLinkToAsset({})).toBe(false);
  });

  it('should return false for objects with sys but without linkType', () => {
    expect(isLinkToAsset({ sys: {} })).toBe(false);
  });

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
