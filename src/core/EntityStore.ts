import { Asset, Entry, Link, UnresolvedLink } from 'contentful'
import get from 'lodash.get'

export class EntityStore {
  private entities: Array<Entry | Asset>
  private entitiesById: Record<string, Entry | Asset>

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
    console.log(entityLink, path, entity)

    if (!entity) {
      console.warn(`Composition references unresolved entity: ${entityLink}`)
      return
    }

    return get(entity, path)
  }
}
