import { create } from 'zustand';
import { EntityStoreBase } from './EntityStoreBase';
import { EditorModeEntityStore } from './EditorModeEntityStore';
import { Asset, Entry, UnresolvedLink } from 'contentful';

export interface EntityState {
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
  resetEntityStore: (entityStore: EntityStoreBase) => EntityStoreBase;
}

export const entityCache = create<EntityState>((set) => ({
  entityStore: new EditorModeEntityStore({ locale: 'en-US', entities: [] }),
  areEntitiesFetched: false,

  setEntitiesFetched(fetched) {
    set({ areEntitiesFetched: fetched });
  },
  resolveEntity<T extends 'Entry' | 'Asset'>(link?: UnresolvedLink<T>): Entry | Asset | undefined {
    if (!link) return undefined;
    return this.entityStore.getEntityFromLink(link);
  },
  resetEntityStore(entityStore: EntityStoreBase): EntityStoreBase {
    console.debug(`[experiences-sdk-react] Resetting entity store`);
    set({
      entityStore,
      areEntitiesFetched: false,
    });

    return entityStore;
  },
}));

export { entityCache as useEntityStore };
