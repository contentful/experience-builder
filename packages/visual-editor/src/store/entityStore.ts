import { EditorModeEntityStore } from '@contentful/experience-builder-core';
import { create } from 'zustand';

export interface EntityState {
  entityStore: EditorModeEntityStore;
  // Optimistic loading. Try to render everything as early as possible.
  // The entities might already be defined in the entity store.
  areEntitiesFetched: boolean;
  areEntitesResolvedInParent: boolean;
  // updaters
  setEntitiesFetched: (fetched: boolean) => void;
  setEntitiesResolvedInParent: (resolved: boolean) => void;
  resetEntityStore: (locale: string, entities?: EditorModeEntityStore['entities']) => void;
}

export const useEntityStore = create<EntityState>((set, get) => ({
  entityStore: new EditorModeEntityStore({ locale: 'en-US', entities: [] }),
  areEntitesResolvedInParent: false,
  areEntitiesFetched: false,

  setEntitiesFetched(fetched) {
    set({ areEntitiesFetched: fetched });
  },
  setEntitiesResolvedInParent(resolved) {
    if (get().areEntitesResolvedInParent && resolved) {
      return;
    }
    set({ areEntitesResolvedInParent: resolved });
  },
  resetEntityStore(locale, entities = []) {
    set({ entityStore: new EditorModeEntityStore({ locale, entities }) });
  },
}));
