import type { Asset, Entry } from 'contentful'
import { Experience, ExternalSDKMode } from '../types'
import { EntityStore } from './EntityStore'
import { isExperienceEntry } from '../typeguards'

type createExperienceArgs = {
  experienceEntry: Entry
  referencedEntries: Array<Entry>
  referencedAssets: Array<Asset>
  locale: string
  mode: ExternalSDKMode
}

export const createExperience = ({
  experienceEntry,
  referencedAssets,
  referencedEntries,
  mode,
  locale,
}: createExperienceArgs): Experience => {
  if (!isExperienceEntry(experienceEntry)) {
    throw new Error('Provided entry is not experience entry')
  }

  const entityStore = new EntityStore({
    experienceEntry,
    entities: [...referencedEntries, ...referencedAssets],
    locale,
  })

  return {
    entityStore,
    mode,
  }
}
