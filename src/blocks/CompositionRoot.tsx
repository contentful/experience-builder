import { Experience } from "../types"
import { VisualEditorRoot } from "./VisualEditorRoot"
import react from 'react'
import { CompositionPage } from "./CompositionPage"

type CompositionRootProps = {
  experience?: Experience
  locale: string,
  accessToken: string
  isProduction: boolean
  spaceId: string
  environmentId: string
  slug: string
}

export const CompositionRoot = ({ experience, locale, isProduction, accessToken, spaceId, environmentId, slug}: CompositionRootProps) => {
  if (isProduction) {
    return <CompositionPage locale={locale} accessToken={accessToken} spaceId={spaceId} environmentId={environmentId} slug={slug}/>
  } else if (experience) {
    return <VisualEditorRoot experience={experience} locale={locale} />
  } else {
    return null
  }
}