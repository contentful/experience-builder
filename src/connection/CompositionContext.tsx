import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ComponentDefinitionWithComponentType,
  CompositionMode,
  CompositionTree,
  Experience,
  IncomingExperienceBuilderEvent,
  IncomingMessageParams,
  InitSuccessMessageParams,
  LocalizedDataSource,
  OutgoingExperienceBuilderEvent,
} from '../types'
import { initChannel } from './createInitializer'
import { applyFallbacks, getDataSourceFromTree, isInsideIframe } from '../utils'
import { Channel } from './channel'
import throttle from 'lodash.throttle'
import { useContentfulSection } from '../hooks/useContentfulSection'
import contentful, { ContentfulClientApi } from 'contentful'

export type CompositionContextProps = {
  /** The mode is automatically set, use this value to manually override this **/
  mode?: CompositionMode
  /** Use CDA token for delivery mode and CPA for preview mode
   * When rendered in the editor a token is not needed **/
  accessToken?: string
  /** The defined locale,
   *  when rendered in the editor, the locale is set from the editor, but you can use this to overwrite this **/
  locale?: string
  /** The source spaceId,
   *  when rendered in the editor, the id is set from the editor **/
  spaceId?: string
  /** The source environmentId,
   *  when rendered in the editor, the id is set from the editor **/
  environmentId?: string
  /** The domain to be used for the API client (e.g. flinkly.com)
   */
  contentfulDomain?: string
  componentDefinitions: ComponentDefinitionWithComponentType[]
}

export type CompositionContextValues = {
  experience?: Experience
  locale?: string
  mode: CompositionMode
  channel?: Channel
  client?: ContentfulClientApi<undefined>
}

export const CompositionContext = createContext<CompositionContextValues>({
  mode: 'delivery',
})

export const CompositionContextProvider = ({
  children,
  mode: initialMode,
  accessToken,
  locale: initialLocale,
  spaceId,
  environmentId,
  contentfulDomain,
  componentDefinitions: customComponentDefinitions,
}: PropsWithChildren<CompositionContextProps>) => {
  const [isInitialized, setInitialized] = useState(false)
  const [tree, setTree] = useState<CompositionTree>()
  const [dataSource, setDataSource] = useState<LocalizedDataSource>({})
  const [locale, setLocale] = useState<string | undefined>(initialLocale)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('')
  const [mode, setMode] = useState<CompositionMode>(initialMode ?? 'delivery')
  const [channel, setChannel] = useState<Channel | undefined>(undefined)
  const [client, setClient] = useState<ContentfulClientApi<undefined> | undefined>(undefined)

  const shouldInitializeClient = (initialMode && initialMode !== 'editor') || !isInsideIframe()
  // Only initialize the message channel when being in editor mode or mode not pre-defined
  const shouldInitializeChannel = !shouldInitializeClient

  // Extend the list of registered component definitions with the native contentful section
  const contentfulSectionDefinition = useContentfulSection()
  const componentDefinitions = [...customComponentDefinitions, contentfulSectionDefinition]

  // Initialize the client for fetching the composition from CDA/ CPA
  useEffect(() => {
    if (shouldInitializeClient && !isInitialized) {
      // TODO: validate config here instead of in useValidatedExperienceConfig
      if (!spaceId || !environmentId || !accessToken) {
        throw new Error(
          'Missing required props for non-editor mode: spaceId, environmentId, accessToken'
        )
      }
      const domain = contentfulDomain ?? 'flinkly.com'
      const host = mode === 'delivery' ? `cdn.${domain}` : `preview.${domain}`
      const client = contentful.createClient({
        space: spaceId,
        environment: environmentId,
        host,
        accessToken,
      })
      setClient(client)
      setInitialized(true)
    }
  }, [])

  // Initialize the channel for communicating with the main frame in editor more
  useEffect(() => {
    if (shouldInitializeChannel && !isInitialized) {
      const handlers = {
        [IncomingExperienceBuilderEvent.COMPOSITION_INIT_SUCCESS]: (
          params: IncomingMessageParams
        ) => {
          const { tree, locale } = params as InitSuccessMessageParams
          setTree(tree)
          setLocale(locale)
          setDataSource(getDataSourceFromTree(tree))
        },
        [IncomingExperienceBuilderEvent.COMPONENT_TREE_UPDATED]: (
          params: IncomingMessageParams
        ) => {
          const { tree, locale } = params as Record<string, any>
          setTree(tree)
          setLocale(locale)
          setDataSource(getDataSourceFromTree(tree))
        },
        [IncomingExperienceBuilderEvent.SELECTED_COMPONENT_CHANGED]: (
          params: IncomingMessageParams
        ) => {
          const { selectedNodeId } = params as Record<string, any>
          setSelectedNodeId(selectedNodeId)
        },
        [IncomingExperienceBuilderEvent.COMPONENT_DRAGGING_CHANGED]: (
          params: IncomingMessageParams
        ) => {
          const { isDragging } = params as Record<string, any>
          setIsDragging(isDragging)
        },
      }
      console.log('INIT', componentDefinitions, contentfulSectionDefinition)
      initChannel(handlers, componentDefinitions, (connectedChannel) => {
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

  const enrichedComponentDefinitions = componentDefinitions.map((definition) => ({
    component: definition.component,
    componentDefinition: applyFallbacks(definition.componentDefinition),
  }))

  const experience: Experience = useMemo(
    () => ({
      tree,
      dataSource,
      isDragging,
      selectedNodeId,
      componentDefinitions: enrichedComponentDefinitions,
      config: {
        accessToken,
        spaceId,
        environmentId,
        locale,
        contentfulDomain,
      },
      mode: mode as CompositionMode,
    }),
    [tree, dataSource, isDragging, selectedNodeId, enrichedComponentDefinitions, mode]
  )

  // Channel or client will be defined
  if (!isInitialized) return null

  return (
    <CompositionContext.Provider value={{ experience, locale, mode, channel, client }}>
      {children}
    </CompositionContext.Provider>
  )
}

export const useCompositionContext = () => useContext(CompositionContext)
