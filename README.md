```tsx
import { useEffect, useMemo } from 'react'
import {
  useExperienceBuilder,
  useComponents,
  CompositionRoot,
} from '@contentful/experience-builder'

const configs = {
  experienceTypeId: 'marketing-website', // id of the experience type
  ...otherConfigs
};

const App = () => {
  const { defineComponent } = useComponents()

  // 1. Define components
  useEffect(() => {
    defineComponent('Button', componentDefinition)
  }, [defineComponent])

  const { experience, locale } = useExperienceBuilder(configs)

  // 2. Render your app
  return <CompositionRoot experience={experience} locale={locale} />
}
```

We used to restrict origin of the messages (`postMessage() API`), but currently removed this limitation. Messages are filtered by their schema.
