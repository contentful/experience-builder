import React, { useEffect, useState } from 'react';
import type { DeprecatedExperience, Experience } from '@contentful/experiences-core/types';
import { CompositionBlock } from './CompositionBlock';
import { compatibleVersions } from '../../constants';
import { useBreakpoints } from '../../hooks';
import { EntityStore, fetchBySlug } from '@contentful/experiences-core';

type DeprecatedPreviewDeliveryRootProps = {
  deprecatedExperience: DeprecatedExperience;
  locale: string;
  slug: string;
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
  const { experienceTypeId, client } = deprecatedExperience;
  const [experience, setExperience] = useState<Experience<EntityStore>>();

  useEffect(() => {
    const fetchExperience = async () => {
      const experience = await fetchBySlug({
        client,
        experienceTypeId,
        localeCode: locale,
        slug,
      });

      setExperience(experience);
    };

    fetchExperience();
  }, [client, experienceTypeId, locale, slug]);

  const entityStore = experience?.entityStore;
  const { resolveDesignValue } = useBreakpoints(entityStore?.breakpoints ?? []);

  if (!entityStore?.experienceEntryFields || !entityStore?.schemaVersion) {
    return null;
  }

  if (!compatibleVersions.includes(entityStore.schemaVersion)) {
    console.warn(
      `[experiences-sdk-react] Contenful composition schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
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
