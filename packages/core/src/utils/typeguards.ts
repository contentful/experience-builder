import type { ExperienceEntry } from '@/types';
import type { Asset, Entry, UnresolvedLink } from 'contentful';
import { isLink } from './isLink';

export const isExperienceEntry = (entry: ExperienceEntry | Entry): entry is ExperienceEntry => {
  return (
    entry?.sys?.type === 'Entry' &&
    !!entry.fields?.title &&
    !!entry.fields?.slug &&
    !!entry.fields?.componentTree &&
    Array.isArray((entry as ExperienceEntry).fields.componentTree.breakpoints) &&
    Array.isArray((entry as ExperienceEntry).fields.componentTree.children) &&
    typeof (entry as ExperienceEntry).fields.componentTree.schemaVersion === 'string'
  );
};

export const isPatternEntry = (entry: Entry | ExperienceEntry): entry is ExperienceEntry => {
  return isExperienceEntry(entry) && !!entry.fields?.componentSettings; // signals that this is pattern (not experience) entry
};

export const isEntry = (value: unknown): value is Entry => {
  return (
    null !== value &&
    typeof value === 'object' &&
    'sys' in value &&
    (value as Entry).sys?.type === 'Entry'
  );
};

export const isAsset = (value: unknown): value is Asset => {
  return (
    null !== value &&
    typeof value === 'object' &&
    'sys' in value &&
    (value as Asset).sys?.type === 'Asset'
  );
};

/**
 * Checks if the values is an array of links.
 * Note: we use convention where empty arrays are considered valid "arrays of links"
 * as they don't contractict the type definition.
 */
export const isArrayOfLinks = (
  value: unknown,
): value is Array<UnresolvedLink<'Asset'> | UnresolvedLink<'Entry'>> => {
  return Array.isArray(value) && value.every((item) => isLink(item));
};
