import { VisualEditorRoot } from './VisualEditorRoot'
import react, { useContext } from 'react'
import { CompositionPage } from './CompositionPage'
import { useContentfulSection } from '../hooks/useContentfulSection'
import { ContentfulCompositionContext } from '../contexts/ContentfulCompositionContext'

type CompositionRootProps = {
  slug: string
  isPreview: boolean
}

function isInsideIframe(): boolean {
  try {
    return window.top?.location.href !== window.location.href;
  } catch (err) {
    // window.top.location.href is not accessable for non same origin iframes
    return true;
  }
}

export const CompositionRoot = ({
  isPreview,
  slug,
}: CompositionRootProps) => {
  debugger;
  const { locale, accessToken, spaceId, environmentId } = useContext(ContentfulCompositionContext)
  console.log(locale, accessToken, spaceId, environmentId, isPreview, isInsideIframe())

  if(!locale) {
    console.error('[exp-builder.sdk] SDK requires a locale property to be defined')
    return null
  }

  useContentfulSection()

  const insideIframe = isInsideIframe()
  if (insideIframe && isPreview) {
    return <VisualEditorRoot locale={locale} />
  }

  if (isPreview) {
    if (!accessToken || !spaceId || !environmentId) {
      console.error('[exp-builder.sdk] SDK requires access token, space ID, and enviromentId to be defined')
      return null
    }
    return (
      <CompositionPage
        locale={locale}
        accessToken={accessToken}
        spaceId={spaceId}
        environmentId={environmentId}
        slug={slug}
      />
    )
  }

  return null
}
