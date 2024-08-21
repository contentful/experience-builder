import { createStore, StoreApi } from './store';

class ExperienceStore {
  private store: StoreApi<unknown> | null = null;

  constructor() {
    this.store = null;
  }

  public makeStore<T = unknown>(initialStore?: T) {
    if (this.store || !initialStore) {
      return;
    }

    this.store = createStore(() => initialStore);
  }

  public getStore() {
    return this.store;
  }

  public getState(key: string) {
    if (!this.store) {
      return null;
    }

    const state = this.store.getState();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (state as any)?.[key];
  }
}

export const store = new ExperienceStore();

export const updateStoreValue = (key: string, value: unknown) => {
  store.getStore()?.setState((state) => {
    return {
      ...state,
      [key]: value,
    };
  });
};

export const watchStoreValue = (key: string, cb: (value: unknown) => void) => {
  store.getStore()?.subscribe((state) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (state as any)?.[key];

    cb(value);
  });
};
