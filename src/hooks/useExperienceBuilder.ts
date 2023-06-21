import { useEffect, useMemo, useState } from 'react'
import throttle from 'lodash.throttle'
import {
  LocalizedDataSource,
  IncomingExperienceBuilderEvent,
  OutgoingExperienceBuilderEvent,
  Experience,
  CompositionTree,
  CompositionMode,
} from '../types'
import { useCommunication } from './useCommunication'
import { getDataSourceFromTree } from '../utils'
import { doesMismatchMessageSchema, tryParseMessage } from '../validation'

type UseExperienceBuilderProps = { initialMode?: CompositionMode }

export const useExperienceBuilder = ({ initialMode }: UseExperienceBuilderProps) => {
  const [tree, setTree] = useState<CompositionTree>()
  const [dataSource, setDataSource] = useState<LocalizedDataSource>({})
  const [locale, setLocale] = useState<string>()
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [mode, setMode] = useState<CompositionMode | undefined>(initialMode)

  const { sendMessage } = useCommunication()

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
          setTree(tree)
          setLocale(locale)
          setDataSource(getDataSourceFromTree(tree))
          break
        }
        case IncomingExperienceBuilderEvent.SELECTED_COMPONENT_CHANGED: {
          const { selectedNodeId } = payload
          setSelectedNodeId(selectedNodeId)
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

  useEffect(() => {
    // We only care about this communication when in editor mode
    if (mode !== 'editor') return
    const onMouseMove = throttle((e: MouseEvent) => {
      sendMessage(OutgoingExperienceBuilderEvent.MOUSE_MOVE, {
        clientX: e.clientX,
        clientY: e.clientY,
      })
    }, 20)

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [sendMessage])

  const experience: Experience = useMemo(
    () => ({
      tree,
      dataSource,
      isDragging,
      selectedNodeId,
      mode,
    }),
    [tree, dataSource, isDragging, selectedNodeId]
  )

  return {
    experience,
    locale,
  }
}
