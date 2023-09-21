import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CompositionComponentNode,
  CompositionComponentPropValue,
  CompositionDataSource,
  InternalSDKMode,
  CompositionTree,
  CompositionUnboundValues,
  IncomingExperienceBuilderEvent,
  OutgoingExperienceBuilderEvent,
  ScrollStates,
  InternalEvents,
} from '../types'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'
import { sendSelectedComponentCoordinates } from '../communication/sendSelectedComponentCoordinates'
import { getDataFromTree } from '../utils'
import { sendHoveredComponentCoordinates } from '../communication/sendHoveredComponentCoordinates'
import { sendMessage } from '../communication/sendMessage'
import { EditorModeEntityStore } from '../core/EditorModeEntityStore'
import {
  sendConnectedEventWithRegisteredComponents,
  sendRegisteredComponentsMessage,
} from '../core/componentRegistry'

type UseEditorModeProps = {
  initialLocale: string
  mode: InternalSDKMode
}

export const useEditorMode = ({ initialLocale, mode }: UseEditorModeProps) => {
  const hasConnectEventBeenSent = useRef(false)
  const [tree, setTree] = useState<CompositionTree>()
  const [dataSource, setDataSource] = useState<CompositionDataSource>({})
  const [unboundValues, setUnboundValues] = useState<CompositionUnboundValues>({})
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [locale, setLocale] = useState<string>(initialLocale)

  const entityStore = useRef<EditorModeEntityStore>(
    new EditorModeEntityStore({
      entities: [],
      locale: locale,
    })
  )

  const reloadApp = () => {
    sendMessage(OutgoingExperienceBuilderEvent.CANVAS_RELOAD, {})
    // Wait a moment to ensure that the message was sent
    setTimeout(() => {
      // Received a hot reload message from webpack dev server -> reload the canvas
      window.location.reload()
    }, 50)
  }

  // sends component definitions to the web app
  // InternalEvents.COMPONENTS_REGISTERED is triggered by defineComponents function
  useEffect(() => {
    if (!hasConnectEventBeenSent.current) {
      // sending CONNECT but with the registered components now
      sendConnectedEventWithRegisteredComponents()
      hasConnectEventBeenSent.current = true
    }

    const onComponentsRegistered = () => {
      sendRegisteredComponentsMessage()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener(InternalEvents.COMPONENTS_REGISTERED, onComponentsRegistered)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(InternalEvents.COMPONENTS_REGISTERED, onComponentsRegistered)
      }
    }
  }, [])

  useEffect(() => {
    setLocale(initialLocale)
  }, [initialLocale])

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
          const {
            tree,
            locale,
            changedNode,
            changedValueType,
          }: {
            tree: CompositionTree
            locale: string
            changedNode?: CompositionComponentNode
            changedValueType?: CompositionComponentPropValue['type']
          } = payload

          setTree(tree)
          setLocale(locale)

          if (changedNode) {
            /**
             * On single node updates, we want to skip the process of getting the data (datasource and unbound values)
             * from tree. Since we know the updated node, we can skip that recursion everytime the tree updates and
             * just update the relevant data we need from the relevant node.
             *
             * We still update the tree here so we don't have a stale "tree"
             */
            changedValueType === 'BoundValue' &&
              setDataSource((dataSource) => ({ ...dataSource, ...changedNode.data.dataSource }))
            changedValueType === 'UnboundValue' &&
              setUnboundValues((unboundValues) => ({
                ...unboundValues,
                ...changedNode.data.unboundValues,
              }))
          } else {
            const { dataSource, unboundValues } = getDataFromTree(tree)
            setDataSource(dataSource)
            setUnboundValues(unboundValues)
          }
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
        case IncomingExperienceBuilderEvent.UPDATED_ENTITY: {
          const { entity } = payload
          entity && entityStore.current.updateEntity(entity)
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

  return useMemo(
    () => ({
      tree,
      dataSource,
      unboundValues,
      isDragging,
      selectedNodeId,
      locale,
      breakpoints: tree?.root.data.breakpoints ?? [],
      entityStore,
    }),
    [tree, dataSource, unboundValues, isDragging, selectedNodeId, locale]
  )
}
