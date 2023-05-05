```tsx
import { useEffect, useMemo } from 'react';
import { useExperienceBuilder, useComponents, VisualEditorRoot } from '@contentful/experience-builder';
import { createClient } from 'contentful-management';

// 1. Create cma client
const cma = createClient({
  accessToken: CMA_MANAGEMENT_TOKEN,
}, {
  type: 'plain'
});

const App = () => {
  const { defineComponent } = useComponents();

  // 2. define components
  useEffect(() => {
    defineComponent('Button', componentDefinition);
  }, [defineComponent]);

  const { tree, binding, boundData } = useExperienceBuilder({ cma });

  // 3. Render your app
  return (
    <VisualEditorRoot tree={tree} binding={binding} boundData={boundData}>
  );
}
```

In case you expect the message to arrive from a different origin, define this environment variable with your desired value

```sh
REACT_APP_EXPERIENCE_BUILDER_ORIGIN=https://localhost:3001 # https://app.contentful.com by default
```
