import type { Asset, Entry, UnresolvedLink, AssetFile, ContentfulClientApi } from 'contentful'
import { EntityStore as VisualSdkEntityStore } from '@contentful/visual-sdk'
import { Composition } from '../types'
import { isExperienceEntry } from '../validation';

type EntityStoreArgs = { experienceEntry: Entry; entities: Array<Entry | Asset>; locale: string }

export class EntityStore extends VisualSdkEntityStore {
  private _experienceEntry: Composition | undefined

  constructor({ experienceEntry, entities, locale }: EntityStoreArgs) {
    super({ entities, locale })

    if (isExperienceEntry(experienceEntry)) {
      this._experienceEntry = experienceEntry.fields;
    } else {
      throw new Error('Invalid experience entry provided');
    }
  }

  public async fetchReferencedEntities({
    client,
  }: {
    client: ContentfulClientApi<undefined>
  }) {
    if (!this._experienceEntry || !super.locale) {
      return
    }

    const entryIds: string[] = [],
      assetIds: string[] = []
    for (const dataBinding of Object.values(this._experienceEntry.dataSource)) {
      if (!('sys' in dataBinding)) {
        continue
      }
      if (dataBinding.sys.linkType === 'Entry') {
        entryIds.push(dataBinding.sys.id)
      }
      if (dataBinding.sys.linkType === 'Asset') {
        assetIds.push(dataBinding.sys.id)
      }
    }

    const [entriesResponse, assetsResponse] = await Promise.all([
      entryIds.length > 0
        ? client.getEntries({ 'sys.id[in]': entryIds, locale: super.locale })
        : { items: [] },
      assetIds.length > 0
        ? client.getAssets({ 'sys.id[in]': assetIds, locale: super.locale })
        : { items: [] },
    ])
    
    const combinedEntities = [...entriesResponse.items, ...assetsResponse.items];
    
    for (const entity of combinedEntities) {
      super.entitiesMap.set(entity.sys.id, entity);
    }

    return combinedEntities;
  }

  public getCurrentLocale() {
    return super.locale
  }

  public switchLocale(locale: string) {
    super.locale = locale
    super.entitiesMap.clear()
  }

  public get experienceEntry() {
    return this._experienceEntry;
  }

  public get schemaVersion() {
    return this._experienceEntry?.componentTree.schemaVersion;
  }

  public get breakpoints() {
    return this._experienceEntry?.componentTree.breakpoints ?? [];
  }

  public get dataSource() {
    return this._experienceEntry?.dataSource ?? {};
  }

  public get unboundValues() {
    return this._experienceEntry?.unboundValues ?? {};
  }

  public getFieldValue(
    entityLink: UnresolvedLink<'Entry' | 'Asset'>,
    path: string[]
  ): string | undefined {
    const entity = super.entitiesMap.get(entityLink.sys.id)

    if (!entity || entity.sys.type !== entityLink.sys.linkType) {
      console.warn(`Experience references unresolved entity: ${JSON.stringify(entityLink)}`)
      return
    }

    const fieldValue = super.getValue(entityLink, path)

    // walk around to render asset files
    return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
      ? (fieldValue as AssetFile).url
      : fieldValue
  }
}
