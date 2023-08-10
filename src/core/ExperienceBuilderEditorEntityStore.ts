import { EditorEntityStore, RequestedEntitiesMessage } from '@contentful/visual-sdk'
import { Asset, AssetFile, Entry, UnresolvedLink } from 'contentful'
import { sendMessage } from '../sendMessage'
import { isObject } from 'lodash'
import get from 'lodash.get'

export class ExperienceBuilderEditorEntityStore extends EditorEntityStore {
  constructor({ entities, locale }: { entities: Array<Entry | Asset>, locale: string }) {

    const subscribe = (method: any, cb: any) => {
      const listeners = (event: MessageEvent) => {
        const data: {
          source: 'composability-app'
          eventType: string
          payload: RequestedEntitiesMessage
        } = JSON.parse(event.data)

        if (typeof data !== 'object' || !data) return
        if (data.source !== 'composability-app') return
        if (data.eventType === method) {
          cb(data.payload)
        }
      }

      window.addEventListener('message', listeners)

      return () => window.removeEventListener('message', listeners)
    }

    super({ entities, sendMessage, subscribe, locale })
  }

  async fetchEntities(entityLinks: UnresolvedLink<'Entry' | 'Asset'>[]) {
    const entryLinks = entityLinks.filter((link) => link?.sys?.linkType === 'Entry')
    const assetLinks = entityLinks.filter((link) => link?.sys?.linkType === 'Asset')

    const entries = await this.fetchEntries(entryLinks.map((link) => link.sys.id))
    const assets = await this.fetchAssets(assetLinks.map((link) => link.sys.id))

    return [...entries, ...assets]
  }

  getValue(entityLink: UnresolvedLink<'Entry' | 'Asset'>, path: string[]): string | undefined {
    const fieldValue = super.getValue(entityLink, path)

    // walk around to render asset files
    const value =
      isObject(fieldValue) && (fieldValue as AssetFile).url
        ? (fieldValue as AssetFile).url
        : fieldValue

    return value
  }
}
