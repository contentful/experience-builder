import { useMemo } from 'react';
import type {
  DeprecatedExperience,
  ExternalSDKMode,
} from '@contentful/experience-builder-core/types';
import type { ContentfulClientApi } from 'contentful';
import { defineComponents } from '../core/componentRegistry';

type UseExperienceBuilderProps = {
  /**
   * Id of the content type of the target experience
   */
  experienceTypeId: string;
  /**
   * Instance of a Delivery or Preview client from "contentful" package
   */
  client: ContentfulClientApi<undefined>;
  /**
   *  Mode defines the behaviour of the sdk.
   * - `preview` - fetching and rendering draft data. Will automatically switch to `editor` mode if open from contentful web app.
   * - `delivery` - fetching and rendering of published data. Can not be switched to `editor` mode. */
  mode?: ExternalSDKMode;
};

/**
 * @deprecated This hook is deprecated. Use fetchBySlug or fetchById instead
 */
export const useExperienceBuilder = ({
  experienceTypeId,
  client,
  mode = 'delivery',
}: UseExperienceBuilderProps) => {
  const experience = useMemo<DeprecatedExperience>(
    () => ({
      client,
      experienceTypeId,
      mode,
    }),
    [mode, client, experienceTypeId]
  );

  return {
    /**
     * @deprecated please fetch the experience using `useFetchExperience` hook or fetch the data manually using `fetchers` or `client` and create experience with `createExperience` function
     *
     * @example
     *
     * import { useFetchExperience } from '@contentful/experience-builder'
     *
     * const { fetchBySlug, fetchById, experience, isFetching } = useFetchExperience({ client, mode })
     */
    experience,
    /**
     * @deprecated please import the function from the library
     *
     * @example
     *
     * import { defineComponents } from '@contentful/experience-builder'
     */
    defineComponents,
  };
};
