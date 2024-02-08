import type { Asset, ChainModifiers, Entry, UnresolvedLink } from 'contentful';

import { get } from '../utils/get';

/**
 * Base Store for entities
 * Can be extened for the different loading behaviours (editor, production, ..)
 */
export class EntityStoreBase {
  protected locale: string;
  protected entryMap = new Map<string, Entry>();
  protected assetMap = new Map<string, Asset>();

  constructor({ entities, locale }: { entities: Array<Entry | Asset>; locale: string }) {
    this.locale = locale;

    for (const entity of entities) {
      this.addEntity(entity);
    }
  }

  public get entities() {
    return [...this.entryMap.values(), ...this.assetMap.values()];
  }

  public updateEntity(entity: Entry | Asset) {
    this.addEntity(entity);
  }

  /**
   * Resolves deep path like
   */
  public getValueDeep(
    entityLink: UnresolvedLink<'Entry' | 'Asset'>,
    deepPath: string
  ): string | undefined {
    throw new Error(`Virtual method "getValueDeep" is not implemented`);
  }

  public getValue(
    entityLink: UnresolvedLink<'Entry' | 'Asset'>,
    path: string[]
  ): string | undefined {
    const entity = this.getEntity(entityLink.sys.linkType, entityLink.sys.id);

    if (!entity) {
      // TODO: move to `debug` utils once it is extracted
      console.warn(
        `Unresolved entity reference: ${entityLink.sys.linkType} with ID ${entityLink.sys.id}`
      );
      return;
    }

    return get<string>(entity, path);
  }

  public getEntityFromLink(link: UnresolvedLink<'Entry' | 'Asset'>) {
    const resolvedEntity =
      link.sys.linkType === 'Entry'
        ? this.entryMap.get(link.sys.id)
        : this.assetMap.get(link.sys.id);

    if (!resolvedEntity || resolvedEntity.sys.type !== link.sys.linkType) {
      console.warn(`Experience references unresolved entity: ${JSON.stringify(link)}`);
      return;
    }
    return resolvedEntity;
  }

  protected getEntitiesFromMap(type: 'Entry' | 'Asset', ids: string[]) {
    const resolved: Array<Entry | Asset<ChainModifiers, string>> = [];
    const missing: string[] = [];

    for (const id of ids) {
      const entity = this.getEntity(type, id);
      if (entity) {
        resolved.push(entity);
      } else {
        missing.push(id);
      }
    }

    return {
      resolved,
      missing,
    };
  }

  protected addEntity(entity: Entry | Asset): void {
    if (this.isAsset(entity)) {
      this.assetMap.set(entity.sys.id, entity);
    } else {
      this.entryMap.set(entity.sys.id, entity);
    }
  }

  public async fetchAsset(id: string): Promise<Asset | undefined> {
    const { resolved, missing } = this.getEntitiesFromMap('Asset', [id]);
    if (missing.length) {
      // TODO: move to `debug` utils once it is extracted
      console.warn(`Asset "${id}" is not in the store`);
      return undefined;
    }

    return resolved[0] as Asset;
  }
  public async fetchAssets(ids: string[]): Promise<Asset[]> {
    const { resolved, missing } = this.getEntitiesFromMap('Asset', ids);
    if (missing.length) {
      throw new Error(`Missing assets in the store (${missing.join(',')})`);
    }
    return resolved as Asset[];
  }

  public async fetchEntry(id: string): Promise<Entry | undefined> {
    const { resolved, missing } = this.getEntitiesFromMap('Entry', [id]);
    if (missing.length) {
      // TODO: move to `debug` utils once it is extracted
      console.warn(`Entry "${id}" is not in the store`);
      return undefined;
    }

    return resolved[0] as Entry;
  }

  public async fetchEntries(ids: string[]): Promise<Entry[]> {
    const { resolved, missing } = this.getEntitiesFromMap('Entry', ids);
    if (missing.length) {
      throw new Error(`Missing assets in the store (${missing.join(',')})`);
    }
    return resolved as Entry[];
  }

  private isAsset(entity: Entry | Asset): entity is Asset {
    return entity.sys.type === 'Asset';
  }

  private getEntity(type: 'Asset' | 'Entry', id: string) {
    if (type === 'Asset') {
      return this.assetMap.get(id);
    }

    return this.entryMap.get(id);
  }
}
