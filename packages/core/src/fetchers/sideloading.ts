import type { Entry } from 'contentful';
import type { ExperienceEntry, ExperienceComponentSettings } from '@/types';
import type { ParameterDefinition } from '@contentful/experiences-validators';
import { checkIsAssemblyEntry, isLink } from '@/utils';
import { SIDELOADED_PREFIX } from '@/constants';

type PatternEntry = ExperienceEntry; // alias for clarity
type ParameterDefinitions = Record<string, ParameterDefinition>;

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

  const addDefaultValueToDataSource = (_definitionId: string, definition: ParameterDefinition) => {
    if (!definition.defaultSource) {
      // prebinding preset doesn't have default value, which is perfectly fine
      return;
    }

    const {
      contentTypeId,
      link,
      type, // Today, it means that defaultSource is a link to a Contentful Entry, but in the future it could be a link to third party resource or smth.
      // this .type enumeration will not have the same meaning as `Link#sys#linkType`.
    } = definition.defaultSource;
    // const [[, defaultEntryLink]] = Object.entries(definition.defaultValue); // TODO: this is extracting of the default value...  I need to adjust it to the way it is done in DanV's PR

    if (!isLink(link)) {
      // default value is not a link, maybe due to a bug
      return;
    }

    if (!type || !contentTypeId) {
      // broken data structure, unlikely to happen, only due to a bug
      return;
    }

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
      [`${SIDELOADED_PREFIX}${link.sys.id}`]: {
        // to highlight that this is a sideloaded entry, we prefix it
        sys: {
          type: 'Link',
          linkType: link.sys.linkType,
          id: link.sys.id,
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
  const definitions: ParameterDefinitions =
    patternEntry.fields.componentSettings?.prebindingDefinitions?.[0].parameterDefinitions ?? {};

  Object.entries(definitions).forEach(([id, definition]) => {
    addDefaultValueToDataSource(id, definition);
  });

  // Sideload all default values for the L1 nested patterns
  const nestedPatternEntries = (patternEntry.fields.usedComponents || []).filter(
    (component): component is PatternEntry =>
      component !== undefined && checkIsAssemblyEntry(component as Entry),
  );

  nestedPatternEntries.forEach((nestedPatternEntry) => {
    const nestedParameterDefinitions: ParameterDefinitions =
      nestedPatternEntry.fields.componentSettings?.prebindingDefinitions?.[0]
        .parameterDefinitions ?? {};

    Object.entries(nestedParameterDefinitions).forEach(([id, definition]) => {
      addDefaultValueToDataSource(id, definition);
    });
  });

  return sideloadedCount;
};
