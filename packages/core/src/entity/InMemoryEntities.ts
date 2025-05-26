import { create } from 'zustand';
import { EntityStoreBase } from './EntityStoreBase';
import { Asset, Entry, UnresolvedLink } from 'contentful';
import { UninitializedEntityStore } from './UninitializedEntityStore';

export interface InMemoryEntitiesState {
  entityStore: EntityStoreBase;
  // Set to true when entities were fetched from the parent app.
  // Reset to false when we receive a tree update and need to validate
  // again whether all necessary entities are fetched.
  areEntitiesFetched: boolean;
  // updaters
  setEntitiesFetched: (fetched: boolean) => void;
  resolveEntity: <T extends 'Entry' | 'Asset'>(
    link?: UnresolvedLink<T>,
  ) => Entry | Asset | undefined;
  resetEntityStore: (entityStore: EntityStoreBase) => void;
}

export const inMemoryEntitiesStore = create<InMemoryEntitiesState>((set, get) => ({
  // The UninitializedEntityStore is a placeholder instance and is here to highlight the
  // // fact that it's not used by anything until during loading lifecycle it'sreplaced by real entity store:
  //   - in Preview+Delivery mode: right after we fetch Expereince and it entities
  //   - in EDITOR (VisualEditor) mode: right after the VisualEditor is async imported and initialize event happens
  entityStore: new UninitializedEntityStore(),
  areEntitiesFetched: false,

  setEntitiesFetched(fetched) {
    set({ areEntitiesFetched: fetched });
  },
  resolveEntity<T extends 'Entry' | 'Asset'>(link?: UnresolvedLink<T>) {
    if (!link) return undefined;

    const { entityStore } = get();

    return entityStore.getEntityFromLink(link);
  },
  resetEntityStore(entityStore) {
    set({
      entityStore,
      areEntitiesFetched: false,
    });
  },
}));

function isLink(data: unknown): data is UnresolvedLink<'Entry' | 'Asset'> {
  if (!data) {
    return false;
  }

  const maybeLink = data as {
    sys?: {
      type?: string;
      linkType?: string;
    };
  };

  if (!maybeLink.sys || !maybeLink.sys.type || !maybeLink.sys.linkType) {
    return false;
  }

  return maybeLink.sys.type === 'Link' && ['Entry', 'Asset'].includes(maybeLink.sys.linkType);
}

function maybeResolveLink(maybeLink: UnresolvedLink<'Entry'>): Entry | undefined;
function maybeResolveLink(maybeLink: UnresolvedLink<'Asset'>): Asset | undefined;
function maybeResolveLink(maybeLink: UnresolvedLink<'Asset' | 'Entry'>): Asset | Entry | undefined;
function maybeResolveLink(maybeLink: unknown): Entry | Asset | undefined;
function maybeResolveLink(maybeLink: unknown): Entry | Asset | undefined {
  if (!isLink(maybeLink)) {
    console.warn(
      'maybeResolveLink function must receive Link shape. Provided argument does not match the Link shape: ',
      maybeLink,
    );
    return undefined;
  }
  return inMemoryEntitiesStore.getState().resolveEntity(maybeLink);
}

function addEntities(entities: Array<Entry>): void;
function addEntities(entities: Array<Asset>): void;
function addEntities(entities: Array<Entry | Asset>): void;
function addEntities(entities: Array<Entry> | Array<Asset> | Array<Entry | Asset>): void {
  if (!Array.isArray(entities) || entities.length === 0) {
    return;
  }

  const { entityStore } = inMemoryEntitiesStore.getState();
  const definedEntities = entities.filter(Boolean);

  for (const entity of definedEntities) {
    entityStore.updateEntity(entity);
  }
}

const inMemoryEntities = {
  maybeResolveLink,
  addEntities,
};

export type InMemoryEntitiesService = typeof inMemoryEntities;

const useInMemoryEntities = () => {
  return inMemoryEntities;
};

export { inMemoryEntities, useInMemoryEntities };
