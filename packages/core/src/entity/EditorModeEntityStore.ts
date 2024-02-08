import type { Asset, AssetFile, Entry, UnresolvedLink } from 'contentful';
import { sendMessage } from '../communication/sendMessage';
import { EditorEntityStore } from './EditorEntityStore';
import { RequestedEntitiesMessage } from '../types';
import { parseDataSourcePathIntoFieldset } from '@/utils/schema';
import { get } from '@/utils/get';
import { transformAssetFileToUrl } from './value-transformers';

// The default of 3s in the EditorEntityStore is sometimes timing out and
// leads to not rendering bound content and assemblies.
const REQUEST_TIMEOUT = 10000;

const isLink = (
  entity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset
): entity is UnresolvedLink<'Entry' | 'Asset'> => entity?.sys?.type === 'Link';

export class EditorModeEntityStore extends EditorEntityStore {
  public locale: string;
  constructor({ entities, locale }: { entities: Array<Asset | Entry>; locale: string }) {
    console.debug(
      `[exp-builder.sdk] Initializing editor entity store with ${entities.length} entities for locale ${locale}.`,
      { entities }
    );

    const subscribe = (method: unknown, cb: (payload: RequestedEntitiesMessage) => void) => {
      const handleMessage = (event: MessageEvent) => {
        const data: {
          source: 'composability-app';
          eventType: string;
          payload: RequestedEntitiesMessage;
        } = JSON.parse(event.data);

        if (typeof data !== 'object' || !data) return;

        if (data.source !== 'composability-app') return;
        if (data.eventType === method) {
          cb(data.payload);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('message', handleMessage);
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('message', handleMessage);
        }
      };
    };

    super({ entities, sendMessage, subscribe, locale, timeoutDuration: REQUEST_TIMEOUT });
    this.locale = locale;
  }
  /**
   * This function collects and returns the list of requested entries and assets. Additionally, it checks
   * upfront whether any async fetching logic is actually happening. If not, it returns a plain `false` value, so we
   * can detect this early and avoid unnecessary re-renders.
   * @param entityLinks
   * @returns false if no async fetching is happening, otherwise a promise that resolves when all entities are fetched
   */
  async fetchEntities({
    missingEntryIds,
    missingAssetIds,
    skipCache = false,
  }: {
    missingEntryIds: string[];
    missingAssetIds: string[];
    skipCache?: boolean;
  }) {
    // Entries and assets will be stored in entryMap and assetMap
    await Promise.all([
      this.fetchEntries(missingEntryIds, skipCache),
      this.fetchAssets(missingAssetIds, skipCache),
    ]);
  }

  getMissingEntityIds(entityLinks: UnresolvedLink<'Entry' | 'Asset'>[]) {
    const entryLinks = entityLinks.filter((link) => link.sys?.linkType === 'Entry');
    const assetLinks = entityLinks.filter((link) => link.sys?.linkType === 'Asset');

    const uniqueEntryIds = [...new Set(entryLinks.map((link) => link.sys.id))];
    const uniqueAssetIds = [...new Set(assetLinks.map((link) => link.sys.id))];

    const { missing: missingEntryIds } = this.getEntitiesFromMap('Entry', uniqueEntryIds);
    const { missing: missingAssetIds } = this.getEntitiesFromMap('Asset', uniqueAssetIds);

    return { missingEntryIds, missingAssetIds };
  }

  getValue(
    entityLink: UnresolvedLink<'Entry' | 'Asset'> | undefined,
    path: string[]
  ): string | undefined {
    if (!entityLink || !entityLink.sys) return;

    const fieldValue = super.getValue(entityLink, path);

    // walk around to render asset files
    return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
      ? (fieldValue as AssetFile).url
      : fieldValue;
  }

  public getValueDeep(
    headLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'>,
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
        const [_, field, _localeQualifier] = row;
        if (!entityToResolveFieldsFrom) {
          throw new Error(
            `Logic Error: Cannot resolve field ${field} of a fieldset as there is no entity to resolve it from.`
          );
        }

        if (isLeaf) {
          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          return resolvedFieldset;
        }

        const fieldValue = get<string>(entityToResolveFieldsFrom, ['fields', field]) as
          | UnresolvedLink<'Entry' | 'Asset'>
          | undefined
          | any;

        if (undefined === fieldValue) {
          throw new Error(`Cannot resolve field ${field} of a fieldset as it is not defined.`);
        } else if (isLink(fieldValue)) {
          let entity: Asset | Entry | undefined = this.getEntityFromLink(fieldValue);
          if (entity === undefined) {
            throw new Error(
              `Logic Error: Cannot resolve field ${field} of a fieldset row [${JSON.stringify(
                row
              )}] as the link is broken. ${JSON.stringify({ link: fieldValue })}`
            );
          }

          resolvedFieldset.push([entityToResolveFieldsFrom, field, _localeQualifier]);
          entityToResolveFieldsFrom = entity; // we move up
        } else {
          throw new Error(
            `LogicError: Invalid value of a field we consider a reference field. Cannot resolve field ${field} of a fieldset as it is not a link, neither undefined.`
          );
        }
      }
      return resolvedFieldset;
    };

    const headEntity: Entry | Asset | undefined = isLink(headLinkOrEntity)
      ? this.getEntityFromLink(headLinkOrEntity)
      : headLinkOrEntity;
    if (undefined === headEntity) {
      return;
    }
    const unresolvedFieldset = parseDataSourcePathIntoFieldset(deepPath);
    const resolvedFieldset = resolveFieldset(unresolvedFieldset, headEntity);

    // To get values take last, leaf entity and field
    const [leafEntity, field, _localeQualifier] = resolvedFieldset[resolvedFieldset.length - 1];
    const fieldValue = get<string>(leafEntity, ['fields', field]); // is allowed to be undefined (when non-required field not set; or even when field does NOT exist on the type)
    return transformAssetFileToUrl(fieldValue);
  }
}
