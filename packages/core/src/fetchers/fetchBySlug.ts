import { createExperience } from './createExperience';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { fetchReferencedEntities } from './fetchReferencedEntities';
import { ExperienceEntry, Link } from '@/types';
import { ContentfulClientApi, Entry } from 'contentful';

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
};

const handleError = (generalMessage: string, error: unknown) => {
  const message = error instanceof Error ? error.message : `Unknown error: ${error}`;
  throw Error(message);
};

type FetchBySlugParams = {
  /** instantiated client from the Contentful SDK */
  client: ContentfulClientApi<undefined>;
  /** id of the content type associated with the experience */
  experienceTypeId: string;
  /** slug of the experience (defined in entry settings) */
  slug: string;
  /** locale code to fetch the experience */
  localeCode: string;
  /** if the experience is being loaded in the Contentful Studio editor or not. If true, this function is a noop. */
  isEditorMode?: boolean;
};

/**
 * Fetches an experience object by its slug
 * @param {FetchBySlugParams} options - options to fetch the experience
 */
export async function fetchBySlug({
  client,
  experienceTypeId,
  slug,
  localeCode,
  isEditorMode,
}: FetchBySlugParams) {
  // Be a no-op if in editor mode
  if (isEditorMode) return;
  let experienceEntry: Entry | ExperienceEntry | undefined = undefined;

  try {
    experienceEntry = await fetchExperienceEntry({
      client,
      experienceTypeId,
      locale: localeCode,
      identifier: {
        slug,
      },
    });

    if (!experienceEntry) {
      throw new Error(`No experience entry with slug: ${slug} exists`);
    }

    removeCircularReferences(experienceEntry as ExperienceEntry);

    try {
      const { entries, assets } = await fetchReferencedEntities({
        client,
        experienceEntry,
        locale: localeCode,
      });

      const experience = createExperience({
        experienceEntry,
        referencedAssets: assets,
        referencedEntries: entries,
        locale: localeCode,
      });

      return experience;
    } catch (error) {
      handleError(errorMessagesWhileFetching.experienceReferences, error);
    }
  } catch (error) {
    handleError(errorMessagesWhileFetching.experience, error);
  }
}

const removeCircularReferences = (experienceEntry: ExperienceEntry, _parentIds?: Set<string>) => {
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
      removeCircularReferences(entry, new Set([...parentIds, entry.sys.id]));
      return [...acc, entry];
    },
    [] as Array<Link<'Entry'> | ExperienceEntry>,
  );
  // @ts-expect-error - type of usedComponents doesn't yet allow a mixed list of both links and entries
  experienceEntry.fields.usedComponents = newUsedComponents;
};
