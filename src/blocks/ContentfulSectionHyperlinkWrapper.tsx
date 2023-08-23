import React from 'react'

type ContentfulSectionHyperlinkWrapperProps = {
  cfHyperlink: string
  cfOpenInNewTab: boolean
  editorMode: boolean
  children: React.ReactNode
}

export const ContentfulSectionHyperlinkWrapper = (
  props: ContentfulSectionHyperlinkWrapperProps
) => {
  const { cfHyperlink, cfOpenInNewTab, children, editorMode } = props

  let anchorTagProps = {}
  if (cfOpenInNewTab) {
    anchorTagProps = {
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  const stopPropagationInEditorMode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (editorMode === false) {
      return
    }
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <a
      href={cfHyperlink}
      {...anchorTagProps}
      style={{ width: '100%', height: '100%' }}
      onClick={stopPropagationInEditorMode}>
      {children}
    </a>
  )
}
