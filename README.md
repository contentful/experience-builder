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

In case you expect the message to arrive from a different origin, define this environment variable with your desired value

```sh
REACT_APP_EXPERIENCE_BUILDER_ORIGIN=https://localhost:3001 # https://app.contentful.com by default
```
