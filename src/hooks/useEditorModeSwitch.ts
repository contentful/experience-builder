import { useEffect, useRef } from 'react'
import { Experience, IncomingExperienceBuilderEvent } from '../types'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'
import { sendConnectedMessage } from '../core/componentRegistry'

export const useEditorModeSwitch = ({
  mode,
  switchToEditorMode,
}: Pick<Experience, 'mode' | 'switchToEditorMode'>) => {
  const hasRenderedAtLeastOnce = useRef(false)

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
    }

    // we wait for one more render to support cases when devs would register components in useEffect
    // without it we will send an array with our default components
    if (hasRenderedAtLeastOnce.current) {
      sendConnectedMessage()
    }

    hasRenderedAtLeastOnce.current = true

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', onMessage)
      }
    }
  }, [mode, switchToEditorMode])
}
