import './studio-config';
import { useParams } from 'react-router-dom';
import './styles.css';
import { Experience, ExperienceRoot, useFetchBySlug } from '@contentful/experiences-sdk-react';
import { useContentfulClient } from './hooks/useContentfulClient';
import { useContentfulConfig } from './hooks/useContentfulConfig';
import { inMemoryEntities } from '@contentful/experiences-sdk-react';
import { useEffect, useState } from 'react';
import { Entry, UnresolvedLink } from 'contentful';

/**
 * We provide in our SDK
 */
const extractUnresolvedLinksFromExperience = (experience: Experience) => {

  // const headEntries = experience.dataSource;
  const headEntries = experience.entityStore?.entities.filter(excludeAssets); // assuming that they have loaed ALL headEntries

  for(const e of headEntries) {
    const references = referencesOf(e); 
    for (const ref of references) {
      if (!experience.entityStore?.getEntityFromLink(ref)){
        if (isAsset(ref)) {
          unresolvedLinksToAssets.push(ref);
        } else if (isEntry(ref)) {
          unresolvedLinksToEntries.push(ref);
        }
      }
    }
  }

  return {
    unresolvedAssetIds: [],
    unresolvedEntryIds: [],
    unresolvedLinksToAssets: [],
    unresolvedLinksToEntries: [],
  };
};

const extractUnresolvedLinksFromEntries = (entries: Entry[]) => {
  for (const entry of entries) {
    for (const field in entry.fields) {
      const fieldValue = entry.fields[field];
      if (isArrayOfLinks(fieldValue)) {
        for (const link of fieldValue) {
          if (isAsset(link)) {
            unresolvedLinksToAssets.push(link);
          } else if (isEntry(link)) {
            unresolvedLinksToEntries.push(link);
          }
        }
      } else if (isLink(fieldValue)) {
        if (isAsset(fieldValue)) {
          unresolvedLinksToAssets.push(fieldValue);
        } else if (isEntry(fieldValue)) {
          unresolvedLinksToEntries.push(fieldValue);
        }
      }
    }
  }


  const notIsAlreadyInMemory = (link: UnresolvedLink<'Asset'|'Entry'>) => {
    return !inMemoryEntities.maybeResolveLink(link);
  }
  
  const uniqueUnresolvedLinksToAssets = Array.from(new Set(unresolvedLinksToAssets.filter(notIsAlreadyInMemory).map(link=>link.sys.id)));
  const uniqueUnresolvedLinksToEntries = Array.from(new Set(unresolvedLinksToEntries.filter(notIsAlreadyInMemory).map(link=>link.sys.id))));

  return {
    unresolvedAssetIds: uniqueUnresolvedLinksToAssets 
    unresolvedEntryIds: uniqueUnresolvedLinksToEntries,
  };
};


const fetchAdditionalLevels = async (depth: number, experience) => {
  // As first step we extract reference to L4 entities and kick off recursive fetching
  const { unresolvedAssetIds, unresolvedEntryIds } =
    extractUnresolvedLinksFromExperience(experience);

  await fetchLevel(depth, { unresolvedAssetIds, unresolvedEntryIds });

  async function fetchLevel(
    depth: number,
    {
      unresolvedAssetIds,
      unresolvedEntryIds,
    }: { unresolvedAssetIds: string[]; unresolvedEntryIds: string[] },
  ) {
    if (depth <= 0) {
      return;
    }

    // TODO: parallelize taking pagination into account
    const { items: assetItems } = await client.getAssets({
      'sys.id[in]': unresolvedAssetIds,
      locale,
      limit: 1000,
      skip: 0,
    });

    const { items: entryItems } = await client.getEntries({
      'sys.id[in]': unresolvedEntryIds,
      locale,
      limit: 1000,
      skip: 0,
    });

    // entryItems.forEach((entry) => {
    //   entry.fields = {
    //     ...omit(entry.fields, 'allIngredients', 'allAuthors'),
    //   }
    // });

    inMemoryEntities.addEntities([...assetItems, ...entryItems]);

    const {
      unresolvedAssetIds: newUnresolvedAssetIds,
      unresolvedEntryIds: newUnresolvedEntryIds,
    } = extractUnresolvedLinksFromEntries(entryItems);

    await fetchLevel(depth - 1, {
      unresolvedAssetIds: newUnresolvedAssetIds,
      unresolvedEntryIds: newUnresolvedEntryIds,
    });
  }
};


export default function Page() {
  const { slug = 'home-page', locale } = useParams<{ slug: string; locale?: string }>();
  const localeCode = locale ?? 'en-US';
  const { config } = useContentfulConfig();
  const { client } = useContentfulClient();

  const [areAllAdditionalLevelsFetched, setAreAllAdditionalLevelsFetched] =
    useState(false);

  const { experience, error, isLoading } = useFetchBySlug({
    slug,
    localeCode,
    client,
    experienceTypeId: config.experienceTypeId,
    hyperlinkPattern: '/{entry.fields.slug}',
  });

  useEffect(()=>{

    fetchAdditionalLevels(2, experience).then(()=>{
      setAreAllAdditionalLevelsFetched(true);
    })
  }, [experience]);



  if (isLoading) return <div>Loading experience...</div>;
  if (!areAllAdditionalLevelsFetched) return <div>Loading additional levels...</div>;

  if (error) return <div>{error.message}</div>;

  return <ExperienceRoot experience={experience} locale={localeCode} />;
}
