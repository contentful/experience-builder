import React from 'react';
import { createExperience, EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { compatibleVersions } from '../../constants';
import CompositionBlockWrapper from './CompositionBlockWrapper';

type DeliveryRootProps = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
};

export const PreviewDeliveryRoot = ({ experience, locale }: DeliveryRootProps) => {
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  if (!experienceObject) return null;

  const { entityStore, hyperlinkPattern } = experienceObject;

  const schemaVersion = entityStore?.schemaVersion;

  if (!compatibleVersions.includes(schemaVersion!)) {
    console.warn(
      `[experiences-sdk-react] Contentful experience schema version: ${schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
    );
    return null;
  }

  if (!entityStore?.experienceEntryFields || !entityStore?.schemaVersion) {
    return null;
  }

  // Render isRSC components here to be passed as props into CompositionBlockWrapper

  // Add entity store method to serialize/de-serialize the entity store so it can be passed between client/server

  return (
    <>
      {entityStore.experienceEntryFields.componentTree.children.map((childNode, index) => (
        <CompositionBlockWrapper
          experience={experience}
          key={index}
          node={childNode}
          hyperlinkPattern={hyperlinkPattern}
          locale={locale}
        />
      ))}
    </>
  );
};
