import { EntityStoreBase } from './EntityStoreBase';

export class UninitializedEntityStore extends EntityStoreBase {
  constructor() {
    super({ entities: [], locale: 'uninitialized-locale-in-uninitialized-entity-store' });
  }
}
