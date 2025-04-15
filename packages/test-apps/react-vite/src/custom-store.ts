import { Asset, ContentfulClientApi, Entry, UnresolvedLink } from 'contentful';

export const customEntityStore = {
  entitiesById: {} as Record<string, Asset | Entry>,
  client: undefined as ContentfulClientApi<undefined> | undefined,

  getEntityByLink: async (
    link: UnresolvedLink<'Asset' | 'Entry'>,
  ): Promise<Asset | Entry | undefined> => {
    const stored = customEntityStore.entitiesById[link.sys.id];
    if (stored) return stored;
    if (!customEntityStore.client) return undefined;

    const fetched = await fetchByLink(customEntityStore.client, link);
    console.log('TK fetched', fetched);
    customEntityStore.entitiesById[link.sys.id] = fetched;
    return fetched;
  },
  storeEntities: (entities: Array<Asset | Entry>) => {
    entities.forEach((entity) => {
      customEntityStore.entitiesById[entity.sys.id] = entity;
    });
    console.log('TK stored everything', { entitiesById: customEntityStore.entitiesById });
  },
  setClient: (client: ContentfulClientApi<undefined>) => {
    customEntityStore.client = client;
  },
};

const fetchByLink = async (
  client: ContentfulClientApi<undefined>,
  link: UnresolvedLink<'Asset' | 'Entry'>,
) => {
  if (link.sys.linkType === 'Asset') {
    return client.getAsset(link.sys.id);
  }
  return client.getEntry(link.sys.id);
};
