import React from 'react';
import { EntityStore } from '@contentful/experience-builder-core';
import type { Experience } from '@contentful/experience-builder-core/types';
import { CompositionBlock } from './CompositionBlock';
import { compatibleVersions } from '../../constants';
import { useBreakpoints } from '../../hooks';

type DeliveryRootProps = {
  experience: Experience<EntityStore>;
  locale: string;
};

export const PreviewDeliveryRoot = ({ locale, experience }: DeliveryRootProps) => {
  const { entityStore } = experience;

  const { resolveDesignValue } = useBreakpoints(entityStore?.breakpoints ?? []);

  if (!entityStore?.experienceEntryFields || !entityStore?.schemaVersion) {
    return null;
  }

  if (!compatibleVersions.includes(entityStore.schemaVersion)) {
    console.warn(
      `[exp-builder.sdk] Contentful composition schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
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
          dataSource={entityStore.dataSource}
          unboundValues={entityStore.unboundValues}
          breakpoints={entityStore.breakpoints}
          usedComponents={entityStore.usedComponents}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  );
};
