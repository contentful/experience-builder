import type { Asset, ChainModifiers, Entry, UnresolvedLink } from 'contentful';
import cloneDeep from 'lodash.clonedeep';

import { get } from '../utils/get';
import { isLink } from '../utils/isLink';
import { isDeepPath, parseDataSourcePathIntoFieldset } from '@/utils/pathSchema';
import { isAsset, isEntry } from '@/utils/typeguards';
import { deepFreeze } from '@/utils/freeze';
import { debug } from '@/utils';

export interface EntityFromLink {
  getEntityFromLink(link: UnresolvedLink<'Entry' | 'Asset'>): Asset | Entry | undefined;
}

/**
 * Base Store for entities
 * Can be extended for the different loading behaviours (editor, production, ..)
 */
export abstract class EntityStoreBase implements EntityFromLink {
  /* serialized */ public locale: string;
  /* serialized */ protected entryMap = new Map<string, Entry>();
  /* serialized */ protected assetMap = new Map<string, Asset>();

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

  public getEntryOrAsset(
    linkOrEntryOrAsset: UnresolvedLink<'Entry' | 'Asset'> | Asset | Entry,
    path: string,
  ): Entry | Asset | undefined {
    if (isDeepPath(path)) {
      return this.getDeepEntry(linkOrEntryOrAsset, path);
    }
    let entity: Entry | Asset;

    if (isLink(linkOrEntryOrAsset)) {
      const resolvedEntity =
        linkOrEntryOrAsset.sys.linkType === 'Entry'
          ? this.entryMap.get(linkOrEntryOrAsset.sys.id)
          : this.assetMap.get(linkOrEntryOrAsset.sys.id);
      if (!resolvedEntity || resolvedEntity.sys.type !== linkOrEntryOrAsset.sys.linkType) {
        debug.warn(
          `[experiences-core::EntityStoreBase] Experience references unresolved entity: ${JSON.stringify(linkOrEntryOrAsset)}`,
        );
        return;
      }
      entity = resolvedEntity;
    } else if (isAsset(linkOrEntryOrAsset) || isEntry(linkOrEntryOrAsset)) {
      // We already have the complete entity in preview & delivery (resolved by the CMA client)
      entity = linkOrEntryOrAsset;
    } else {
      throw new Error(
        `[experiences-core::EntityStoreBase] Unexpected object when resolving entity: ${JSON.stringify(linkOrEntryOrAsset)}`,
      );
    }
    return entity;
  }

  /**
   * @deprecated in the base class this should be simply an abstract method
   * @param entityLink
   * @param path
   * @returns
   */
  public getValue(
    entityLink: UnresolvedLink<'Entry' | 'Asset'>,
    path: string[],
  ): string | undefined {
    const entity = this.getEntity(entityLink.sys.linkType, entityLink.sys.id);

    if (!entity) {
      // TODO: move to `debug` utils once it is extracted
      debug.warn(
        `Unresolved entity reference: ${entityLink.sys.linkType} with ID ${entityLink.sys.id}`,
      );
      return;
    }

    return get<string>(entity, path);
  }

  public getEntityFromLink(link: UnresolvedLink<'Entry' | 'Asset'>): Asset | Entry | undefined {
    const resolvedEntity =
      link.sys.linkType === 'Entry'
        ? this.entryMap.get(link.sys.id)
        : this.assetMap.get(link.sys.id);

    if (!resolvedEntity || resolvedEntity.sys.type !== link.sys.linkType) {
      debug.warn(
        `[experiences-core::EntityStoreBase] Experience references unresolved entity: ${JSON.stringify(link)}`,
      );
      return;
    }
    return resolvedEntity;
  }

  public getAssetById(assetId: string): Asset | undefined {
    const asset = this.assetMap.get(assetId);
    if (!asset) {
      debug.warn(
        `[experiences-core::EntityStoreBase] Asset with ID "${assetId}" is not found in the store`,
      );
      return;
    }
    return asset;
  }

  public getEntryById(entryId: string): Entry | undefined {
    const entry = this.entryMap.get(entryId);
    if (!entry) {
      debug.warn(
        `[experiences-core::EntityStoreBase] Entry with ID "${entryId}" is not found in the store`,
      );
      return;
    }
    return entry;
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
    if (isAsset(entity)) {
      // cloned and frozen
      this.assetMap.set(entity.sys.id, deepFreeze(cloneDeep(entity)));
    } else if (isEntry(entity)) {
      // cloned and frozen
      this.entryMap.set(entity.sys.id, deepFreeze(cloneDeep(entity)));
    } else {
      throw new Error(
        `Attempted to add an entity to the store that is neither Asset nor Entry: '${JSON.stringify(entity)}'`,
      );
    }
  }

  public async fetchAsset(id: string): Promise<Asset | undefined> {
    const { resolved, missing } = this.getEntitiesFromMap('Asset', [id]);
    if (missing.length) {
      // TODO: move to `debug` utils once it is extracted
      debug.warn(`[experiences-core::EntityStoreBase] Asset "${id}" is not in the store`);
      return;
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
      debug.warn(`[experiences-core::EntityStoreBase] Entry "${id}" is not in the store`);
      return;
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

  private getDeepEntry(
    linkOrEntryOrAsset: UnresolvedLink<'Entry' | 'Asset'> | Asset | Entry,
    path: string,
  ): Entry | Asset | undefined {
    const resolveFieldset = (
      unresolvedFieldset: Array<[null, string, string?]>,
      headEntry: Entry | Asset,
    ): {
      resolvedFieldset: Array<[Entry | Asset, string, string?]>;
      isFullyResolved: boolean;
      reason?: string;
    } => {
      const resolvedFieldset: Array<[Entry | Asset, string, string?]> = [];
      let entityToResolveFieldsFrom: Entry | Asset = headEntry;
      for (let i = 0; i < unresolvedFieldset.length; i++) {
        const isLeaf = i === unresolvedFieldset.length - 1; // with last row, we are not expecting a link, but a value
        const row = unresolvedFieldset[i];
        const [, field, _localeQualifier] = row;
        if (!entityToResolveFieldsFrom) {
          throw new Error(
            `Logic Error: Cannot resolve field ${field} of a fieldset as there is no entity to resolve it from.`,
          );
        }
        if (isLeaf) {
          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          break;
        }

        const fieldValue = get<string | UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset>(
          entityToResolveFieldsFrom,
          ['fields', field],
        );

        if (undefined === fieldValue) {
          return {
            resolvedFieldset,
            isFullyResolved: false,
            reason: `Cannot resolve field Link<${entityToResolveFieldsFrom.sys.type}>(sys.id=${entityToResolveFieldsFrom.sys.id}).fields[${field}] as field value is not defined`,
          };
        } else if (isLink(fieldValue)) {
          const entity = this.getEntityFromLink(fieldValue);
          if (entity === undefined) {
            return {
              resolvedFieldset,
              isFullyResolved: false,
              reason: `Field reference Link (sys.id=${fieldValue.sys.id}) not found in the EntityStore, waiting...`,
            };
          }
          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          entityToResolveFieldsFrom = entity; // we move up
        } else if (isAsset(fieldValue) || isEntry(fieldValue)) {
          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          entityToResolveFieldsFrom = fieldValue; // we move up
        } else {
          return {
            resolvedFieldset,
            isFullyResolved: false,
            reason: `Deep path points to an invalid field value of type '${typeof fieldValue}' (value=${fieldValue})`,
          };
        }
      }
      return {
        resolvedFieldset,
        isFullyResolved: true,
      };
    };

    const headEntity = isLink(linkOrEntryOrAsset)
      ? this.getEntityFromLink(linkOrEntryOrAsset)
      : (linkOrEntryOrAsset as Entry | Asset);

    if (undefined === headEntity) {
      return;
    }
    const unresolvedFieldset = parseDataSourcePathIntoFieldset(path);

    // The purpose here is to take this intermediate representation of the deep-path
    // and to follow the links to the leaf-entity and field
    // in case we can't follow till the end, we should signal that there was null-reference in the path
    const { resolvedFieldset, isFullyResolved, reason } = resolveFieldset(
      unresolvedFieldset,
      headEntity,
    );

    if (!isFullyResolved) {
      if (reason) {
        debug.log(
          `[experiences-core::EntityStoreBase] Deep path wasn't resolved till leaf node, falling back to undefined, because: ${reason}`,
        );
      }
      return;
    }
    const [leafEntity] = resolvedFieldset[resolvedFieldset.length - 1];
    return leafEntity;
  }

  private getEntity(type: 'Asset' | 'Entry', id: string) {
    if (type === 'Asset') {
      return this.assetMap.get(id);
    }

    return this.entryMap.get(id);
  }

  public toJSON() {
    return {
      entryMap: Object.fromEntries(this.entryMap),
      assetMap: Object.fromEntries(this.assetMap),
      locale: this.locale,
    };
  }
}
