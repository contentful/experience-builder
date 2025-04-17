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

### Custom Fetching Logic

```ts
import {
  fetchExperienceEntry,
  fetchReferencedEntities,
  createExperience,
} from '@contentful/experiences-sdk-react';

export async function customFetchAllEntities(
  client: ContentfulClientApi<undefined>,
  experienceTypeId: string,
  slug: string,
  locale: string,
) {
  // Fetch the experience entry including its used patterns (resolved links in fields.usedComponents)
  const experienceEntry = await fetchExperienceEntry({
    client,
    experienceTypeId,
    identifier: { slug },
    locale,
  });
  if (!experienceEntry) return;

  // Fetch all entries and assets that are listed in fields.dataSource
  const references = await fetchReferencedEntities({
    client,
    experienceEntry,
    locale,
  });

  const experience = createExperience({
    experienceEntry,
    referencedAssets: references.assets,
    referencedEntries: references.entries,
    locale,
  });

  return experience;
}
```

You can now cache `experienceEntry` and `references` with a caching layer like Redis. Later, you can pass these to `createExperience` to initialize the application.

### Using Custom Logic for Rendering

```ts
import { useCustomFetch } from '@contentful/experiences-sdk-react';

const { experience, error, isLoading } = useCustomFetch({
  fetchFn: () => customFetchAllEntities(client, experienceTypeId, slug, localeCode),
});
```

## Multi Locale Support

When using multiple locales, you might want to cache the entities for all locales at once to save network load and memory consumption. You can achieve this by using the [client chain modifier](https://github.com/contentful/contentful.js/tree/master?tab=readme-ov-file#client-chain-modifiers) `client.withAllLocales` and pass this client to the fetcher functions.

### Fetching Logic

```ts
import {
  fetchExperienceEntry,
  fetchReferencedEntities,
  createExperience,
  localizeEntity,
} from '@contentful/experiences-sdk-react';
import { ContentfulClientApi } from 'contentful';

export async function customFetchAllEntitiesWithAllLocales(
  client: ContentfulClientApi<undefined>,
  experienceTypeId: string,
  slug: string,
  locale: string,
) {
  // The experience and the used patterns don't support multiple locales as the layout is the same for all cases.
  const experienceEntry = await fetchExperienceEntry({
    client,
    experienceTypeId,
    identifier: { slug },
  });
  if (!experienceEntry) return;

  // Fetch all locales for the references, i.e. the page content & assets
  const clientWithAllLocales = client.withAllLocales;
  const referencesLocales = await fetchReferencedEntities({
    client: clientWithAllLocales,
    experienceEntry,
  });

  // Localize cached entities
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

When using multi-locale entities, make sure use localized versions before passing them to `createExperience` and `fetchReferencedEntities`. In the provided snippet above, we use the function `localizeEntity` which will resolve each field for a specified locale, e.g. `{"en-US": "Hello world"}` would be replaced by `"Hello world"`. This function is not aware of the locale settings nor the content type and thus will not apply any fallback mechanism.

As the page layout is only stored for the default locale code, the experience entry and its internally linked pattern entries are fetched using the regular client. If you want to retrieve custom experience fields for all locales, you can pass `clientWithAllLocales` to `fetchExperienceEntry`. In this case, you have to make sure that not only the experience entry is localized afterwards but also the patterns located at `fields.usedComponents`. Note that those can again include nested patterns.

Notice, that you will have to provide a locale because this fetching logic will always run in the context of a page which needs to render a specific locale.

### Using Custom Logic for Rendering

```ts
import { useCustomFetch } from '@contentful/experiences-sdk-react';

const { experience, error, isLoading } = useCustomFetch({
  fetchFn: () =>
    customFetchAllEntitiesWithAllLocales(client, config.experienceTypeId, slug, localeCode),
});
```
