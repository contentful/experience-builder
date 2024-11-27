'use client';
import React from 'react';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { compatibleVersions } from '../../constants';
import { CompositionBlock } from './CompositionBlock';
import { useBreakpoints } from '../../hooks';

type DeliveryRootProps = {
  experience: Experience<EntityStore> | null | undefined;
  locale: string;
};

export const PreviewDeliveryRoot = ({ experience, locale }: DeliveryRootProps) => {
  const entityStore = experience?.entityStore;

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
          locale={locale}
          entityStore={entityStore}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  );
};
