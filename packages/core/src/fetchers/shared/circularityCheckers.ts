import { ExperienceEntry, Link } from '@/types';

/**
 * The CMA client will automatically replace links with entry references.
 * As we're including all referenced pattern entries in usedComponents, this can lead
 * to a circular reference. This function replaces those with plain links inplace (!).
 *
 * @see https://github.com/contentful/contentful.js/issues/377
 */
export const removeCircularPatternReferences = (
  experienceEntry: ExperienceEntry,
  _parentIds?: Set<string>,
) => {
  const parentIds = _parentIds ?? new Set<string>([experienceEntry.sys.id]);
  const usedComponents = experienceEntry.fields.usedComponents;
  const newUsedComponents = usedComponents?.reduce(
    (acc, linkOrEntry: Link<'Entry'> | ExperienceEntry) => {
      if (!('fields' in linkOrEntry)) {
        // It is a link, we're good
        return [...acc, linkOrEntry];
      }
      const entry = linkOrEntry;
      if (parentIds.has(entry.sys.id)) {
        // It is an entry that already occurred -> turn it into a link to remove the circularity
        const link = {
          sys: {
            id: entry.sys.id,
            linkType: 'Entry',
            type: 'Link',
          },
        } as const;
        return [...acc, link];
      }
      // Remove circularity for its usedComponents as well (inplace)
      removeCircularPatternReferences(entry, new Set([...parentIds, entry.sys.id]));
      return [...acc, entry];
    },
    [] as Array<Link<'Entry'> | ExperienceEntry>,
  );
  // @ts-expect-error - type of usedComponents doesn't yet allow a mixed list of both links and entries
  experienceEntry.fields.usedComponents = newUsedComponents;
};

/**
 * The CMA client will automatically replace links with entry references if they are available.
 * While we're not fetching the data sources, a self reference would be replaced as the entry is
 * fetched. Any circuar reference in the object breaks SSR where we have to stringify the JSON.
 * This would fail if the object contains circular references.
 */
export const removeSelfReferencingDataSource = (experienceEntry: ExperienceEntry) => {
  const dataSources = experienceEntry.fields.dataSource;
  const newDataSource = Object.entries(dataSources).reduce(
    (acc, [key, linkOrEntry]) => {
      if ('fields' in linkOrEntry && linkOrEntry.sys.id === experienceEntry.sys.id) {
        const entry = linkOrEntry as unknown as ExperienceEntry;
        acc[key] = {
          sys: {
            id: entry.sys.id,
            linkType: 'Entry',
            type: 'Link',
          },
        };
      } else {
        const link = linkOrEntry;
        acc[key] = link;
      }
      return acc;
    },
    {} as ExperienceEntry['fields']['dataSource'],
  );
  experienceEntry.fields.dataSource = newDataSource;
};
