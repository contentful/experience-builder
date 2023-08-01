import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  LocalizedDataSource,
  IncomingExperienceBuilderEvent,
  OutgoingExperienceBuilderEvent,
  Experience,
  CompositionTree,
  CompositionMode,
  LocalizedUnboundValues,
  ScrollStates,
} from '../types'
import { getDataFromTree, isInsideIframe } from '../utils'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'
import { sendMessage } from '../sendMessage'
import { updateSelectedComponentCoordinates } from '../communication/updateSelectedComponentCoordinates'

interface UseExperienceBuilderProps {
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
  initialMode, // danv: do we need this? Is there a scenario when this will ever be set?
  accessToken,
  initialLocale,
  environmentId,
  spaceId,
  host,
}: UseExperienceBuilderProps) => {
  const [tree, setTree] = useState<CompositionTree>()
  const [dataSource, setDataSource] = useState<LocalizedDataSource>({})
  const [unboundValues, setUnboundValues] = useState<LocalizedUnboundValues>({})
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
    sendMessage(OutgoingExperienceBuilderEvent.CANVAS_RELOAD, {})
    // Wait a moment to ensure that the message was sent
    setTimeout(() => {
      // Received a hot reload message from webpack dev server -> reload the canvas
      window.location.reload()
    }, 50)
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
          updateSelectedComponentCoordinates({ instanceId: selectedNodeId })
          break
        }

        case IncomingExperienceBuilderEvent.COMPONENT_VALUE_CHANGED: {
          /** TODO: at the moment, not sure how to best handle this case.
           * we need to know the variable name, component id, locale
           * should experience builder update the tree and send the updated tree?
           * should we update it here instead of going over the whole tree again?
           * getDataSourceFromTree(tree)
           *
           * Currently experience builder (user_interface) puts default value into dataSource
           * and marks it with `type: UnboundValue`
           *
           * If there has been no defaultValue, then there will be no entry with uuid in dataSource
           *
           */
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
        updateSelectedComponentCoordinates({ instanceId: selectedNodeId })
      }, 150)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timeoutId)
    }
  }, [mode, selectedNodeId, sendMessage, updateSelectedComponentCoordinates])

  const experience: Experience = useMemo(
    () => ({
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
    ]
  )

  return {
    experience,
    locale,
  }
}
