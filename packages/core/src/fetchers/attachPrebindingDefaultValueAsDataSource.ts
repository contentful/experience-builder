import { ExperienceEntry } from '@/types';
import { checkIsAssemblyEntry } from '@/utils';
import { Entry } from 'contentful';

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
  if (!checkIsAssemblyEntry(experienceEntry as Entry)) {
    // Only supported for pattern entries since experience entries don't define pattern properties.
    return;
  }

  const patternDefs = experienceEntry.fields.componentSettings?.parameterDefinitions ?? {};
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
