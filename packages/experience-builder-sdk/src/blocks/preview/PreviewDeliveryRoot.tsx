'use client';
import React from 'react';
import { createExperience, EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { compatibleVersions } from '../../constants';
import { CompositionBlock } from './CompositionBlock';
import { useBreakpoints } from '../../hooks';

type DeliveryRootProps = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
};

export const PreviewDeliveryRoot = ({ experience, locale }: DeliveryRootProps) => {
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  const entityStore = experienceObject?.entityStore;

  const { resolveDesignValue } = useBreakpoints(entityStore?.breakpoints ?? []);

  if (!entityStore?.experienceEntryFields || !entityStore?.schemaVersion) {
    return null;
  }

  if (!compatibleVersions.includes(entityStore.schemaVersion)) {
    console.warn(
      `[experiences-sdk-react] Contentful experience schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
    );
    return null;
  }

  return (
    <>
      {entityStore.experienceEntryFields.componentTree.children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          hyperlinkPattern={experienceObject?.hyperlinkPattern}
          locale={locale}
          entityStore={entityStore}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  );
};
