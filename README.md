```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  useComponents,
  VisualEditorRoot,
} from '@contentful/experience-builder'

const App = () => {
  const { defineComponent } = useComponents()

  // 1. Define components
  useEffect(() => {
    defineComponent('Button', componentDefinition)
  }, [defineComponent])

  const { experience, locale } = useExperienceBuilder()

  // 2. Render your app
  return <VisualEditorRoot experience={experience} locale={locale} />
}
```

We used to restrict origin of the messages (`postMessage() API`), but currently removed this limitation. Messages are filtered by their schema.
