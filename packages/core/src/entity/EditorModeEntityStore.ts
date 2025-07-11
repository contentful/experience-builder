import type { Asset, Entry, UnresolvedLink } from 'contentful';
import { sendMessage } from '../communication/sendMessage';
import { EditorEntityStore } from './EditorEntityStore';
import { RequestedEntitiesMessage } from '../types';
import { get } from '@/utils/get';
import { transformAssetFileToUrl } from './value-transformers';

// The default of 3s in the EditorEntityStore is sometimes timing out and
// leads to not rendering bound content and assemblies.
const REQUEST_TIMEOUT = 10000;

export class EditorModeEntityStore extends EditorEntityStore {
  constructor({ entities, locale }: { entities: Array<Asset | Entry>; locale: string }) {
    console.debug(
      `[experiences-sdk-react] Initializing editor entity store with ${entities.length} entities for locale ${locale}.`,
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
      super.fetchEntries(missingEntryIds, skipCache),
      super.fetchAssets(missingAssetIds, skipCache),
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

  public getValue(
    entityLinkOrEntity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset,
    path: string[],
  ): string | undefined {
    const entity = this.getEntryOrAsset(entityLinkOrEntity, path.join('/'));

    if (!entity) {
      return;
    }

    const fieldValue = get<string>(entity, path);
    return transformAssetFileToUrl(fieldValue);
  }
}
