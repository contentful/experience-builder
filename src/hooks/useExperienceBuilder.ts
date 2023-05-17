import { useEffect, useState } from 'react'
import throttle from 'lodash.throttle'
import type { PlainClientAPI } from 'contentful-management'
import {
  BindingMapByBlockId,
  BoundData,
  IncomingExperienceBuilderEvent,
  OutcomingExperienceBuilderEvent,
} from '../types'
import { useCommunication } from './useCommunication'
import { CONTENTFUL_WEB_APP_ORIGIN } from '../constants'

type VisualEditorMessagePayload = {
  source: string
  eventType: IncomingExperienceBuilderEvent
  payload: any
}

type UseExperienceBuilderProps = {
  cma: PlainClientAPI
}

const getAppOrigins = () => {
  if (typeof process.env !== 'undefined') {
    if (process.env?.REACT_APP_EXPERIENCE_BUILDER_ORIGIN) {
      return [process.env.REACT_APP_EXPERIENCE_BUILDER_ORIGIN]
    }
  }
  return [CONTENTFUL_WEB_APP_ORIGIN]
}

export const useExperienceBuilder = ({ cma }: UseExperienceBuilderProps) => {
  const [tree, setTree] = useState({})
  const [binding, setBinding] = useState<BindingMapByBlockId>({})
  const [boundData, setBoundData] = useState<BoundData>({})

  const { sendMessage } = useCommunication()

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // makes sure that the message originates from contentful web app
      if (!getAppOrigins().includes(event.origin)) {
        return
      }

      // @ts-expect-error not typed
      let eventData: VisualEditorMessagePayload = {}
      try {
        if (event.data && typeof event.data === 'string') {
          eventData = JSON.parse(event.data)
        }
      } catch (e) {
        console.log('event data caused error', event.data)
      }
      console.log('customer app received message', eventData)

      if (eventData.source === 'composability-app') {
        const { payload } = eventData

        switch (eventData.eventType) {
          case IncomingExperienceBuilderEvent.COMPOSITION_UPDATED: {
            const { tree, binding = {} } = payload
            setTree(tree)
            setBinding(binding)
            break
          }
          case IncomingExperienceBuilderEvent.COMPONENT_VALUE_CHANGED: {
            const { boundData = {}, binding = {} } = payload
            setBinding(binding)
            setBoundData(boundData)
            break
          }
          default:
        }
      }
    }

    window.addEventListener('message', onMessage)

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  useEffect(() => {
    const onMouseMove = throttle((e: MouseEvent) => {
      sendMessage(OutcomingExperienceBuilderEvent.MOUSE_MOVE, {
        pageX: e.pageX,
        pageY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
      })
    }, 20)

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [sendMessage])

  return {
    tree,
    binding,
    boundData,
  }
}
