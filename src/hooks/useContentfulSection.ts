import { useComponents } from './useComponents'
import { ContentfulSection } from '../blocks/ContentfulSection'
import { useEffect } from 'react'
import { sectionDefinition, containerDefinition } from '../core/definitions/components'
import { CompositionMode } from '../types'

export const useContentfulSection = ({ mode }: { mode: CompositionMode }) => {
  const { defineComponent } = useComponents({ mode })

  useEffect(() => {
    defineComponent(ContentfulSection, sectionDefinition)
    defineComponent(ContentfulSection, containerDefinition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
