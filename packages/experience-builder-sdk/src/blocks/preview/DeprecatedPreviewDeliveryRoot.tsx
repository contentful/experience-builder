import React, { useEffect, useRef } from 'react';
import type { DeprecatedExperience } from '@contentful/experiences-core/types';
import { CompositionBlock } from './CompositionBlock';
import { compatibleVersions } from '../../constants';
import { useBreakpoints, useFetchExperience } from '../../hooks';
import { usePrevious } from '../../hooks/usePrevious';

type DeprecatedPreviewDeliveryRootProps = {
  deprecatedExperience: DeprecatedExperience;
  locale: string;
  slug?: string;
};

/**
 * @deprecated Remove after the BETA release
 * @returns
 */
export const DeprecatedPreviewDeliveryRoot = ({
  locale,
  slug,
  deprecatedExperience,
}: DeprecatedPreviewDeliveryRootProps) => {
  const attemptedToFetch = useRef<boolean>(false);
  const previousLocale = usePrevious(locale);

  const { experienceTypeId, client } = deprecatedExperience;

  const { fetchBySlug, experience, isFetching } = useFetchExperience({
    client,
  });

  const entityStore = experience?.entityStore;

  useEffect(() => {
    // TODO: Test it, it is crucial
    // will make it fetch on each locale change as well as if experience entry hasn't been fetched yet at least once
    const shouldFetch =
      (client && !entityStore && !attemptedToFetch.current) || previousLocale !== locale;
    // this useEffect is meant to trigger fetching for the first time if it hasn't been done earlier
    // if not yet fetched and not fetchin at the moment
    if (shouldFetch && !isFetching && slug) {
      attemptedToFetch.current = true;
      fetchBySlug({
        experienceTypeId,
        localeCode: locale,
        slug,
      }).catch(() => {
        // noop
      });
    }
  }, [
    experienceTypeId,
    entityStore,
    isFetching,
    fetchBySlug,
    client,
    slug,
    locale,
    previousLocale,
  ]);

  const { resolveDesignValue } = useBreakpoints(entityStore?.breakpoints ?? []);

  if (!entityStore?.experienceEntryFields || !entityStore?.schemaVersion) {
    return null;
  }

  if (!compatibleVersions.includes(entityStore.schemaVersion)) {
    console.warn(
      `[exp-builder.sdk] Contenful composition schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
    );
    return null;
  }

  return (
    <>
      {entityStore.experienceEntryFields.componentTree.children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          locale={locale}
          entityStore={entityStore}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  );
};
