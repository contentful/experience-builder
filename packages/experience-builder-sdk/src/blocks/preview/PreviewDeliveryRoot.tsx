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
    const { dataSource, parameters: defaultParametersFromRootPattern } =
      generateDefaultDataSourceForPrebindingDefinition(prebindingDefinitions);
    const prebindingDefinition = prebindingDefinitions[0];

    if (Object.keys(dataSource).length) {
      entityStore.experienceEntryFields!.dataSource = {
        ...entityStore.dataSource,
        ...dataSource,
      };
      console.log('dataSource', entityStore.dataSource);
    }

    return entityStore.experienceEntryFields.componentTree.children.map((childNode, index) => {
      const hoistedParameters = Object.entries(
        prebindingDefinition?.parameterDefinitions ?? {},
      ).reduce((acc, [hoistedParamId, hoistedParamDefinition]) => {
        if (
          hoistedParamDefinition.passToNodes &&
          Array.isArray(hoistedParamDefinition.passToNodes)
        ) {
          const hoistingInstruction = hoistedParamDefinition.passToNodes[0];
          if (hoistingInstruction.nodeId === childNode.id) {
            return {
              ...acc,
              [hoistingInstruction.parameterId]: defaultParametersFromRootPattern[hoistedParamId],
            };
          }
        }

        return acc;
      }, {});

      let node = childNode;
      if (Object.keys(hoistedParameters).length) {
        node = {
          ...childNode,
          parameters: hoistedParameters,
        };
      }

      console.log('node', node);
      return (
        <CompositionBlock
          key={index}
          node={node}
          hyperlinkPattern={experience.hyperlinkPattern}
          locale={locale}
          entityStore={entityStore}
          resolveDesignValue={resolveDesignValue}
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
