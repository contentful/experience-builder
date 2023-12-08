import type { Entry } from 'contentful';
import type { DeprecatedExperience, Experience, ExperienceEntry, Link } from './types';

// @ts-expect-error type incompatibility
export const isExperienceEntry = (entry: Entry): entry is ExperienceEntry => {
  return (
    entry?.sys?.type === 'Entry' &&
    !!entry.fields?.title &&
    !!entry.fields?.slug &&
    !!entry.fields?.componentTree &&
    // @ts-expect-error type incompatibility due to conditional types in Entry
    Array.isArray(entry.fields.componentTree.breakpoints) &&
    // @ts-expect-error type incompatibility due to conditional types in Entry
    Array.isArray(entry.fields.componentTree.children) &&
    // @ts-expect-error type incompatibility due to conditional types in Entry
    typeof entry.fields.componentTree.schemaVersion === 'string'
  );
};

export const isDeprecatedExperience = (
  experience: Experience | DeprecatedExperience
): experience is DeprecatedExperience => {
  return (
    experience &&
    {}.hasOwnProperty.call(experience, 'client') &&
    {}.hasOwnProperty.call(experience, 'experienceTypeId') &&
    {}.hasOwnProperty.call(experience, 'mode')
  );
};

export const isLinkToAsset = (variable: any): variable is Link<'Asset'> => {
  if (!variable) return false;
  if (typeof variable !== 'object') return false;

  return (
    variable.sys?.linkType === 'Asset' &&
    typeof variable.sys?.id === 'string' &&
    !!variable.sys?.id &&
    variable.sys?.type === 'Link'
  );
};
