import { ExperienceEntry } from '@/types';
import { ContentfulClientApi, Entry, Asset } from 'contentful';
import { isExperienceEntry } from '@/utils';
import { DeepReference, gatherDeepReferencesFromExperienceEntry } from '@/deep-binding';
import { gatherAutoFetchedReferentsFromIncludes } from './gatherAutoFetchedReferentsFromIncludes';
import { fetchAllEntries, fetchAllAssets } from './fetchAllEntities';

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
      'Failed to fetch experience entities. Required "client" parameter was not provided',
    );
  }

  if (!locale) {
    throw new Error(
      'Failed to fetch experience entities. Required "locale" parameter was not provided',
    );
  }

  if (!isExperienceEntry(experienceEntry)) {
    throw new Error(
      'Failed to fetch experience entities. Provided "experienceEntry" does not match experience entry schema',
    );
  }
  const deepReferences: Array<DeepReference> = gatherDeepReferencesFromExperienceEntry(
    experienceEntry as ExperienceEntry,
  );

  const entryIds = new Set<string>();
  const assetIds = new Set<string>();

  for (const dataBinding of Object.values((experienceEntry as ExperienceEntry).fields.dataSource)) {
    if (!('sys' in dataBinding)) {
      continue;
    }
    if (dataBinding.sys.linkType === 'Entry') {
      entryIds.add(dataBinding.sys.id);
    }
    if (dataBinding.sys.linkType === 'Asset') {
      assetIds.add(dataBinding.sys.id);
    }
  }

  const [entriesResponse, assetsResponse] = await Promise.all([
    fetchAllEntries({ client, ids: [...entryIds], locale }),
    fetchAllAssets({ client, ids: [...assetIds], locale }),
  ]);

  const { autoFetchedReferentAssets, autoFetchedReferentEntries } =
    gatherAutoFetchedReferentsFromIncludes(deepReferences, entriesResponse);

  // Using client getEntries resolves all linked entry references, so we do not need to resolve entries in usedComponents
  const allResolvedEntries = [
    ...((entriesResponse?.items ?? []) as Entry[]),
    ...((entriesResponse.includes?.Entry ?? []) as Entry[]),
    ...((experienceEntry.fields.usedComponents as ExperienceEntry[]) || []),
    ...autoFetchedReferentEntries,
  ];

  const allResolvedAssets = [
    ...((assetsResponse.items ?? []) as Asset[]),
    ...((entriesResponse?.includes?.Asset ?? []) as Asset[]),
    ...autoFetchedReferentAssets,
  ];

  return {
    entries: allResolvedEntries as Entry[],
    assets: allResolvedAssets as Asset[],
  };
};
