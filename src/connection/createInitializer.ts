/**
 * The logic in this folder is responsible for initializing the connection with main frame and
 * ensuring a stable communication channel.
 * The concept is highly influenced (read: copied) by the App SDK. You can find the original code here:
 * https://github.com/contentful/ui-extensions-sdk/blob/0ff0655135528ae98b4c30017d31b5f232da6eeb/lib/initialize.ts#L5
 */

import { connect, Channel, sendInitMessage, ConnectCallbackParams } from './channel'
import {
  ComponentDefinitionWithComponentType,
  IncomingExperienceBuilderEvent,
  IncomingMessageParams,
} from '../types'

interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  isFulfilled: boolean
}

function createDeferred<T = unknown>(): Deferred<T> {
  const deferred = {
    // Immediately set below
    promise: null as null | Deferred<T>['promise'],
    // Promise executor is immediately executed and sets `resolve`
    resolve: null as null | Deferred<T>['resolve'],
    isFulfilled: false,
  }

  deferred.promise = new Promise<T>((resolve) => {
    deferred.resolve = (...args) => {
      deferred.isFulfilled = true
      resolve(...args)
    }
  })

  return deferred as Deferred<T>
}

export function createInitializer(currentGlobal: typeof globalThis) {
  if (
    typeof currentGlobal.window === 'undefined' ||
    typeof currentGlobal.document === 'undefined'
  ) {
    // make `init` a noop if window or document is not available
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }

  const connectDeferred = createDeferred<ConnectCallbackParams>()

  // Connect right away to record incoming messages that arrive before `init` is called.
  // The callback is called as soon as we receive a COMPOSITION_INIT_SUCCESS from the main frame.
  connect(currentGlobal, (...args) => connectDeferred.resolve(args))

  return function initChannel(
    handlers: Partial<
      Record<IncomingExperienceBuilderEvent, (params: IncomingMessageParams) => void>
    >,
    componentDefinitions: ComponentDefinitionWithComponentType[],
    onConnected: (channel: Channel) => void
  ) {
    // Before triggering the connection, we setup the deferred handler logic
    connectDeferred.promise.then(([channel, params, messageQueue]) => {
      Object.entries(handlers).forEach(([method, handler]) => {
        channel.addHandler(method as IncomingExperienceBuilderEvent, handler)
      })

      // Handle pending incoming messages that were fired before the initialisation finished
      messageQueue?.forEach((message) => {
        channel.handleIncomingMessage(message)
      })

      onConnected(channel)

      // Forward the init_success event to the handlers with the sent params
      handlers[IncomingExperienceBuilderEvent.COMPOSITION_INIT_SUCCESS]?.(params)
    })

    // Send first message to main frame which will respond to establish the connection
    if (!connectDeferred.isFulfilled) {
      sendInitMessage(currentGlobal, componentDefinitions)
    }
  }
}

export const initChannel = createInitializer(globalThis)
