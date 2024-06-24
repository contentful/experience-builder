/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingMessage } from '@/types';
import { INCOMING_EVENTS, PostMessageMethods } from '@/constants';

class ParseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const isValidJsonObject = (s: string) => {
  try {
    const result = JSON.parse(s);
    if ('object' !== typeof result) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const doesMismatchMessageSchema = (event: MessageEvent): false | string => {
  try {
    tryParseMessage(event);
    return false;
  } catch (e) {
    if (e instanceof ParseError) {
      return e.message;
    }
    throw e;
  }
};

export const tryParseMessage = (event: MessageEvent): IncomingMessage => {
  if (!event.data) {
    throw new ParseError('Field event.data is missing');
  }
  if ('string' !== typeof event.data) {
    throw new ParseError(`Field event.data must be a string, instead of '${typeof event.data}'`);
  }

  if (!isValidJsonObject(event.data)) {
    throw new ParseError('Field event.data must be a valid JSON object serialized as string');
  }

  const eventData = JSON.parse(event.data);

  if (!eventData.source) {
    throw new ParseError(`Field eventData.source must be equal to 'composability-app'`);
  }

  if ('composability-app' !== eventData.source) {
    throw new ParseError(
      `Field eventData.source must be equal to 'composability-app', instead of '${eventData.source}'`,
    );
  }

  // check eventData.eventType
  const supportedEventTypes = Object.values(INCOMING_EVENTS);
  if (!supportedEventTypes.includes(eventData.eventType)) {
    // Expected message: This message is handled in the EntityStore to store fetched entities
    if (eventData.eventType !== PostMessageMethods.REQUESTED_ENTITIES) {
      throw new ParseError(
        `Field eventData.eventType must be one of the supported values: [${supportedEventTypes.join(
          ', ',
        )}]`,
      );
    }
  }

  return eventData as IncomingMessage;
};

export const validateExperienceBuilderConfig = ({
  locale,
  isEditorMode,
}: {
  locale: string;
  isEditorMode: boolean;
}) => {
  if (isEditorMode) {
    return;
  }

  if (!locale) {
    throw new Error(
      'Parameter "locale" is required for experience builder initialization outside of editor mode',
    );
  }
};
