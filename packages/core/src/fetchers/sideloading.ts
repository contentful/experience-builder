import type { Entry } from 'contentful';
import type { ExperienceEntry, ExperienceComponentSettings } from '@/types';
import type { PatternPropertyDefinition } from '@contentful/experiences-validators';
import { checkIsAssemblyEntry, isLink } from '@/utils';
import { SIDELOADED_PREFIX } from '@/constants';

type PatternEntry = ExperienceEntry; // alias for clarity
type PatternPropertyDefinitions = ExperienceComponentSettings['patternPropertyDefinitions'];

/**
 * Attaches the default prebinding value (if any) to the experience entry's dataSource.
 *
 * This ensures that any default values defined in pattern property definitions are included
 * in the dataSource, so that linked entities can be fetched and resolved correctly.
 * Without this, defaults may be omitted, resulting in unresolved references during binding.
 *
 * @returns The number of sideloaded default values, or false if the entry is not a pattern.
 */
export const sideloadPrebindingDefaultValues = (patternEntry: ExperienceEntry): false | number => {
  let sideloadedCount = 0;

  const addDefaultValueToDataSource = (ppdID: string, ppd: PatternPropertyDefinition) => {
    if (!ppd.defaultValue) {
      // prebinding preset doesn't have default value, which is perfectly fine
      return;
    }
    const [[, defaultEntryLink]] = Object.entries(ppd.defaultValue);

    if (!isLink(defaultEntryLink)) {
      // default value is not a link, maybe due to a bug
      return;
    }

    const defaultEntryId = defaultEntryLink.sys.id;

    // Throw in the link to the default-entry into the dataSource, this way
    // we rely on the mechanism of fetchReferencedEntities() to "sideload" them.
    // Keep in mind that dataSource will be available as EntityStore.dataSource
    // and now will contain also key for `sideloaded_uuid` entry.
    // When "sideloading" entries into the entityStore, we must ensure that
    // there's corresponding entry in the dataSource, because all bound variables
    // are resolved, via path that is indirectly referencing the dataSource,
    // eg. { type: 'BoundValue', path: '/sideloaded_uuid/fields/title' }
    patternEntry.fields.dataSource = {
      ...patternEntry.fields.dataSource,
      [`${SIDELOADED_PREFIX}${defaultEntryId}`]: {
        // to highlight that this is a sideloaded entry, we prefix it
        sys: {
          type: 'Link',
          linkType: 'Entry', // TODO: this can be taking type from the ppd  { link , type }
          id: defaultEntryId,
        },
      },
    };

    sideloadedCount++;
  };

  if (!checkIsAssemblyEntry(patternEntry as Entry)) {
    // Only supported for pattern entries since experience entries don't define pattern properties.
    return false;
  }

  // Sideload all default values for the parent pattern
  const definitions: PatternPropertyDefinitions =
    patternEntry.fields.componentSettings?.patternPropertyDefinitions ?? {};

  Object.entries(definitions).forEach(([ppdID, ppd]) => {
    addDefaultValueToDataSource(ppdID, ppd);
  });

  // Sideload all default values for the L1 nested patterns
  const nestedPatternEntries = (patternEntry.fields.usedComponents || []).filter(
    (component): component is PatternEntry =>
      component !== undefined && checkIsAssemblyEntry(component as Entry),
  );

  nestedPatternEntries.forEach((nestedPatternEntry) => {
    const nestedPatternDefs: PatternPropertyDefinitions =
      nestedPatternEntry.fields.componentSettings?.patternPropertyDefinitions ?? {};

    Object.entries(nestedPatternDefs).forEach(([ppdID, ppd]) => {
      addDefaultValueToDataSource(ppdID, ppd);
    });
  });

  return sideloadedCount;
};
