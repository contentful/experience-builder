import React from 'react'
import { VisualEditorRoot } from './VisualEditorRoot'
import { useContentfulSection } from '../hooks/useContentfulSection'

import { useExperienceBuilder } from '../hooks'

const EditorRoot = () => {
  const { experience, locale } = useExperienceBuilder()

  return <VisualEditorRoot locale={locale as string} experience={experience} />
}

type ProductionRootProps = Omit<BaseProps, 'isPreview'> & {
  isPreview: false
  /** Contentful delivery Api Token **/
  cdaToken: string
  spaceId: string
  slug: string
}
const ProductionRoot = (props: ProductionRootProps) => {
  return <div>This will render in production</div>
}

type PreviewRootProps = Omit<BaseProps, 'isPreview'> & {
  isPreview: true
  /** Contentful Preview Api Token **/
  cpaToken: string
  slug: string
  spaceId: string
  environmentId: string
}
const PreviewRoot = (props: PreviewRootProps) => {
  return <div>This will render in preview</div>
}

function isInsideIframe(): boolean {
  try {
    return window.top?.location.href !== window.location.href
  } catch (err) {
    // window.top.location.href is not accessable for non same origin iframes
    return true
  }
}

type BaseProps = {
  isPreview?: undefined
}

type CompositionRootProps = BaseProps | PreviewRootProps | ProductionRootProps

export function CompositionRoot(props: CompositionRootProps) {
  useContentfulSection()

  // When inside iframe we always know it is inside the editor
  if (isInsideIframe()) {
    return <EditorRoot />
  }

  if (props.isPreview) {
    return <PreviewRoot {...props} />
  }

  if (props.isPreview === false) {
    return <ProductionRoot {...props} />
  }

  return null
}
