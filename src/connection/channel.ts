import {
  ComponentDefinitionWithComponentType,
  IncomingExperienceBuilderEvent,
  IncomingExperienceBuilderMessage,
  IncomingMessageParams,
  InitMessageParams,
  InitSuccessMessageParams,
  OutgoingExperienceBuilderEvent,
  OutgoingExperienceBuilderMessage,
  OutgoingMessageParams,
} from '../types'
import { sendMessage } from './sendMessage'
import { Signal } from './signal'

export type ConnectCallbackParams = [
  channel: Channel,
  params: InitSuccessMessageParams,
  messageQueue?: IncomingExperienceBuilderMessage[]
]

export function connect(
  currentGlobal: typeof globalThis,
  onConnect: (...args: ConnectCallbackParams) => void
) {
  currentGlobal.addEventListener('message', listener)
  function listener(event: MessageEvent<IncomingExperienceBuilderMessage>) {
    const message = event.data
    if (message?.eventType === IncomingExperienceBuilderEvent.COMPOSITION_INIT_SUCCESS) {
      const params = message.payload.params as InitSuccessMessageParams
      const channel = new Channel(params.sourceId, currentGlobal)
      currentGlobal.removeEventListener('message', listener)
      onConnect(channel, params, message.payload.messageQueue)
    }
  }
}

/**
 * This class is responsible for sending and receiving messages via the
 * `postMessage` API. It will add a unique message ID and a source ID to each message.
 */
export class Channel {
  private _sourceId: string
  private _targetWindow: Window
  private _messageHandlers: Partial<
    Record<IncomingExperienceBuilderEvent, Signal<[IncomingMessageParams]>>
  > = {}

  constructor(sourceId: string, currentGlobal: typeof globalThis) {
    this._sourceId = sourceId
    this._targetWindow = currentGlobal.parent

    currentGlobal.addEventListener(
      'message',
      (event: MessageEvent<IncomingExperienceBuilderMessage>) => {
        // When in editor mode and we receive a hot reload message, reload the canvas and the page
        if (
          event.origin.startsWith('http://localhost') &&
          `${event.data}`.includes('webpackHotUpdate')
        ) {
          // Wait for a short amount of time to ensure that the new update is ready/ loading
          setTimeout(() => {
            // Received a hot reload message from webpack dev server -> reload the canvas
            window.location.reload()
          }, 100)
          return
        }
        this.handleIncomingMessage(event.data)
      }
    )
  }

  handleIncomingMessage = (message: IncomingExperienceBuilderMessage | undefined) => {
    if (message?.eventType) {
      const handlers = this._messageHandlers[message.eventType]
      if (handlers) {
        console.debug(
          `[exp-builder.sdk::onMessage] Received message [${message.eventType}]`,
          message
        )
        handlers.dispatch(message.payload.params)
      } else {
        console.error(
          `[exp-builder.sdk::onMessage] Logic error, unsupported eventType: [${message.eventType}]`
        )
      }
    }
  }

  send(eventType: OutgoingExperienceBuilderEvent, params: OutgoingMessageParams = undefined) {
    const messageId = `${sentMessageCount++}`
    const message: OutgoingExperienceBuilderMessage = {
      sourceId: this._sourceId,
      messageId,
      eventType,
      payload: {
        params,
      },
    }
    sendMessage(message, this._targetWindow)
  }

  addHandler(
    method: IncomingExperienceBuilderEvent,
    handler: (params: IncomingMessageParams) => void
  ) {
    if (!(method in this._messageHandlers)) {
      this._messageHandlers[method] = new Signal()
    }
    return (this._messageHandlers[method] as Signal<[IncomingMessageParams]>).attach(handler)
  }
}

// Store the message count globally, so we have one singleton to create unique message IDs
let sentMessageCount = 0

// This is sent upfront before the Channel is initialized since there is no source ID
// yet available
export function sendInitMessage(
  currentGlobal: typeof globalThis,
  params: ComponentDefinitionWithComponentType[]
) {
  const messageId = `${sentMessageCount++}`
  const targetWindow = currentGlobal.parent
  const componentDefinitions = params.map((definition) => definition.componentDefinition)
  const message: OutgoingExperienceBuilderMessage = {
    messageId,
    eventType: OutgoingExperienceBuilderEvent.COMPOSITION_INIT,
    payload: {
      params: {
        componentDefinitions,
      } as InitMessageParams,
    },
  }
  // The canvas is not connected yet, send an init event (without a source ID) and
  // wait for an init_success response from the main frame
  sendMessage(message, targetWindow)
}
