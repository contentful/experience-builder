import { ExperienceEntry } from '@/types';
import { isExperienceEntry } from '@/utils';

/**
 * Attaches the default prebinding value (if any) to the experience entry's dataSource.
 *
 * This ensures that any default values defined in pattern property definitions are included
 * in the dataSource, so that linked entities can be fetched and resolved correctly.
 * Without this, defaults may be omitted, resulting in unresolved references during binding.
 */
export const attachPrebindingDefaultValueAsDataSource = (
  experienceEntry: ExperienceEntry,
): void => {
  if (!isExperienceEntry(experienceEntry)) {
    throw new Error(
      'Failed to attach default prebinding value to data source. Provided "experienceEntry" does not match experience entry schema',
    );
  }

  const patternDefs = experienceEntry.fields.componentSettings?.patternPropertyDefinitions ?? {};
  const defaultPrebinding = Object.values(patternDefs).find(
    (def) => def.defaultValue,
  )?.defaultValue;

  const [value] = Object.values(defaultPrebinding ?? {});
  const id = value?.sys?.id;

  if (!id) return;

  experienceEntry.fields.dataSource = {
    ...experienceEntry.fields.dataSource,
    [id]: {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id,
      },
    },
  };
};
