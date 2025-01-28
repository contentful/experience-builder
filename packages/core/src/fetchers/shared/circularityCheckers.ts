import { ExperienceEntry, Link } from '@/types';

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
