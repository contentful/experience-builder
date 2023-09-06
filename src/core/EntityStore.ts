import type { Asset, Entry, UnresolvedLink, AssetFile } from 'contentful'
import { isObject } from 'lodash'
import get from 'lodash.get'

export class EntityStore {
  public entities: Array<Entry | Asset>
  public entitiesById: Record<string, Entry | Asset>

  constructor({ entities }: { entities: Array<Entry | Asset> }) {
    this.entities = entities
    this.entitiesById = entities.reduce((acc: Record<string, Entry | Asset>, entity) => {
      acc[entity.sys.id] = entity
      return acc
    }, {})
  }

  public getValue(
    entityLink: UnresolvedLink<'Entry' | 'Asset'>,
    path: string[]
  ): string | undefined {
    const entity = this.entitiesById[entityLink.sys.id]

    if (!entity || entity.sys.type !== entityLink.sys.linkType) {
      console.warn(`Composition references unresolved entity: ${JSON.stringify(entityLink)}`)
      return
    }

    const fieldValue = get(entity, path)

    // walk around to render asset files
    const value =
      isObject(fieldValue) && (fieldValue as AssetFile).url
        ? (fieldValue as AssetFile).url
        : fieldValue

    return value
  }
}
