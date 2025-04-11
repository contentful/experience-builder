import { describe, it, expect } from 'vitest';
import { localizeEntity } from './localizeEntity';
import { Entry } from 'contentful';

// filepath: /Users/thomas.kellermeier/work/sparks/experience-builder/packages/core/src/utils/localizeEntity.test.ts

describe('localizeEntity', () => {
  const locale = 'en-US';

  it('throws an error if an invalid entity is provided', () => {
    expect(() => localizeEntity(null as unknown as Entry, locale)).toThrow(
      'Invalid entity provided',
    );
    expect(() => localizeEntity({} as Entry, locale)).toThrow('Invalid entity provided');
  });

  it('returns the entity as-is if it is already localized', () => {
    const localizedEntity = {
      sys: { id: '1', locale, type: 'Entry' },
      fields: { title: 'Hello' },
    } as unknown as Entry;
    const result = localizeEntity(localizedEntity, locale);
    expect(result).toBe(localizedEntity);
  });

  it('localizes an entity with multiple locales', () => {
    const multiLocaleEntity = {
      sys: { id: '1', type: 'Entry' },
      fields: { title: { 'en-US': 'Hello', 'fr-FR': 'Bonjour' } },
    } as unknown as Entry;
    const result = localizeEntity(multiLocaleEntity, locale);
    expect(result.sys.locale).toBe(locale);
    expect(result.fields.title).toBe('Hello');
  });

  it('handles missing fields for the requested locale', () => {
    const multiLocaleEntity = {
      sys: { id: '1', type: 'Entry' },
      fields: { title: { 'fr-FR': 'Bonjour' } },
    } as unknown as Entry;
    const result = localizeEntity(multiLocaleEntity, locale);
    expect(result.sys.locale).toBe(locale);
    expect(result.fields.title).toBeUndefined();
  });
});
