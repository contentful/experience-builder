import { ExperienceEntry } from '@/types';
import { ContentfulClientApi, Entry, Asset, AssetCollection } from 'contentful';
import { isExperienceEntry } from '@/utils';
import { DeepReference, gatherDeepReferencesFromExperienceEntry } from '@/deep-binding';
import {
  MinimalEntryCollection,
  gatherAutoFetchedReferentsFromIncludes,
} from './gatherAutoFetchedReferentsFromIncludes';

type FetchReferencedEntitiesArgs = {
  client: ContentfulClientApi<undefined>;
  experienceEntry: Entry | ExperienceEntry;
  locale: string;
};

export const fetchReferencedEntities = async ({
  client,
  experienceEntry,
  locale,
}: FetchReferencedEntitiesArgs) => {
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
  const deepReferences: Array<DeepReference> = gatherDeepReferencesFromExperienceEntry(
    experienceEntry as ExperienceEntry
  );

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

  const [entriesResponse, assetsResponse] = (await Promise.all([
    entryIds.length > 0
      ? client.withoutLinkResolution.getEntries({ 'sys.id[in]': entryIds, locale })
      : { items: [], includes: [] },
    assetIds.length > 0 ? client.getAssets({ 'sys.id[in]': assetIds, locale }) : { items: [] },
  ])) as unknown as [MinimalEntryCollection, AssetCollection];

  const { autofetchedReferentAssets, autofetchedReferentEntries } =
    gatherAutoFetchedReferentsFromIncludes(deepReferences, entriesResponse);

  // Using client getEntries resolves all linked entry references, so we do not need to resolve entries in usedComponents
  const allResolvedEntries = [
    ...((entriesResponse.items ?? []) as Entry[]),
    ...((experienceEntry.fields.usedComponents as ExperienceEntry[]) || []),
    ...autofetchedReferentEntries,
  ];

  const allResolvedAssets = [
    ...((assetsResponse.items ?? []) as Asset[]),
    ...autofetchedReferentAssets,
  ];

  return {
    entries: allResolvedEntries as Entry[],
    assets: allResolvedAssets as Asset[],
  };
};
