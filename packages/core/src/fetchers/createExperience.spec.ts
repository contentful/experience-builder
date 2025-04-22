/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Entry, EntrySkeletonType } from 'contentful';
import { experienceEntry } from '../test/__fixtures__/experience';
import { assets, entries } from '../test/__fixtures__/entities';
import { createExperience } from './createExperience';
import { describe, it, expect } from 'vitest';

const unlocalizeEntity = <T extends EntrySkeletonType = EntrySkeletonType>(
  entity: Entry<T>,
  locales: string[],
): Entry<T, 'WITH_ALL_LOCALES'> => {
  const { fields, sys, ...rest } = entity;
  return {
    ...rest,
    sys: {
      ...sys,
      locale: undefined,
    },
    fields: Object.keys(fields).reduce((acc, key) => {
      acc[key] = locales.reduce((acc, locale) => {
        acc[locale] = fields[key];
        return acc;
      }, {} as any);
      return acc;
    }, {} as any),
  };
};

describe('createExperience', () => {
  it('throws an error if given entry is not an experience entry', () => {
    try {
      createExperience({
        experienceEntry: entries[0],
        referencedAssets: [],
        referencedEntries: [],
        locale: 'en-US',
      });
      throw new Error('Should not reach this point');
    } catch (e) {
      expect((e as Error).message).toEqual('Provided entry is not an experience entry');
    }
  });

  it('throws an error if any provided entity is not localized', () => {
    const experienceEntryUnlocalized = unlocalizeEntity(experienceEntry as any, ['en-US', 'de']);
    const entryUnlocalized = unlocalizeEntity(entries[0], ['en-US', 'de']);

    expect(() => {
      createExperience({
        experienceEntry: experienceEntryUnlocalized as unknown as Entry,
        referencedEntries: [entryUnlocalized],
        referencedAssets: [],
        locale: 'en-US',
      });
    }).toThrowError(
      'Some of the provided content is not localized. Please localize every entity before passing it to this function.',
    );
  });

  it('should return the instance of an entity store and mode', () => {
    const experience = createExperience({
      experienceEntry: experienceEntry as unknown as Entry,
      referencedEntries: entries,
      referencedAssets: assets,
      locale: 'en-US',
    });

    expect(experience.entityStore).toBeDefined();
    expect(experience.entityStore?.experienceEntryFields).toEqual(experienceEntry.fields);
    expect(experience.entityStore?.locale).toBe('en-US');
  });
});
