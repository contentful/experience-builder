import { checkIsAssemblyNode, createExperience, EntityStore } from '@contentful/experiences-core';
import { ComponentTreeNode } from '@contentful/experiences-validators';
import React from 'react';
// import { getRegistration } from '../../utils/getComponentRegistration';
import { resolveAssembly } from '../../core/preview/assemblyUtils';
import { CompositionBlockServer } from './CompositionBlockServer';
import { Experience } from '@contentful/experiences-core/types';
// import { CompositionBlockClient } from './CompositionBlockClient';

type CompositionBlockWrapperProps = {
  experience?: Experience<EntityStore> | string | null;
  node: ComponentTreeNode;
  locale: string;
  hyperlinkPattern?: string | undefined;
  getPatternChildNodeClassName?: (childNodeId: string) => string | undefined;
};

const CompositionBlockWrapper: React.FC<CompositionBlockWrapperProps> = ({
  node: rawNode,
  experience,
  ...props
}) => {
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  if (!experienceObject) return null;

  const { entityStore } = experienceObject;

  if (!entityStore?.experienceEntryFields || !entityStore?.schemaVersion) return null;

  const isAssembly = checkIsAssemblyNode({
    componentId: rawNode.definitionId,
    usedComponents: entityStore.usedComponents,
  });

  const node = isAssembly
    ? resolveAssembly({
        node: rawNode,
        entityStore,
      })
    : rawNode;

  // const componentRegistration = getRegistration(node, isAssembly);

  // if (!componentRegistration) {
  //   return null;
  // }

  // const { options } = componentRegistration;

  // if (options?.isRSC) {
  //   return <CompositionBlockServer experience={experience} node={node} {...props} />;
  // }

  // return <CompositionBlockClient experience={experience} node={node} {...props} />;

  return <CompositionBlockServer experience={experience} node={node} {...props} />;
};

export default CompositionBlockWrapper;
