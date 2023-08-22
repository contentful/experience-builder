import { useComponents } from './useComponents'
import { ContentfulSection } from '../blocks/ContentfulSection'
import { useEffect } from 'react'
import { sectionDefinition, containerDefinition } from '../core/definitions/components'

export const useContentfulSection = () => {
  const { defineComponent } = useComponents()

  useEffect(() => {
    defineComponent(ContentfulSection, sectionDefinition)
    defineComponent(ContentfulSection, containerDefinition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
