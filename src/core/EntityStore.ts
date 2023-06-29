import { Asset, Entry, UnresolvedLink } from 'contentful'
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
      console.warn(`Composition references unresolved entity: ${entityLink}`)
      return
    }

    return get(entity, path)
  }
}
