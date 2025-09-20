import React from 'react';
import {
  debug,
  EntityStore,
  generateDefaultDataSourceForPrebindingDefinition,
} from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { CompositionBlock } from './CompositionBlock';
import { compatibleVersions } from '../../constants';
import { useBreakpoints } from '../../hooks';
import { PrebindingManager } from '../../core/preview/PrebindingManager';

const initialPatternRootNodeIdsChain = ['root'];

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
    debug.warn(
      `[experiences-sdk-react::PreviewDeliveryRoot] Contentful experience schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
    );
    return null;
  }

  const isPreviewingAPattern = entityStore.isExperienceAPatternEntry;

  if (isPreviewingAPattern) {
    const prebindingDefinitions =
      entityStore.experienceEntryFields.componentSettings?.prebindingDefinitions ?? [];
    PrebindingManager.storePrebindingDefinitions(
      'root',
      entityStore.experienceEntryId!,
      prebindingDefinitions,
    );
    const { dataSource, parameters: defaultParametersFromRootPattern } =
      generateDefaultDataSourceForPrebindingDefinition(prebindingDefinitions);

    if (Object.keys(dataSource).length) {
      entityStore.experienceEntryFields!.dataSource = {
        ...entityStore.dataSource,
        ...dataSource,
      };
    }

    return entityStore.experienceEntryFields.componentTree.children.map((childNode, index) => {
      return (
        <CompositionBlock
          key={index}
          node={childNode}
          hyperlinkPattern={experience.hyperlinkPattern}
          locale={locale}
          entityStore={entityStore}
          resolveDesignValue={resolveDesignValue}
          patternRootNodeIdsChain={initialPatternRootNodeIdsChain}
          rootPatternParameters={defaultParametersFromRootPattern}
        />
      );
    });
  }

  return (
    <>
      {entityStore.experienceEntryFields.componentTree.children.map((childNode, index) => (
        <CompositionBlock
          key={index}
          node={childNode}
          hyperlinkPattern={experience.hyperlinkPattern}
          locale={locale}
          entityStore={entityStore}
          resolveDesignValue={resolveDesignValue}
        />
      ))}
    </>
  );
};
