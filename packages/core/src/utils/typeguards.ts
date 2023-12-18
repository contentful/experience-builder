import type { DeprecatedExperience, Experience, ExperienceEntry } from '@/types';
import { Entry } from 'contentful';

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
