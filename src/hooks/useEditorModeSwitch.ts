import { useEffect, useRef } from 'react'
import {
  IncomingExperienceBuilderEvent,
  InternalSDKMode,
  OutgoingExperienceBuilderEvent,
} from '../types'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'
import { sendMessage } from '../communication/sendMessage'

export const useEditorModeSwitch = ({
  mode,
  switchToEditorMode,
}: {
  mode: InternalSDKMode
  switchToEditorMode: () => void
}) => {
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
