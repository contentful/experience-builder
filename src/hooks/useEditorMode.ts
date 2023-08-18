import { useEffect, useMemo, useState } from 'react'
import {
  CompositionDataSource,
  CompositionTree,
  CompositionUnboundValues,
  ExperienceBuilderSettings,
  IncomingExperienceBuilderEvent,
  OutgoingExperienceBuilderEvent,
  ScrollStates,
} from '../types'
import { sendMessage } from '../sendMessage'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'
import { sendSelectedComponentCoordinates } from '../communication/sendSelectedComponentCoordinates'
import { getDataFromTree } from '../utils'
import { sendHoveredComponentCoordinates } from '../communication/sendHoveredComponentCoordinates'

export const useEditorMode = (settings: ExperienceBuilderSettings) => {
  const [tree, setTree] = useState<CompositionTree>()
  const [dataSource, setDataSource] = useState<CompositionDataSource>({})
  const [unboundValues, setUnboundValues] = useState<CompositionUnboundValues>({})
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')

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
    if (settings.mode !== 'editor') return
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
          settings.setLocale(locale)
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
  }, [settings])

  /*
   * Handles on scroll business
   */
  useEffect(() => {
    // We only care about this communication when in editor mode
    if (settings.mode !== 'editor') return
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
  }, [settings.mode, selectedNodeId])

  return useMemo(
    () => ({
      tree,
      dataSource,
      unboundValues,
      isDragging,
      selectedNodeId,
      breakpoints: tree?.root.data.breakpoints ?? [],
    }),
    [tree, dataSource, unboundValues, isDragging, selectedNodeId]
  )
}
