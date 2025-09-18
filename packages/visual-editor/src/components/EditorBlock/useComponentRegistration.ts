import { componentRegistry } from '@/store/registries';
import { Assembly } from '@contentful/experiences-components-react';
import { createAssemblyDefinition, debug } from '@contentful/experiences-core';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { useMemo } from 'react';

export const useComponentRegistration = (node: ExperienceTreeNode) => {
  return useMemo(() => {
    if (node.type === ASSEMBLY_NODE_TYPE) {
      // The definition and component are the same for all assemblies
      return {
        component: Assembly,
        definition: createAssemblyDefinition(node.data.blockId!),
      };
    }

    const registration = componentRegistry.get(node.data.blockId!);
    if (!registration) {
      debug.warn(
        `[experiences-visual-editor-react::useComponentRegistration] Component registration not found for component with id: "${node.data.blockId}". The registered component might have been removed from the code. To proceed, remove the component manually from the layers tab.`,
      );
      return undefined;
    }
    return registration;
  }, [node]);
};
