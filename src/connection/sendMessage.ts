import { OutgoingExperienceBuilderMessage } from '../types'

// Wrapper around window.postMessage to provide a typed interface and consistent logging
// Don't call this method explicitly but use the sendMessage method from the channel instead
// (only exception: initialisation).
export const sendMessage = (message: OutgoingExperienceBuilderMessage, targetWindow?: Window) => {
  console.debug(`[exp-builder.sdk::sendMessage] send message [${message.eventType}]`)
  const win = targetWindow ?? window.parent
  win?.postMessage(message, '*')
}
