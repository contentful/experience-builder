import type { Asset, ChainModifiers, Entry, UnresolvedLink } from 'contentful';

import { get } from '../utils/get';
import { isLink } from '../utils/isLink';
import { parseDataSourcePathIntoFieldset } from '@/utils/pathSchema';
import { transformAssetFileToUrl } from './value-transformers';

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

  public getValueDeep(
    headLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'> | Asset | Entry,
    deepPath: string
  ): string | undefined {
    const resolveFieldset = (
      unresolvedFieldset: Array<[null, string, string?]>,
      headEntity: Entry | Asset
    ) => {
      const resolvedFieldset: Array<[Entry | Asset, string, string?]> = [];
      let entityToResolveFieldsFrom: Entry | Asset = headEntity;
      for (let i = 0; i < unresolvedFieldset.length; i++) {
        const isLeaf = i === unresolvedFieldset.length - 1; // with last row, we are not expecting a link, but a value
        const row = unresolvedFieldset[i];
        const [, field, _localeQualifier] = row;
        if (!entityToResolveFieldsFrom) {
          throw new Error(
            `Logic Error: Cannot resolve field ${field} of a fieldset as there is no entity to resolve it from.`
          );
        }
        if (isLeaf) {
          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          break;
        }

        const fieldValue = get<string | UnresolvedLink<'Entry' | 'Asset'>>(
          entityToResolveFieldsFrom,
          ['fields', field]
        );

        if (undefined === fieldValue) {
          return {
            resolvedFieldset,
            isFullyResolved: false,
            reason: `Cannot resolve field ${field} of a fieldset as it is not defined.`,
          };
        } else if (isLink(fieldValue)) {
          const entity: Asset | Entry | undefined = this.getEntityFromLink(fieldValue);
          if (entity === undefined) {
            throw new Error(
              `Logic Error: Cannot resolve field ${field} of a fieldset row [${JSON.stringify(
                row
              )}] as linked entity not found in the EntityStore. ${JSON.stringify({
                link: fieldValue,
              })}`
            );
          }
          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          entityToResolveFieldsFrom = entity; // we move up
        } else {
          // TODO: Eg. when someone changed the schema and the field is not a link anymore, what should we return then?
          throw new Error(
            `LogicError: Invalid value of a field we consider a reference field. Cannot resolve field ${field} of a fieldset as it is not a link, neither undefined.`
          );
        }
      }
      return {
        resolvedFieldset,
        isFullyResolved: true,
      };
    };

    const headEntity = isLink(headLinkOrEntity)
      ? this.getEntityFromLink(headLinkOrEntity)
      : (headLinkOrEntity as Entry | Asset);

    if (undefined === headEntity) {
      return;
    }

    const unresolvedFieldset = parseDataSourcePathIntoFieldset(deepPath);

    // The purpose here is to take this intermediate representation of the deep-path
    // and to follow the links to the leaf-entity and field
    // in case we can't follow till the end, we should signal that there was null-reference in the path
    const { resolvedFieldset, isFullyResolved } = resolveFieldset(unresolvedFieldset, headEntity);
    if (!isFullyResolved) {
      return undefined;
    }
    const [leafEntity, field /* localeQualifier */] = resolvedFieldset[resolvedFieldset.length - 1];
    const fieldValue = get<string>(leafEntity, ['fields', field]); // is allowed to be undefined (when non-required field not set; or even when field does NOT exist on the type)
    return transformAssetFileToUrl(fieldValue);
  }

  /**
   * @deprecated in the base class this should be simply an abstract method
   * @param entityLink
   * @param path
   * @returns
   */
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
