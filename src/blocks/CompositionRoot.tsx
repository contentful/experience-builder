import { Experience } from '../types'
import { VisualEditorRoot } from './VisualEditorRoot'
import react from 'react'
import { CompositionPage } from './CompositionPage'
import { useContentfulSection } from '../hooks/useContentfulSection'

type CompositionRootProps = {
  experience?: Experience
  locale: string
  accessToken: string
  spaceId: string
  environmentId: string
  slug: string
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
  experience,
  locale,
  accessToken,
  spaceId,
  environmentId,
  slug,
}: CompositionRootProps) => {
  useContentfulSection()

  const insideIframe = isInsideIframe()

  return (
    <>
      {!insideIframe &&
        <CompositionPage
          locale={locale}
          accessToken={accessToken}
          spaceId={spaceId}
          environmentId={environmentId}
          slug={slug}
        />
      } {insideIframe && experience && <VisualEditorRoot experience={experience} locale={locale} />}
    </>
  )
}
