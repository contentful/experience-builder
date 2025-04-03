import { ContentfulClientApi, Entry } from 'contentful';

type fetchExperienceEntryArgs = {
  client: ContentfulClientApi<undefined>;
  experienceTypeId: string;
  /** Provide a locale if your experience contains custom localized fields. Otherwise,
   * it will fallback to the default locale for those. */
  locale?: string;
  identifier: {
    slug?: string;
    id?: string;
  };
};

export const fetchExperienceEntry = async ({
  client,
  experienceTypeId,
  locale,
  identifier,
}: fetchExperienceEntryArgs) => {
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

  if (!identifier.slug && !identifier.id) {
    throw new Error(
      `Failed to fetch experience entities. At least one identifier must be provided. Received: ${JSON.stringify(
        identifier,
      )}`,
    );
  }

  const filter = identifier.slug ? { 'fields.slug': identifier.slug } : { 'sys.id': identifier.id };

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
