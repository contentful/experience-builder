import type { Entry } from 'contentful'
import { supportedModes } from './constants'
import { InternalSDKMode, IncomingExperienceBuilderEvent, ExperienceEntry } from './types'

export type VisualEditorMessagePayload = {
  source: string
  eventType: IncomingExperienceBuilderEvent
  payload: any
}

class ParseError extends Error {
  constructor(message: string) {
    super(message)
  }
}

const isValidJsonObject = (s: string) => {
  try {
    const result = JSON.parse(s)
    if ('object' !== typeof result) {
      return false
    }
    return true
  } catch (e) {
    return false
  }
}

// @ts-expect-error type incompatibility
export const isExperienceEntry = (entry: Entry): entry is ExperienceEntry => {
  return (
    entry.sys.type === 'Entry' &&
    !!entry.fields.title &&
    !!entry.fields.slug &&
    !!entry.fields.componentTree &&
    // @ts-expect-error type incompatibility due to conditional types in Entry
    Array.isArray(entry.fields.componentTree.breakpoints) &&
    // @ts-expect-error type incompatibility due to conditional types in Entry
    Array.isArray(entry.fields.componentTree.children) &&
    // @ts-expect-error type incompatibility due to conditional types in Entry
    typeof entry.fields.componentTree.schemaVersion === 'string' &&
    !!entry.fields.dataSource &&
    !!entry.fields.unboundValues
  )
}

export const doesMismatchMessageSchema = (event: MessageEvent): false | string => {
  try {
    tryParseMessage(event)
    return false
  } catch (e) {
    if (e instanceof ParseError) {
      return e.message
    }
    throw e
  }
}

export const tryParseMessage = (event: MessageEvent): VisualEditorMessagePayload => {
  if (!event.data) {
    throw new ParseError('Field event.data is missing')
  }
  if ('string' !== typeof event.data) {
    throw new ParseError(`Field event.data must be a string, instead of '${typeof event.data}'`)
  }

  if (!isValidJsonObject(event.data)) {
    throw new ParseError('Field event.data must be a valid JSON object serialized as string')
  }

  const eventData = JSON.parse(event.data)

  if (!eventData.source) {
    throw new ParseError(`Field eventData.source must be equal to 'composability-app'`)
  }

  if ('composability-app' !== eventData.source) {
    throw new ParseError(
      `Field eventData.source must be equal to 'composability-app', instead of '${eventData.source}'`
    )
  }

  // check eventData.eventType
  const supportedEventTypes = Object.values(IncomingExperienceBuilderEvent)
  if (!supportedEventTypes.includes(eventData.eventType)) {
    throw new ParseError(
      `Field eventData.eventType must be one of the supported values: [${supportedEventTypes.join(
        ', '
      )}]`
    )
  }

  return eventData
}

export const validateExperienceBuilderConfig = ({
  locale,
  mode,
}: {
  locale: string
  mode: InternalSDKMode
}) => {
  if (mode === 'editor') {
    return
  }

  if (!supportedModes.includes(mode)) {
    throw new Error(
      `Parameter "mode" contains unsupported value. Supported modes: ${supportedModes.join(',')}`
    )
  }

  if (!locale) {
    throw new Error(
      'Parameter "locale" is required for expereince builder initialization outside of editor mode'
    )
  }
}
