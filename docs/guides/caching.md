# Caching

When using the recommended approach for initializing experiences with this SDK, the logic will fetch the experience entry, the data source (bound entries & assets), and used patterns under the hood and return the final experience object.

To inject a manual caching layer in between, the SDK allows you to fetch the content on your own.

## Typical Fetching & Rendering

The simple setup would usually look something like this calling one of the sophisticated fetcher functions `useFetchBySlug`. While the final experience object exposes all fetched content, it doesn't provide a way to inject already fetched content but will fetch everything from the API at once.

```ts
import { useFetchBySlug } from '@contentful/experiences-sdk-react';

const { experience, error, isLoading } = useFetchBySlug({
  slug,
  localeCode: locale,
  client,
  experienceTypeId,
});
```

## Caching & Injecting Data

To cache the loaded entities and inject them manually, a custom fetcher function needs to be written that uses `fetchExperienceEntry`, `fetchReferencedEntities`, and `createExperience` which are exposed from the SDK as well.

### Fetching Data

```ts
import {
  fetchExperienceEntry,
  fetchReferencedEntities,
  createExperience,
} from '@contentful/experiences-sdk-react';

async function customFetchAllEntities({ client, experienceTypeId, slug, localeCode }) {
  // Fetch the experience entry including its used patterns (resolved links in fields.usedComponents)
  const experienceEntry = await fetchExperienceEntry({
    client,
    experienceTypeId,
    identifier: { slug },
    locale: localeCode,
  });
  // Fetch all entries and assets that are listed in fields.dataSource
  const references = await fetchReferencedEntities({
    client,
    experienceEntry,
    locale: localeCode,
  });

  const experience = createExperience({
    experienceEntry,
    referencedAssets: references.assets,
    referencedEntries: references.entries,
    locale: localeCode,
  });

  return experience;
}
```

You can now cache `experienceEntry` and `references` with a caching layer like Redis. Later, you can pass these to `createExperience` to initialize the application.

### Using Cached Data

```ts
import { useCustomFetch } from '@contentful/experiences-sdk-react';

const { experience, error, isLoading } = useCustomFetch({
  fetchFn: async (): Promise<Experience<EntityStore> | undefined> => {
    const experience = await customFetchAllEntities({ client, experienceTypeId, slug, localeCode });
    return experience;
  },
});
```

## Multi Locale Support

When using multiple locales, you might want to cache the entities for all locales at once to save network load and memory consumption. You can achieve this by using the [client chain modifier](https://github.com/contentful/contentful.js/tree/master?tab=readme-ov-file#client-chain-modifiers) `client.withAllLocales` and pass this client to the fetcher functions.

### Fetching Data

```ts
import {
  fetchExperienceEntry,
  fetchReferencedEntities,
  createExperience,
} from '@contentful/experiences-sdk-react';

function customFetchAllEntitiesWithAllLocales({ client, experienceTypeId, slug, localeCode }) {
  const clientWithAllLocales = client.withAllLocales;
  const experienceEntryLocales = await fetchExperienceEntry({
    client: clientWithAllLocales,
    experienceTypeId,
    identifier: { slug },
  });
  const referencesLocales = await fetchReferencedEntities({
    client: clientWithAllLocales,
    experienceEntry: experienceEntryLocales,
  });

  // Localize cached entities
  const experienceEntry = localizeEntity(experienceEntryLocales, locale);
  const referencedAssets = referencesLocales.assets.map((asset) => localizeEntity(asset, locale));
  const referencedEntries = referencesLocales.entries.map((entry) => localizeEntity(entry, locale));

  // Initialize experience required for <ExperienceRoot />
  const experience = createExperience({
    experienceEntry,
    referencedAssets,
    referencedEntries,
    locale,
  });

  return experience;
}
```

When passing those multi-locale entities to `createExperience`, make sure to localize them upfront. In the provided snippet above, we use a fictive function `localizeEntity` which is not (yet) provided by Contentful. As of now, customers have to implement this on their own by resolving the `fields` attribute for a specified locale, e.g. `{"en-US": "Hello world"}` would be replaced by `"Hello world"`. In the end, the shape must match the default CDA shape, not the CMA one. The SDK function `createExperience` runs a validation check to not run on multi locale data by looking at the `sys.locale` value which needs to be provided as part of `localizeEntity` (similar to CDA).

Notice, that you still have to provide a locale because this whole logic will always run in the context of a page which needs to render a specific locale.

### Using Cached Data

```ts
import { useCustomFetch } from '@contentful/experiences-sdk-react';

const { experience, error, isLoading } = useCustomFetch({
  fetchFn: async (): Promise<Experience<EntityStore> | undefined> => {
    const experience = customFetchAllEntitiesWithAllLocales({
      client,
      experienceTypeId,
      slug,
      localeCode,
    });
  },
});
```
