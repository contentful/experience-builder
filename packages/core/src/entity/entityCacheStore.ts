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
  resetEntityStore: (entityStore: EntityStoreBase) => void;
}

export const entityCacheStore = create<EntityState>((set, get) => ({
  entityStore: new EditorModeEntityStore({ locale: 'lol', entities: [] }),
  areEntitiesFetched: false,

  setEntitiesFetched(fetched) {
    set({ areEntitiesFetched: fetched });
  },
  resolveEntity<T extends 'Entry' | 'Asset'>(link?: UnresolvedLink<T>) {
    if (!link) return undefined;

    const { entityStore } = get();

    console.log('entityCache.entityStore', entityStore);
    return entityStore.getEntityFromLink(link);
  },
  resetEntityStore(entityStore) {
    try {
      throw new Error('Test');
    } catch (e) {
      console.log('reset caused by', (e as Error).stack);
    }
    console.log('resetting entity store with', entityStore);
    console.debug(`[experiences-sdk-react] Resetting entity store`);
    set({
      entityStore,
      areEntitiesFetched: false,
    });
  },
}));

function maybeResolveLink(link: UnresolvedLink<'Entry'>): Entry | undefined;
function maybeResolveLink(link: UnresolvedLink<'Asset'>): Asset | undefined;
function maybeResolveLink(
  link: UnresolvedLink<'Entry'> | UnresolvedLink<'Asset'>,
): Entry | Asset | undefined;
function maybeResolveLink(link: UnresolvedLink<'Entry' | 'Asset'>) {
  return entityCacheStore.getState().resolveEntity(link);
}

export { maybeResolveLink };
