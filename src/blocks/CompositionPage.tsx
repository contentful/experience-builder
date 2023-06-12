import { Composition, Experience } from "../types"
import { VisualEditorRoot } from "./VisualEditorRoot"
import react, { useEffect, useState } from 'react'
import { CompositionBlock } from "./CompositionBlock"
import contentful from 'contentful'

type CompositionPageProps = {
  locale: string,
  accessToken: string,
  spaceId: string,
  environmentId: string,
  slug: string
}

export const CompositionPage = ({ locale, accessToken, spaceId, environmentId, slug }: CompositionPageProps) => {
  const [composition, setComposition] = useState({} as Composition)
  const client = contentful.createClient({
    space: spaceId,
    environment: environmentId,
    accessToken
  })
  useEffect(() => {
    // fetch composition by slug
    client.getEntries({content_type: 'Layout', 'fields.slug': slug})
      .then((response) => console.log(response.items))
      .catch(console.error)
  }, [slug, client])

  useEffect(() => {
    // fetch entries
  }, [composition])


  return (
    <>
    {composition.children.map((childNode) => (<CompositionBlock node={childNode} locale={locale} />))}
    </>
  )
}