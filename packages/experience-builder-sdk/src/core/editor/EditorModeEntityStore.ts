import { EditorEntityStore, RequestedEntitiesMessage } from '@contentful/visual-sdk';
import type { Asset, AssetFile, Entry, UnresolvedLink } from 'contentful';
import { sendMessage } from '../../communication/sendMessage';

export class EditorModeEntityStore extends EditorEntityStore {
  public locale: string;

  constructor({ entities, locale }: { entities: Array<Entry | Asset>; locale: string }) {
    console.debug(
      `[exp-builder.sdk] Initializing editor entity store with ${entities.length} entities for locale ${locale}.`,
      { entities }
    );
    const subscribe = (method: unknown, cb: (payload: RequestedEntitiesMessage) => void) => {
      const listeners = (event: MessageEvent) => {
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
        window.addEventListener('message', listeners);
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('message', listeners);
        }
      };
    };

    super({ entities, sendMessage, subscribe, locale });
    this.locale = locale;
  }

  /**
   * This function collects and returns the list of requested entries and assets. Additionally, it checks
   * upfront whether any async fetching logic is actually happening. If not, it returns a plain `false` value, so we
   * can detect this early and avoid unnecessary re-renders.
   * @param entityLinks
   * @returns false if no async fetching is happening, otherwise a promise that resolves when all entities are fetched
   */
  fetchEntities(entityLinks: UnresolvedLink<'Entry' | 'Asset'>[]): false | Promise<void> {
    const entryLinks = entityLinks.filter((link) => link.sys?.linkType === 'Entry');
    const assetLinks = entityLinks.filter((link) => link.sys?.linkType === 'Asset');

    const uniqueEntryIds = [...new Set(entryLinks.map((link) => link.sys.id))];
    const uniqueAssetIds = [...new Set(assetLinks.map((link) => link.sys.id))];

    const { missing: missingEntryIds } = this.getEntitiesFromMap('Entry', uniqueEntryIds);
    const { missing: missingAssetIds } = this.getEntitiesFromMap('Asset', uniqueAssetIds);

    // Return false to indicate that no async fetching is happening
    if (!missingAssetIds.length && !missingEntryIds.length) return false;

    // Entries and assets will be stored in entryMap and assetMap
    return Promise.all([this.fetchEntries(uniqueEntryIds), this.fetchAssets(uniqueAssetIds)]).then(
      () => Promise.resolve()
    );
  }

  getValue(
    entityLink: UnresolvedLink<'Entry' | 'Asset'> | undefined,
    path: string[]
  ): string | undefined {
    if (!entityLink) return;

    const fieldValue = super.getValue(entityLink, path);

    // walk around to render asset files
    return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
      ? (fieldValue as AssetFile).url
      : fieldValue;
  }
}
