import { useEffect } from 'react'
import { Experience, IncomingExperienceBuilderEvent } from '../types'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'

export const useEditorModeSwitch = ({
  mode,
  switchToEditorMode,
}: Pick<Experience, 'mode' | 'switchToEditorMode'>) => {
  // switch from preview mode to editor mode
  useEffect(() => {
    if (mode !== 'preview') {
      return
    }

    const onMessage = (event: MessageEvent) => {
      let reason
      if ((reason = doesMismatchMessageSchema(event))) {
        console.warn(
          `[exp-builder.sdk::onMessage] Ignoring alien incoming message from origin [${event.origin}], due to: [${reason}]`,
          event
        )
        return
      }
      const eventData = tryParseMessage(event)

      if (eventData.eventType === IncomingExperienceBuilderEvent.REQUEST_EDITOR_MODE) {
        switchToEditorMode()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', onMessage)
      }
    }
  }, [mode, switchToEditorMode])
}
