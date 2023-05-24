import { useEffect, useMemo, useState } from 'react'
import throttle from 'lodash.throttle'
import {
  LocalizedDataSource,
  IncomingExperienceBuilderEvent,
  OutgoingExperienceBuilderEvent,
  Experience,
  Tree,
} from '../types'
import { useCommunication } from './useCommunication'
import { CONTENTFUL_WEB_APP_ORIGIN } from '../constants'
import { getDataSourceFromTree } from '../utils'

type VisualEditorMessagePayload = {
  source: string
  eventType: IncomingExperienceBuilderEvent
  payload: any
}

const getAppOrigins = () => {
  if (typeof process.env !== 'undefined') {
    if (process.env?.REACT_APP_EXPERIENCE_BUILDER_ORIGIN) {
      return [process.env.REACT_APP_EXPERIENCE_BUILDER_ORIGIN]
    }
  }
  return [CONTENTFUL_WEB_APP_ORIGIN]
}

export const useExperienceBuilder = () => {
  const [tree, setTree] = useState<Tree>()
  const [dataSource, setDataSource] = useState<LocalizedDataSource>({})
  const [locale, setLocale] = useState<string>()

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
            const { tree, locale } = payload
            setTree(tree)
            setLocale(locale)
            setDataSource(getDataSourceFromTree(tree))
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
      sendMessage(OutgoingExperienceBuilderEvent.MOUSE_MOVE, {
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

  const experience: Experience = useMemo(
    () => ({
      tree,
      dataSource,
    }),
    [tree, dataSource]
  )

  return {
    experience,
    locale,
  }
}
