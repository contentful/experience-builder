import { ExperienceEntry } from '@/types';
import { ContentfulClientApi, Entry, Asset } from 'contentful';
import {
  extractPrebindingDataByPatternId,
  flattenNestedPatterns,
  generateDefaultDataSourceForPrebindingDefinition,
  isExperienceEntry,
} from '@/utils';
import {
  DeepReference,
  gatherDeepPrebindingReferencesFromExperienceEntry,
  gatherDeepPrebindingReferencesFromPatternEntry,
  gatherDeepReferencesFromExperienceEntry,
} from '@/deep-binding';
import { gatherAutoFetchedReferentsFromIncludes } from './gatherAutoFetchedReferentsFromIncludes';
import { fetchAllEntries, fetchAllAssets } from './fetchAllEntities';

type ClientAndLocaleParams =
  | {
      client: ContentfulClientApi<undefined>;
      locale?: string;
    }
  | {
      client: ContentfulClientApi<'WITH_ALL_LOCALES'>;
      /** When fetching all locales, this may not be defined */
      locale?: undefined;
    };

type FetchReferencedEntitiesArgs = {
  experienceEntry: Entry | ExperienceEntry;
} & ClientAndLocaleParams;

/**
 * Fetches all entries and assets from the `dataSource` of the given experience entry. This will
 * also consider deep references that are not listed explicitly but linked through deep binding paths.
 * @param options.client - Instantiated client from the Contentful SDK. If this is using the `withAllLocales` modifier, you may not provide a specific locale.
 * @param options.experienceEntry - Localized experience entry. To localize a multi locale entry, use the `localizeEntity` function.
 * @param options.locale - Retrieve a specific localized version of the referenced entities. Otherwise, it will fallback to the default locale.
 * @returns object with a list of `entries` and a list of `assets`
 */
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

  if (!isExperienceEntry(experienceEntry)) {
    throw new Error(
      'Failed to fetch experience entities. Provided "experienceEntry" does not match experience entry schema',
    );
  }

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

  const usedPatterns = experienceEntry.fields.usedComponents ?? [];
  const isRenderingExperience = Boolean(!experienceEntry.fields.componentSettings);

  const deepReferences: Array<DeepReference> = gatherDeepReferencesFromExperienceEntry(
    experienceEntry as ExperienceEntry,
  );

  // If we are previewing a pattern, we want to include the entry itself as well
  const fetchedPatterns = (
    isRenderingExperience ? usedPatterns : [...usedPatterns, experienceEntry]
  ) as Array<ExperienceEntry>;
  const allFetchedPatterns = flattenNestedPatterns(fetchedPatterns);
  const prebindingDataByPatternId = extractPrebindingDataByPatternId(allFetchedPatterns);

  // Patterns do not have dataSource stored in their dataSource field, so head entities won't be there and we need to fetch them
  if (!isRenderingExperience) {
    const { dataSource } = generateDefaultDataSourceForPrebindingDefinition(
      experienceEntry.fields.componentSettings?.prebindingDefinitions,
    );

    if (Object.keys(dataSource).length) {
      const prebindingEntriesResponse = await fetchAllEntries({
        client,
        ids: Object.values(dataSource).map((link) => link.sys.id),
        locale,
      });

      entriesResponse.items.push(...prebindingEntriesResponse.items);
      entriesResponse.includes.Asset.push(...(prebindingEntriesResponse.includes?.Asset ?? []));
      entriesResponse.includes.Entry.push(...(prebindingEntriesResponse.includes?.Entry ?? []));
    }
  }

  // normally, for experience entry, there should be no need to call this method, as `includes=2` will have them resolved
  // because the entries used for pre-binding are stored in both - the layout of the experience, as well as the dataSource field
  const deepPrebindingReferences = isRenderingExperience
    ? gatherDeepPrebindingReferencesFromExperienceEntry({
        experienceEntry: experienceEntry as ExperienceEntry,
        fetchedPatterns: allFetchedPatterns,
        prebindingDataByPatternId,
        fetchedLevel1Entries: entriesResponse.items,
      })
    : // however, for patterns, we have to do it by hand, because a pattern entry doesn't save the pre-binding data neither in the
      // layout nor in the dataSource field.
      // for consistency, as well as to be future safe from the change to "includes=2", I added methods for both
      gatherDeepPrebindingReferencesFromPatternEntry({
        patternEntry: experienceEntry as ExperienceEntry,
        fetchedPatterns: allFetchedPatterns,
        prebindingDataByPatternId,
        fetchedLevel1Entries: entriesResponse.items,
      });

  const allDeepReferences = [...deepReferences, ...deepPrebindingReferences];

  const { autoFetchedReferentAssets, autoFetchedReferentEntries } =
    gatherAutoFetchedReferentsFromIncludes(allDeepReferences, entriesResponse);

  // Using client getEntries resolves all linked entry references, so we do not need to resolve entries in usedComponents
  const allResolvedEntries = [
    ...((entriesResponse?.items ?? []) as Entry[]),
    ...((entriesResponse.includes?.Entry ?? []) as Entry[]),
    ...((usedPatterns as ExperienceEntry[]) || []),
    ...autoFetchedReferentEntries,
  ];

  const allResolvedAssets = [
    ...((assetsResponse.items ?? []) as Asset[]),
    ...((entriesResponse?.includes?.Asset ?? []) as Asset[]),
    ...autoFetchedReferentAssets,
  ];

  return {
    // we have to drop duplicates, becasue of the merge of deepReferences and deepPrebindingReferences above
    // If not, the same entity might appear in this array more than once
    entries: [
      ...new Map(allResolvedEntries.map((entry) => [entry.sys.id, entry])).values(),
    ] as Entry[],
    assets: [
      ...new Map(allResolvedAssets.map((asset) => [asset.sys.id, asset])).values(),
    ] as Asset[],
  };
};
