import type { Asset, ChainModifiers, Entry, UnresolvedLink } from 'contentful';

import { get } from '../utils/get';
import { isLink } from '../utils/isLink';
import { parseDataSourcePathIntoFieldset } from '@/utils/pathSchema';
import { transformAssetFileToUrl } from '../entity/value-transformers';
import { EntityStoreBase } from '..';

export class ValueService {
  private entityStore: EntityStoreBase;
  constructor({ entityStore }: { entityStore: EntityStoreBase }) {
    this.entityStore = entityStore;
  }

  public getValueDeep(
    headLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'> | Asset | Entry,
    deepPath: string,
  ): string | undefined {
    const resolveFieldset = (
      unresolvedFieldset: Array<[null, string, string?]>,
      headEntity: Entry | Asset,
    ) => {
      const resolvedFieldset: Array<[Entry | Asset, string, string?]> = [];
      let entityToResolveFieldsFrom: Entry | Asset = headEntity;
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

        const fieldValue = get<string | UnresolvedLink<'Entry' | 'Asset'>>(
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
          const entity = this.entityStore.getEntityFromLink(fieldValue);
          if (entity === undefined) {
            throw new Error(
              `Logic Error: Broken Precondition [by the time resolution of deep path happens all referents should be in EntityStore]: Cannot resolve field ${field} of a fieldset row [${JSON.stringify(
                row,
              )}] as linked entity not found in the EntityStore. ${JSON.stringify({
                link: fieldValue,
              })}`,
            );
          }
          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          entityToResolveFieldsFrom = entity; // we move up
        } else {
          // TODO: Eg. when someone changed the schema and the field is not a link anymore, what should we return then?
          throw new Error(
            `LogicError: Invalid value of a field we consider a reference field. Cannot resolve field ${field} of a fieldset as it is not a link, neither undefined.`,
          );
        }
      }
      return {
        resolvedFieldset,
        isFullyResolved: true,
      };
    };

    const headEntity = isLink(headLinkOrEntity)
      ? this.entityStore.getEntityFromLink(headLinkOrEntity)
      : (headLinkOrEntity as Entry | Asset);

    if (undefined === headEntity) {
      return;
    }

    const unresolvedFieldset = parseDataSourcePathIntoFieldset(deepPath);

    // The purpose here is to take this intermediate representation of the deep-path
    // and to follow the links to the leaf-entity and field
    // in case we can't follow till the end, we should signal that there was null-reference in the path
    const { resolvedFieldset, isFullyResolved, reason } = resolveFieldset(
      unresolvedFieldset,
      headEntity,
    );
    if (!isFullyResolved) {
      reason &&
        console.debug(
          `[exp-builder.sdk::EntityStoreBased::getValueDeep()] Deep path wasn't resolved till leaf node, falling back to undefined, because: ${reason}`,
        );
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
    path: string[],
  ): string | undefined {
    const entity = this.entityStore.getEntity(entityLink.sys.linkType, entityLink.sys.id);

    if (!entity) {
      // TODO: move to `debug` utils once it is extracted
      console.warn(
        `Unresolved entity reference: ${entityLink.sys.linkType} with ID ${entityLink.sys.id}`,
      );
      return;
    }

    return get<string>(entity, path);
  }
}
