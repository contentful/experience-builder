import { create } from 'zustand';
import type { EntityStoreBase } from './EntityStoreBase';
import type { Asset, Entry, UnresolvedLink } from 'contentful';
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
