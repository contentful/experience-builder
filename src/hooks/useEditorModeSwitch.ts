import { useEffect, useRef } from 'react'
import {
  Experience,
  IncomingExperienceBuilderEvent,
  OutgoingExperienceBuilderEvent,
} from '../types'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'
import { sendMessage } from '../communication/sendMessage'

export const useEditorModeSwitch = ({
  mode,
  switchToEditorMode,
}: Pick<Experience, 'mode' | 'switchToEditorMode'>) => {
  const hasConnectEventBeenSent = useRef(false)

  // switch from preview mode to editor mode
  useEffect(() => {
    if (mode !== 'preview') {
      return
    }

    const onMessage = (event: MessageEvent) => {
      if (doesMismatchMessageSchema(event)) {
        return
      }
      const eventData = tryParseMessage(event)

      if (eventData.eventType === IncomingExperienceBuilderEvent.REQUEST_EDITOR_MODE) {
        switchToEditorMode()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('message', onMessage)

      if (!hasConnectEventBeenSent.current) {
        sendMessage(OutgoingExperienceBuilderEvent.CONNECTED)
        hasConnectEventBeenSent.current = true
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', onMessage)
      }
    }
  }, [mode, switchToEditorMode])
}
