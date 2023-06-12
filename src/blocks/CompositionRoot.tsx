import { Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import react from 'react'
import { CompositionPage } from './CompositionPage'
import { useContentfulSection } from '../hooks/useContentfulSection'

type CompositionRootProps = {
  experience?: Experience
  locale: string
  accessToken: string
  isProduction: boolean
  spaceId: string
  environmentId: string
  slug: string
}

export const CompositionRoot = ({
  experience,
  locale,
  isProduction,
  accessToken,
  spaceId,
  environmentId,
  slug,
}: CompositionRootProps) => {
  useContentfulSection()

  if (isProduction) {
    return (
      <CompositionPage
        locale={locale}
        accessToken={accessToken}
        spaceId={spaceId}
        environmentId={environmentId}
        slug={slug}
      />
    )
  } else if (experience) {
    return <VisualEditorRoot experience={experience} locale={locale} />
  } else {
    return null
  }
}
