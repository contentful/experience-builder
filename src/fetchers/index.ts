import type { ContentfulClientApi, Entry } from "contentful"
import { isExperienceEntry } from "../validation";

type fetchExperienceEntitiesArgs = {
  client: ContentfulClientApi<undefined>;
  experienceEntry: Entry;
  locale: string;
}

export const fetchExperienceEntities = async ({
  client,
  experienceEntry,
  locale,
}: fetchExperienceEntitiesArgs) => {
  if (!client) {
    throw new Error('Failed to fetch experience entities. Required "client" parameter was not provided');
  }

  if (!locale) {
    throw new Error('Failed to fetch experience entities. Required "locale" parameter was not provided');
  }

  if (!isExperienceEntry(experienceEntry)) {
    throw new Error('Failed to fetch experience entities. Provided "experienceEntry" does not match experience entry schema');
  }

  const entryIds: string[] = [];
  const assetIds: string[] = [];

  for (const dataBinding of Object.values(experienceEntry.fields.dataSource)) {
    if (!('sys' in dataBinding)) {
      continue
    }
    if (dataBinding.sys.linkType === 'Entry') {
      entryIds.push(dataBinding.sys.id)
    }
    if (dataBinding.sys.linkType === 'Asset') {
      assetIds.push(dataBinding.sys.id)
    }
  }

  const [entriesResponse, assetsResponse] = await Promise.all([
    entryIds.length > 0
      ? client.getEntries({ 'sys.id[in]': entryIds, locale })
      : { items: [] },
    assetIds.length > 0
      ? client.getAssets({ 'sys.id[in]': assetIds, locale })
      : { items: [] },
  ])
  
  return {
    entries: entriesResponse.items ?? [],
    assets: assetsResponse.items ?? [],
  }
}


type fetchExperienceEntryArgs = {
  client: ContentfulClientApi<undefined>;
  experienceTypeId: string;
  locale: string;
  idenifier: {
    slug?: string;
    id?: string;
  }
}

export const fetchExperienceEntry = async ({
  client,
  experienceTypeId,
  locale,
  idenifier
} : fetchExperienceEntryArgs) => {
  if (!client) {
    throw new Error('Failed to fetch experience entities. Required "client" parameter was not provided');
  }

  if (!locale) {
    throw new Error('Failed to fetch experience entities. Required "locale" parameter was not provided');
  }

  if (!experienceTypeId) {
    throw new Error('Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided');
  }

  if (!idenifier.slug && !idenifier.id) {
    throw new Error(`Failed to fetch experience entities. At least one identifier must be provided. Received: ${JSON.stringify(idenifier)}`);
  }

  const filter = idenifier.slug ? { 'fields.slug': idenifier.slug } : { 'sys.id': idenifier.id };

  const entries = await client.getEntries({
    content_type: experienceTypeId,
    locale,
    ...filter,
  })

  if (entries.items.length > 1) {
    throw new Error(`More than one experience with identifier: ${JSON.stringify(idenifier)} was found`);
  }

  return entries.items[0];
}
