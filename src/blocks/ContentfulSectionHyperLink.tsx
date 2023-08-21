import React from 'react'

type ContentfulSectionHyperLinkProps = {
  hyperlink: string
  openInNewTab: boolean
  isEditorMode: boolean
  children: React.ReactNode
}

export const ContentfulSectionHyperLink = (props: ContentfulSectionHyperLinkProps) => {
  const { hyperlink, openInNewTab, children, isEditorMode } = props

  let anchorTagProps = {}
  if (openInNewTab) {
    anchorTagProps = {
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }

  const stopPropagationInEditorMode = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isEditorMode === false) {
      return
    }
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <a
      href={hyperlink}
      {...anchorTagProps}
      style={{ width: '100%', height: '100%' }}
      onClick={stopPropagationInEditorMode}
      onMouseDown={stopPropagationInEditorMode}>
      {children}
    </a>
  )
}
