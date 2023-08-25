import { useEffect, useMemo, useState } from 'react'

import {
  LocalizedDataSource,
  IncomingExperienceBuilderEvent,
  OutgoingExperienceBuilderEvent,
  Experience,
  CompositionTree,
  CompositionMode,
  LocalizedUnboundValues,
  ScrollStates,
  CompositionDataSource,
  CompositionUnboundValues,
} from '../types'
import { getDataFromTree, isInsideIframe } from '../utils'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'
import { sendMessage } from '../sendMessage'
import { sendSelectedComponentCoordinates } from '../communication/sendSelectedComponentCoordinates'
import { sendHoveredComponentCoordinates } from '../communication/sendHoveredComponentCoordinates'

interface UseExperienceBuilderProps {
  experienceTypeId: string
  /** The mode is automatically set, use this value to manually override this **/
  initialMode?: CompositionMode
  /** Use CDA token for delivery mode and CPA for preview mode
   * When rendered in the editor a token is not needed **/
  accessToken?: string
  /** The defined locale,
   *  when rendered in the editor, the locale is set from the editor, but you can use this to overwrite this **/
  initialLocale?: string
  /** The source spaceId,
   *  when rendered in the editor, the id is set from the editor **/
  spaceId?: string
  /** The source environmentId,
   *  when rendered in the editor, the id is set from the editor **/
  environmentId?: string
  /** The contentful host to be used.
   * Defaults to 'cdn.contentful.com' for delivery mode and 'preview.contentful.com' for preview mode **/
  host?: string
}

export const useExperienceBuilder = ({
  experienceTypeId,
  initialMode, // danv: do we need this? Is there a scenario when this will ever be set?
  accessToken,
  initialLocale,
  environmentId,
  spaceId,
  host,
}: UseExperienceBuilderProps) => {
  const [tree, setTree] = useState<CompositionTree>()
  const [dataSource, setDataSource] = useState<CompositionDataSource>({})
  const [unboundValues, setUnboundValues] = useState<CompositionUnboundValues>({})
  const [locale, setLocale] = useState<string | undefined>(initialLocale)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [mode, setMode] = useState<CompositionMode | undefined>(() => {
    if (initialMode) return initialMode

    if (isInsideIframe()) {
      return 'editor'
    } else {
      const urlParams = new URLSearchParams(window.location.search)
      const isPreview = urlParams.get('isPreview')
      return isPreview ? 'preview' : 'delivery'
    }
  })

  const defaultHost = mode === 'preview' ? 'preview.contentful.com' : 'cdn.contentful.com'

  const reloadApp = () => {
    // Triggers the host application to reload the iframe
    sendMessage(OutgoingExperienceBuilderEvent.CANVAS_RELOAD, {})
  }

  useEffect(() => {
    // We only care about this communication when in editor mode
    if (mode !== 'editor') return
    const onMessage = (event: MessageEvent) => {
      let reason
      if ((reason = doesMismatchMessageSchema(event))) {
        if (
          event.origin.startsWith('http://localhost') &&
          `${event.data}`.includes('webpackHotUpdate')
        ) {
          reloadApp()
        } else {
          console.warn(
            `[exp-builder.sdk::onMessage] Ignoring alien incoming message from origin [${event.origin}], due to: [${reason}]`,
            event
          )
        }
        return
      }

      const eventData = tryParseMessage(event)

      console.debug(
        `[exp-builder.sdk::onMessage] Received message [${eventData.eventType}]`,
        eventData
      )

      const { payload } = eventData

      switch (eventData.eventType) {
        case IncomingExperienceBuilderEvent.COMPOSITION_UPDATED: {
          const { tree, locale } = payload
          const { dataSource, unboundValues } = getDataFromTree(tree)

          setTree(tree)
          setLocale(locale)
          setDataSource(dataSource)
          setUnboundValues(unboundValues)
          break
        }
        case IncomingExperienceBuilderEvent.SELECTED_COMPONENT_CHANGED: {
          const { selectedNodeId } = payload

          setSelectedNodeId(selectedNodeId)
          break
        }
        case IncomingExperienceBuilderEvent.CANVAS_RESIZED:
        case IncomingExperienceBuilderEvent.SELECT_COMPONENT: {
          const { selectedNodeId } = payload
          sendSelectedComponentCoordinates(selectedNodeId)
          break
        }
        case IncomingExperienceBuilderEvent.HOVER_COMPONENT: {
          const { hoveredNodeId } = payload
          sendHoveredComponentCoordinates(hoveredNodeId)
          break
        }
        case IncomingExperienceBuilderEvent.COMPONENT_DRAGGING_CHANGED: {
          const { isDragging } = payload
          setIsDragging(isDragging)
          break
        }
        default:
          console.error(
            `[exp-builder.sdk::onMessage] Logic error, unsupported eventType: [${eventData.eventType}]`
          )
      }
    }

    window.addEventListener('message', onMessage)

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [mode])

  /*
   * Handles on scroll business
   */
  useEffect(() => {
    // We only care about this communication when in editor mode
    if (mode !== 'editor') return
    let timeoutId = 0
    let isScrolling = false

    const onScroll = () => {
      if (isScrolling === false) {
        sendMessage(OutgoingExperienceBuilderEvent.CANVAS_SCROLL, ScrollStates.SCROLL_START)
      }

      sendMessage(OutgoingExperienceBuilderEvent.CANVAS_SCROLL, ScrollStates.IS_SCROLLING)
      isScrolling = true

      clearTimeout(timeoutId)

      timeoutId = window.setTimeout(() => {
        if (isScrolling === false) {
          return
        }

        isScrolling = false
        sendMessage(OutgoingExperienceBuilderEvent.CANVAS_SCROLL, ScrollStates.SCROLL_END)

        /**
         * On scroll end, send new co-ordinates of selected node
         */
        sendSelectedComponentCoordinates(selectedNodeId)
      }, 150)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timeoutId)
    }
  }, [mode, selectedNodeId])

  const experience: Experience = useMemo(
    () => ({
      experienceTypeId,
      tree,
      dataSource,
      unboundValues,
      isDragging,
      selectedNodeId,
      config: { accessToken, locale, environmentId, spaceId, host: host || defaultHost },
      mode: mode as CompositionMode,
      breakpoints: tree?.root.data.breakpoints ?? [],
    }),
    [
      tree,
      dataSource,
      unboundValues,
      isDragging,
      selectedNodeId,
      accessToken,
      locale,
      environmentId,
      spaceId,
      host,
      defaultHost,
      mode,
      experienceTypeId,
    ]
  )

  return {
    experience,
    locale,
  }
}
