import { describe, it, expect } from 'vitest';
import { isLink } from './isLink';

describe('isLink', () => {
  it('should return true for valid UnresolvedLink', () => {
    const validLink = {
      sys: {
        id: '123',
        type: 'Link',
        linkType: 'Entry',
      },
    };
    expect(isLink(validLink)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isLink(null)).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isLink('string')).toBe(false);
    expect(isLink(123)).toBe(false);
    expect(isLink(true)).toBe(false);
  });

  it('should return false if sys.id is missing', () => {
    const invalidLink = {
      sys: {
        type: 'Link',
        linkType: 'Entry',
      },
    };
    expect(isLink(invalidLink)).toBe(false);
  });

  it('should return false if sys.type is not "Link"', () => {
    const invalidLink = {
      sys: {
        id: '123',
        type: 'NotLink',
        linkType: 'Entry',
      },
    };
    expect(isLink(invalidLink)).toBe(false);
  });

  it('should return false if sys.linkType is missing', () => {
    const invalidLink = {
      sys: {
        id: '123',
        type: 'Link',
      },
    };
    expect(isLink(invalidLink)).toBe(false);
  });
});
