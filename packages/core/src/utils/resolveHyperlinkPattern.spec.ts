import { Entry } from 'contentful';

import { describe, it, expect } from 'vitest';
import { resolveHyperlinkPattern } from '@/utils/resolveHyperlinkPattern';

describe('resolveHyperlinkPattern function', () => {
  it('should return null if entry or locale is null', () => {
    const pattern = 'examplePattern';
    const entry = null;
    const locale = null;
    const result = resolveHyperlinkPattern(pattern, entry, locale);
    expect(result).toBe(null);
  });

  it('should build template with provided entry and locale', () => {
    const pattern = '/{entry.sys.id}/{locale}';
    const entry: Entry = { sys: { id: 'exampleId' } } as Entry;
    const locale = 'en-US';
    const result = resolveHyperlinkPattern(pattern, entry, locale);
    expect(result).toBe('/exampleId/en-US');
  });

  it('should build template with field value', () => {
    const pattern = '/{entry.sys.id}/{entry.fields.slug}/{locale}';
    const entry: Entry = {
      sys: { id: 'exampleId' },
      fields: {
        title: {
          'en-US': 'My Title',
        },
        slug: {
          'en-US': 'slug-slug',
        },
      },
    } as unknown as Entry;
    const locale = 'en-US';
    const result = resolveHyperlinkPattern(pattern, entry, locale);
    expect(result).toBe('/exampleId/slug-slug/en-US');
  });
  it('should build template with external url and provided entry and locale', () => {
    const pattern = 'http://example.com/{entry.sys.id}/{locale}';
    const entry: Entry = { sys: { id: 'exampleId' } } as Entry;
    const locale = 'en-US';
    const result = resolveHyperlinkPattern(pattern, entry, locale);
    expect(result).toBe('http://example.com/exampleId/en-US');
  });
  it('should build template with fallback values when value not there ', () => {
    const pattern = '/{entry.fields.unkown}/{locale}';
    const entry: Entry = { sys: { id: 'exampleId' } } as Entry;
    const locale = 'en-US';
    const result = resolveHyperlinkPattern(pattern, entry, locale);
    expect(result).toBe('/entry.fields.unkown_NOT_FOUND/en-US');
  });
});
