import { ContentfulClientApi, Entry } from 'contentful';

type ClientAndLocaleParams =
  | {
      client: ContentfulClientApi<undefined>;
      locale?: string;
    }
  | {
      client: ContentfulClientApi<'WITH_ALL_LOCALES'>;
      /** When fetching all locales, this may not be defined */
      locale?: undefined;
    };

type FetchExperienceEntryParams = {
  /** id of the content type associated with the experience */
  experienceTypeId: string;
  /** identifying condition to find the correct experience entry */
  identifier: { slug: string } | { id: string };
} & ClientAndLocaleParams;

/**
 * Fetches an experience entry by its slug or id. Throws an error if there are multiple
 * entries with the same slug. Additionally, it resolves all nested pattern entries inside `fields.usedComponents`.
 * @param options.client - Instantiated client from the Contentful SDK. If this is using the `withAllLocales` modifier, you may not provide a specific locale.
 * @param options.locale - Provide a locale if your experience contains custom localized fields. Otherwise, it will fallback to the default locale.
 * @param options.experienceTypeId - id of the content type associated with the experience
 * @param options.identifier - identifying condition to find the correct experience entry
 *
 */
export const fetchExperienceEntry = async ({
  client,
  experienceTypeId,
  locale,
  identifier,
}: FetchExperienceEntryParams) => {
  if (!client) {
    throw new Error(
      'Failed to fetch experience entities. Required "client" parameter was not provided',
    );
  }

  if (!experienceTypeId) {
    throw new Error(
      'Failed to fetch experience entities. Required "experienceTypeId" parameter was not provided',
    );
  }

  if (!('slug' in identifier) && !('id' in identifier)) {
    throw new Error(
      `Failed to fetch experience entities. At least one identifier must be provided. Received: ${JSON.stringify(
        identifier,
      )}`,
    );
  }

  const filter =
    'slug' in identifier ? { 'fields.slug': identifier.slug } : { 'sys.id': identifier.id };

  const entries = await client.getEntries({
    content_type: experienceTypeId,
    locale,
    include: 3, // fetching max 3 level deep references due to nested patterns
    ...filter,
  });

  if (entries.items.length > 1) {
    throw new Error(
      `More than one experience with identifier: ${JSON.stringify(identifier)} was found`,
    );
  }

  return entries.items[0] as Entry | undefined;
};
