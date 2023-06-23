import { connect, Channel, sendInitMessage } from './channel'
import { IncomingExperienceBuilderEvent } from '../types'

export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  isFulfilled: boolean
}

export function createDeferred<T = unknown>(): Deferred<T> {
  const deferred: Deferred<T> = {
    // @ts-expect-error Immediately set below
    promise: null,

    // @ts-expect-error Promise executor is immdiately executed and sets `resolve`
    resolve: null,

    isFulfilled: false,
  }

  deferred.promise = new Promise<T>((resolve) => {
    deferred.resolve = (...args) => {
      deferred.isFulfilled = true
      resolve(...args)
    }
  })

  return deferred
}

export function createInitializer(currentGlobal: typeof globalThis) {
  if (
    typeof currentGlobal.window === 'undefined' ||
    typeof currentGlobal.document === 'undefined'
  ) {
    // make `init` a noop if window or document is not available
    return () => {}
  }

  const connectDeferred =
    createDeferred<[channel: Channel, message: any, messageQueue: unknown[]]>()

  // We need to connect right away so we can record incoming
  // messages before `init` is called.
  connect(currentGlobal, (...args) => connectDeferred.resolve(args))

  return function init(
    handlers: Record<IncomingExperienceBuilderEvent, any>,
    initCb: (channel: Channel) => any
  ) {
    const initializedChannelPromise = connectDeferred.promise.then(([channel, _, messageQueue]) => {
      Object.entries(handlers).forEach(([method, handler]) => {
        channel.addHandler(method, handler)
      })

      // Handle pending incoming messages.
      // APIs are created before so handlers are already
      // registered on the channel.
      messageQueue.forEach((m) => {
        ;(channel as any)._handleMessage(m)
      })

      return channel
    })

    if (!connectDeferred.isFulfilled) {
      sendInitMessage(currentGlobal)
    }
    initializedChannelPromise.then((channel) => {
      initCb(channel)
    })
  }
}

export const init = createInitializer(globalThis)
