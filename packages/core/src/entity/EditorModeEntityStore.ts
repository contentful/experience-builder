import type { Asset, AssetFile, Entry, UnresolvedLink } from 'contentful';
import { sendMessage } from '../communication/sendMessage';
import { EditorEntityStore } from './EditorEntityStore';
import { RequestedEntitiesMessage } from '../types';
import { get } from '@/utils/get';

// The default of 3s in the EditorEntityStore is sometimes timing out and
// leads to not rendering bound content and assemblies.
const REQUEST_TIMEOUT = 10000;

export class EditorModeEntityStore extends EditorEntityStore {
  public locale: string;

  constructor({ entities, locale }: { entities: Array<Asset | Entry>; locale: string }) {
    console.debug(
      `[exp-builder.sdk] Initializing editor entity store with ${entities.length} entities for locale ${locale}.`,
      { entities },
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

  // public getEntryOrAsset(entityLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset) {
  //   const isLink = (
  //     entity: typeof entityLinkOrEntity,
  //   ): entity is UnresolvedLink<'Entry' | 'Asset'> => entityLinkOrEntity.sys.type === 'Link';

  //   let entity: Entry | Asset;
  //   if (isLink(entityLinkOrEntity)) {
  //     const resolvedEntity =
  //       entityLinkOrEntity.sys.linkType === 'Entry'
  //         ? this.entryMap.get(entityLinkOrEntity.sys.id)
  //         : this.assetMap.get(entityLinkOrEntity.sys.id);

  //     if (!resolvedEntity || resolvedEntity.sys.type !== entityLinkOrEntity.sys.linkType) {
  //       console.warn(
  //         `Experience references unresolved entity: ${JSON.stringify(entityLinkOrEntity)}`,
  //       );
  //       return;
  //     }
  //     entity = resolvedEntity;
  //   } else {
  //     // We already have the complete entity in preview & delivery (resolved by the CMA client)
  //     entity = entityLinkOrEntity;
  //   }
  //   return entity;
  // }

  public getValue(
    entityLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset,
    path: string[],
  ): string | undefined {
    const entity = this.getEntryOrAsset(entityLinkOrEntity);

    if (!entity) {
      return;
    }

    const fieldValue = get<string>(entity, path);

    // walk around to render asset files
    return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
      ? (fieldValue as AssetFile).url
      : fieldValue;
  }
}
