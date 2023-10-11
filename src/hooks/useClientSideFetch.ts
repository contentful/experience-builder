import type { ContentfulClientApi } from "contentful"
import { useCallback, useState } from "react"
import { Experience } from "../types"
import { EntityStore } from "../core/EntityStore"

const errorMessagesWhileFetching = {
  experience: 'Failed to fetch experience',
  experienceReferences: 'Failed to fetch entities, referenced in experience',
}

const handleError = (generalMessage: string, error: unknown) => {
  const message = error instanceof Error ? error.message : `Unknown error: ${error}`
  console.error(`${generalMessage} with error: ${message}`)
}

export const useClientSideFetch = ({ setEntityStore }: { setEntityStore: Experience['setEntityStore'] }) => {
  const [isFetching, setIsFetching] = useState(false);
  /**
   * Fetch experience entry using slug as the identifier
   * @param {string} experienceTypeId - id of the content type associated with the experience
   * @param {string} slug - slug of the experience (defined in entry settings)
   * @param {string} localeCode - locale code to fetch the experience. Falls back to the currently active locale in the state
   */
  const fetchBySlug = useCallback(async ({
    client,
    experienceTypeId,
    slug,
    localeCode,
  }: {
    client: ContentfulClientApi<undefined>
    experienceTypeId: string
    slug: string
    localeCode: string
  }) => {
    if (!experienceTypeId) {
      const error = new Error('Preview and delivery mode requires experienceTypeId to be provided')
      handleError(errorMessagesWhileFetching.experience, error)
      return {
        success: false,
        error,
      }
    }

    if (!slug) {
      const error = new Error(
        'Preview and delivery mode requires a composition slug to be provided'
      )
      handleError(errorMessagesWhileFetching.experience, error)
      return {
        success: false,
        error,
      }
    }

    if (!localeCode) {
      const error = new Error('Preview and delivery mode requires a locale code to be provided')
      handleError(errorMessagesWhileFetching.experience, error)
      return {
        success: false,
        error,
      }
    }

    setIsFetching(true)

    try {
      const response = await client.getEntries({
        content_type: experienceTypeId,
        'fields.slug': slug,
        locale: localeCode,
      })
      if (response.items.length === 0) {
        const error = new Error(`No experience with slug: ${slug} exists`)
        handleError(errorMessagesWhileFetching.experience, error)

        return {
          success: false,
          error,
        }
      }
      if (response.items.length > 1) {
        const error = new Error(`More than one experience with slug: ${slug} was found`)
        handleError(errorMessagesWhileFetching.experience, error)
        return {
          success: false,
          error,
        }
      }
      const experienceEntry = response.items[0]
      const entityStore = new EntityStore({ experienceEntry, locale: localeCode, entities: [] })
      setEntityStore(entityStore);

      await entityStore.fetchReferencedEntities({ client });
      return {
        success: true,
      }
    } catch (e: any) {
      handleError(errorMessagesWhileFetching.experience, e)
      return {
        success: false,
        error: e,
      }
    } finally {
      setIsFetching(false)
    }
  }, [setEntityStore])

  return {
    fetchBySlug,
    isFetching
  }
}
