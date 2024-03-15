import { EditorModeEntityStore } from '@contentful/experiences-core';
import { create } from 'zustand';

export interface EntityState {
  entityStore: EditorModeEntityStore;
  // Set to true when entities were fetched from the parent app.
  // Reset to false when we receive a tree update and need to validate
  // again whether all necessary entities are fetched.
  areEntitiesFetched: boolean;
  // updaters
  setEntitiesFetched: (fetched: boolean) => void;
  resetEntityStore: (
    locale: string,
    entities?: EditorModeEntityStore['entities'],
  ) => EditorModeEntityStore;
}

export const useEntityStore = create<EntityState>((set) => ({
  entityStore: new EditorModeEntityStore({ locale: 'en-US', entities: [] }),
  areEntitiesFetched: false,

  setEntitiesFetched(fetched) {
    set({ areEntitiesFetched: fetched });
  },
  resetEntityStore(locale, entities = []): EditorModeEntityStore {
    console.debug(
      `[experiences-sdk-react] Resetting entity store because the locale changed to '${locale}'.`,
    );
    const newEntityStore = new EditorModeEntityStore({ locale, entities });
    set({
      entityStore: newEntityStore,
      areEntitiesFetched: false,
    });

    return newEntityStore;
  },
}));
