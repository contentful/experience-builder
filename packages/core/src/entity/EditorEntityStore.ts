import type { Asset, Entry } from 'contentful';
import { EntityStoreBase } from './EntityStoreBase';
import { PostMessageMethods } from '../constants';
import { RequestEntitiesMessage, RequestedEntitiesMessage } from '../types';

type SendMessage = (
  method: PostMessageMethods.REQUEST_ENTITIES,
  params: RequestEntitiesMessage,
) => void;
type Subscribe = (
  method: PostMessageMethods.REQUESTED_ENTITIES,
  cb: (message: RequestedEntitiesMessage) => void,
) => VoidFunction;

/**
 * EntityStore which resolves entries and assets from the editor
 * over the sendMessage and subscribe functions.
 */
export abstract class EditorEntityStore extends EntityStoreBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private requestCache = new Map<string, Promise<any>>();
  private sendMessage: SendMessage;
  private subscribe: Subscribe;
  private timeoutDuration: number;

  constructor({
    entities,
    locale,
    sendMessage,
    subscribe,
    timeoutDuration = 3000,
  }: {
    entities: Array<Entry | Asset>;
    locale: string;
    sendMessage: SendMessage;
    subscribe: Subscribe;
    timeoutDuration?: number;
  }) {
    super({ entities, locale });
    this.sendMessage = sendMessage;
    this.subscribe = subscribe;
    this.timeoutDuration = timeoutDuration;
  }

  private cleanupPromise(referenceId: string) {
    setTimeout(() => {
      this.requestCache.delete(referenceId);
    }, 300);
  }

  private cacheIdSeperator = ',';

  private getCacheId(id: string[]): string {
    return id.length === 1 ? id[0] : id.join(this.cacheIdSeperator);
  }

  private async fetchEntity(
    type: 'Asset',
    ids: string[],
    skipCache: boolean,
  ): Promise<Array<Asset>>;
  private async fetchEntity(
    type: 'Entry',
    ids: string[],
    skipCache: boolean,
  ): Promise<Array<Entry>>;
  private async fetchEntity(
    type: 'Asset' | 'Entry',
    ids: string[],
    skipCache: boolean = false,
  ): Promise<Array<Entry> | Array<Asset>> {
    let missing: string[];
    if (!skipCache) {
      const { missing: missingFromCache, resolved } = this.getEntitiesFromMap(type, ids);
      if (missingFromCache.length === 0) {
        // everything is already in cache
        return resolved as Array<Entry> | Array<Asset>;
      }

      missing = missingFromCache;
    } else {
      missing = [...ids];
    }

    const cacheId = this.getCacheId(missing);
    const openRequest = this.requestCache.get(cacheId);

    if (openRequest) {
      return openRequest;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const newPromise = new Promise((resolve, reject) => {
      const unsubscribe = this.subscribe(
        PostMessageMethods.REQUESTED_ENTITIES,
        (message: RequestedEntitiesMessage) => {
          const messageIds = [
            ...message.entities.map((entity) => entity.sys.id),
            ...(message.missingEntityIds ?? []),
          ];
          if (missing.every((id) => messageIds.includes(id))) {
            clearTimeout(timeout);
            resolve(message.entities);

            this.cleanupPromise(cacheId);
            ids.forEach((id) => this.cleanupPromise(id));

            unsubscribe();
          } else {
            console.warn(
              'Unexpected entities received in REQUESTED_ENTITIES. Ignoring this response.',
            );
          }
        },
      );

      const timeout = setTimeout(() => {
        reject(
          new Error(`Request for entities timed out ${this.timeoutDuration}ms for ${cacheId}`),
        );

        this.cleanupPromise(cacheId);
        ids.forEach((id) => this.cleanupPromise(id));

        unsubscribe();
      }, this.timeoutDuration);

      this.sendMessage(PostMessageMethods.REQUEST_ENTITIES, {
        entityIds: missing,
        entityType: type,
        locale: this.locale,
      });
    });

    this.requestCache.set(cacheId, newPromise);
    ids.forEach((cid) => {
      this.requestCache.set(cid, newPromise);
    });

    const result = (await newPromise) as Array<Entry> | Array<Asset>;

    console.log('PROMISE_RESOLVED', result);

    result.forEach((value) => {
      this.addEntity(value);
    });

    return this.getEntitiesFromMap(type, ids).resolved as Array<Entry> | Array<Asset>;
  }

  public async fetchAsset(id: string, skipCache: boolean = false): Promise<Asset | undefined> {
    try {
      return (await this.fetchAssets([id], skipCache))[0];
    } catch (err) {
      // TODO: move to debug utils once it is extracted
      console.warn(`Failed to request asset ${id}`);
      return undefined;
    }
  }

  public fetchAssets(ids: string[], skipCache: boolean = false): Promise<Asset[]> {
    return this.fetchEntity('Asset', ids, skipCache);
  }

  public async fetchEntry(id: string, skipCache: boolean = false): Promise<Entry | undefined> {
    try {
      return (await this.fetchEntries([id], skipCache))[0];
    } catch (err) {
      // TODO: move to debug utils once it is extracted
      console.warn(`Failed to request entry ${id}`, err);
      return undefined;
    }
  }

  public fetchEntries(ids: string[], skipCache: boolean = false): Promise<Entry[]> {
    return this.fetchEntity('Entry', ids, skipCache);
  }
}
