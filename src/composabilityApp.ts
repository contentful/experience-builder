import { IncomingExperienceBuilderEvent } from './types'

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
      `Field eventData.source must be equal 'composability-app', actual '${eventData.source}'`
    )
  }

  // check eventData.eventType
  const supportedEventTypes = Object.values(IncomingExperienceBuilderEvent)
  console.log(`supportedEventTypes:`, supportedEventTypes)
  if (!supportedEventTypes.includes(eventData.eventType)) {
    throw new ParseError(
      `Field eventData.eventType must be one of the supported values: [${supportedEventTypes.join(
        ', '
      )}]`
    )
  }

  return eventData
}
