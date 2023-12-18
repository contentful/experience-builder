import type { Asset, ContentfulClientApi, Entry } from 'contentful';
import { isExperienceEntry } from '@contentful/experience-builder-core';
import { ExperienceEntry } from '@contentful/experience-builder-core/types';

type fetchReferencedEntitiesArgs = {
  client: ContentfulClientApi<undefined>;
  experienceEntry: Entry | ExperienceEntry;
  locale: string;
};

export const fetchReferencedEntities = async ({
  client,
  experienceEntry,
  locale,
}: fetchReferencedEntitiesArgs) => {
  if (!client) {
    throw new Error(
      'Failed to fetch experience entities. Required "client" parameter was not provided'
    );
  }

  if (!locale) {
    throw new Error(
      'Failed to fetch experience entities. Required "locale" parameter was not provided'
    );
  }

  if (!isExperienceEntry(experienceEntry)) {
    throw new Error(
      'Failed to fetch experience entities. Provided "experienceEntry" does not match experience entry schema'
    );
  }

  const entryIds: string[] = [];
  const assetIds: string[] = [];

  for (const dataBinding of Object.values((experienceEntry as ExperienceEntry).fields.dataSource)) {
    if (!('sys' in dataBinding)) {
      continue;
    }
    if (dataBinding.sys.linkType === 'Entry') {
      entryIds.push(dataBinding.sys.id);
    }
    if (dataBinding.sys.linkType === 'Asset') {
      assetIds.push(dataBinding.sys.id);
    }
  }

  const [entriesResponse, assetsResponse] = await Promise.all([
    entryIds.length > 0 ? client.getEntries({ 'sys.id[in]': entryIds, locale }) : { items: [] },
    assetIds.length > 0 ? client.getAssets({ 'sys.id[in]': assetIds, locale }) : { items: [] },
  ]);

  // Using client getEntries resolves all linked entry references, so we do not need to resolve entries in usedComponents
  const allResolvedEntries = [
    ...((entriesResponse.items ?? []) as Entry[]),
    ...((experienceEntry.fields.usedComponents as ExperienceEntry[]) || []),
  ];

  return {
    entries: allResolvedEntries as Entry[],
    assets: (assetsResponse.items ?? []) as Asset[],
  };
};

type fetchExperienceEntryArgs = {
  client: ContentfulClientApi<undefined>;
  experienceTypeId: string;
  locale: string;
  identifier: {
    slug?: string;
    id?: string;
  };
};

export const fetchExperienceEntry = async ({
  client,
  experienceTypeId,
  locale,
  identifier,
}: fetchExperienceEntryArgs) => {
  if (!client) {
    throw new Error(
      'Failed to fetch experience entities. Required "client" parameter was not provided'
    );
  }

  if (!locale) {
    throw new Error(
      'Failed to fetch experience entities. Required "locale" parameter was not provided'
    );
  }

  if (!experienceTypeId) {
    throw new Error(
      'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided'
    );
  }

  if (!identifier.slug && !identifier.id) {
    throw new Error(
      `Failed to fetch experience entities. At least one identifier must be provided. Received: ${JSON.stringify(
        identifier
      )}`
    );
  }

  const filter = identifier.slug ? { 'fields.slug': identifier.slug } : { 'sys.id': identifier.id };

  const entries = await client.getEntries({
    content_type: experienceTypeId,
    locale,
    ...filter,
  });

  if (entries.items.length > 1) {
    throw new Error(
      `More than one experience with identifier: ${JSON.stringify(identifier)} was found`
    );
  }

  return entries.items[0] as Entry | undefined;
};

type fetchExperienceArgs = {
  client: ContentfulClientApi<undefined>;
  experienceTypeId: string;
  locale: string;
  identifier: {
    slug?: string;
    id?: string;
  };
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
