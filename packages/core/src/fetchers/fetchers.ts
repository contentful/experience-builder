import type { ContentfulClientApi } from 'contentful';
import { fetchExperienceEntry } from './fetchExperienceEntry';
import { fetchReferencedEntities } from './fetchReferencedEntities';

type fetchExperienceArgs = {
  client: ContentfulClientApi<undefined>;
  experienceTypeId: string;
  locale: string;
  identifier: { slug: string } | { id: string };
};

export const fetchExperience = async ({
  client,
  experienceTypeId,
  locale,
  identifier,
}: fetchExperienceArgs) => {
  const entry = await fetchExperienceEntry({ client, experienceTypeId, locale, identifier });

  if (!entry) {
    return { experienceEntry: undefined, referencedAssets: [], referencedEntries: [] };
  }

  const { assets, entries } = await fetchReferencedEntities({
    client,
    experienceEntry: entry,
    locale,
  });

  return {
    experienceEntry: entry,
    referencedAssets: assets,
    referencedEntries: entries,
  };
};
