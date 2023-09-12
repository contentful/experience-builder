import type { Asset, Entry, UnresolvedLink, AssetFile } from 'contentful'
import { EntityStore as VisualSdkEntityStore } from '@contentful/visual-sdk'

type EntityStoreArgs = { entities: Array<Entry | Asset>; locale: string }

export class EntityStore extends VisualSdkEntityStore {
  constructor({ entities, locale }: EntityStoreArgs) {
    super({ entities, locale })
  }

  public getValue(
    entityLink: UnresolvedLink<'Entry' | 'Asset'>,
    path: string[]
  ): string | undefined {
    const entity = this.entitiesMap.get(entityLink.sys.id)

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
