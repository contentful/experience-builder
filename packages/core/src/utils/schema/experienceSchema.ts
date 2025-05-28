import { Experience, Link } from '@/types';
import { referencesOf } from './referencesOf';
import { Entry } from 'contentful';
import { isAsset, isEntry } from '../typeguards';

const excludeAssets = (link: Link<'Asset' | 'Entry'>) => link.sys.linkType !== 'Asset';

/**
 * Parses experience data and extracts unresolved links to assets and entries.
 * TODO: currently it only follows links from the dataSource... (which is L2, but how do we get to L4).
 */
export const extractUnresolvedLinksFromExperience = (experience: Experience) => {
  const assetLinks: Link<'Asset'>[] = [];
  const entryLinks: Link<'Entry'>[] = [];

  if (!experience.entityStore) {
    throw new Error('Experience does not have an entity store');
  }

  // The entity store can be EntityStore or EntityModeEntityStore,
  // when EntityModeEntityStore, then it will not contain the entry and hence we cannot extract unresolved links from it.
  if (!experience.entityStore.experienceEntryFields) {
    throw new Error(
      'Experience does not have experienceEntryFields, which is required to extract unresolved links. Maybe it is not instance of EntityStore, but instead EntityModeEntityStore?',
    );
  }

  const linksToEntities: Link<'Asset' | 'Entry'>[] = Object.values(
    experience.entityStore.experienceEntryFields.dataSource,
  );
  const linksToEntries = linksToEntities.filter(excludeAssets) as Link<'Entry'>[]; // assuming that they have loaded ALL headEntries

  for (const link of linksToEntries) {
    const e = experience.entityStore.getEntityFromLink(link) as Entry | undefined;
    if (!e) {
      // TODO: We leave exception during development to just monitor this case and step through it.
      // Because  it's perfectly ok to have "dataSource orphans" in the exeperience entry.
      // This would happens when an entry is deleted and also archived (in SDK client.getEntry()
      // shouldn't return archived, in EDITOR useRestoreTree skips archived).
      throw new Error(
        `Entity Store must have entries for all links mentioned in dataSource eg.  '${link.sys.id}'`,
      );
    }
    const references = referencesOf(e);
    for (const ref of references) {
      if (!experience.entityStore?.getEntityFromLink(ref)) {
        if (isAsset(ref)) {
          assetLinks.push(ref);
        } else if (isEntry(ref)) {
          entryLinks.push(ref);
        }
      }
    }
  }

  return {
    assetLinks,
    entryLinks,
    assetIds: assetLinks.map((link) => link.sys.id),
    entryIds: entryLinks.map((link) => link.sys.id),
  };
};
