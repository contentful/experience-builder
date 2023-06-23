import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  CompositionMode,
  CompositionTree,
  Experience,
  IncomingExperienceBuilderEvent,
  LocalizedDataSource,
  OutgoingExperienceBuilderEvent,
} from '../types'
import { init } from './createInitializer'
import { getDataSourceFromTree } from '../utils'
import { Channel } from './channel'
import throttle from 'lodash.throttle'

export interface CompositionContextProps {
  experience: null | Experience
  locale: string | null
  mode: CompositionMode
  channel: Channel | null
}

const CompositionContext = createContext<CompositionContextProps>({
  experience: null,
  locale: null,
  channel: null,
  mode: 'delivery',
})

export const CompositionProvider = ({ children }: PropsWithChildren) => {
  const [isInitialized, setInitialized] = useState(false)
  const [tree, setTree] = useState<CompositionTree>()
  const [dataSource, setDataSource] = useState<LocalizedDataSource>({})
  const [locale, setLocale] = useState<string | undefined>(undefined)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [mode, setMode] = useState<CompositionMode>('delivery')
  const [channel, setChannel] = useState<Channel | null>(null)

  useEffect(() => {
    if (!isInitialized) {
      const handlers = {
        [IncomingExperienceBuilderEvent.COMPOSITION_UPDATED]: (payload: any) => {
          const { tree, locale } = payload
          setTree(tree)
          setLocale(locale)
          setDataSource(getDataSourceFromTree(tree))
        },
        [IncomingExperienceBuilderEvent.SELECTED_COMPONENT_CHANGED]: (payload: any) => {
          const { selectedNodeId } = payload
          setSelectedNodeId(selectedNodeId)
        },
        [IncomingExperienceBuilderEvent.COMPONENT_VALUE_CHANGED]: () => {
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
        },
        [IncomingExperienceBuilderEvent.COMPONENT_DRAGGING_CHANGED]: (payload: any) => {
          const { isDragging } = payload
          setIsDragging(isDragging)
        },
      }
      // @ts-expect-error todo fix me
      init(handlers, (connectedChannel) => {
        setMode('editor')
        setInitialized(true)
        setChannel(connectedChannel)
      })
    }
  }, [])

  useEffect(() => {
    // We only care about this communication when in editor mode
    if (mode !== 'editor') return
    const onMouseMove = throttle((e: MouseEvent) => {
      channel?.send(OutgoingExperienceBuilderEvent.MOUSE_MOVE, {
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
  }, [channel])

  const experience: Experience = useMemo(
    () => ({
      tree,
      dataSource,
      isDragging,
      selectedNodeId,
      config: {},
      mode: mode as CompositionMode,
    }),
    [tree, dataSource, isDragging, selectedNodeId, mode]
  )

  console.log({ experience }, 'in sdk')

  if (!isInitialized || !channel) return null

  return (
    <CompositionContext.Provider
      value={{ experience, locale: null, mode: mode as CompositionMode, channel }}>
      {children}
    </CompositionContext.Provider>
  )
}

export const useCompositionBuilderContext = () => useContext(CompositionContext)
