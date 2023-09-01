import { EntityStore } from '@contentful/visual-sdk'
import {
  ContentfulClientApi,
  Entry,
  Asset,
  UnresolvedLink,
  AssetFile,
  createClient,
} from 'contentful'
import { Composition } from '../types'

interface ContentfulEntityStoreProps {
  experienceTypeId: string
  spaceId: string
  environmentId: string
  host?: string
  accessToken: string
  entities: Array<Entry | Asset>
  locale: string
}

export class ContentfulClientEntityStore extends EntityStore {
  private client: ContentfulClientApi<undefined>
  private experienceTypeId: string

  constructor({
    experienceTypeId,
    spaceId,
    environmentId,
    host,
    accessToken,
    entities,
    locale,
  }: ContentfulEntityStoreProps) {
    super({ entities, locale })

    this.experienceTypeId = experienceTypeId
    this.client = createClient({
      space: spaceId,
      environment: environmentId,
      host: host,
      accessToken,
    })
  }

  async fetchAssets(ids: string[]): Promise<Asset[]> {
    if (!ids.length) {
      return []
    }

    const response = await this.client.getAssets({ 'sys.id[in]': ids, locale: this.locale })

    for (const item of response.items) {
      this.entitiesMap.set(item.sys.id, item)
    }

    return response.items
  }

  async fetchEntries(ids: string[]): Promise<Entry[]> {
    if (!ids.length) {
      return []
    }

    const response = await this.client.getEntries({ 'sys.id[in]': ids, locale: this.locale })

    for (const item of response.items) {
      this.entitiesMap.set(item.sys.id, item)
    }

    return response.items
  }

  async fetchComposition(slug: string): Promise<Composition> {
    const response = await this.client.getEntries({
      content_type: this.experienceTypeId,
      'fields.slug': slug,
      locale: this.locale,
    })

    if (response.items.length === 0) {
      throw new Error(`No composition with slug: "${slug}" exists`)
    }

    if (response.items.length > 1) {
      throw new Error(`More than one composition with slug: "${slug}" was found`)
    }

    return response.items[0].fields as unknown as Composition
  }

  getValue(entityLink: UnresolvedLink<'Entry' | 'Asset'>, path: string[]): string | undefined {
    const fieldValue = super.getValue(entityLink, path)

    // walk around to render asset files
    return fieldValue && typeof fieldValue == 'object' && (fieldValue as AssetFile).url
      ? (fieldValue as AssetFile).url
      : fieldValue
  }
}
