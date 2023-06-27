import { useMemo } from 'react'
import { useCompositionContext } from '../connection/CompositionContext'

export const useComponentDefinition = (id?: string) => {
  const { experience } = useCompositionContext()
  const definitions = experience?.componentDefinitions ?? []

  const definition = useMemo(() => {
    if (!id) return undefined
    return definitions.find((definition) => definition.componentDefinition.id === id)
  }, [id, definitions])

  return definition
}
