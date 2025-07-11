import { componentRegistry, createAssemblyRegistration } from '@/store/registries';
import { Assembly } from '@contentful/experiences-components-react';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { useMemo } from 'react';

export const useComponentRegistration = (node: ExperienceTreeNode) => {
  return useMemo(() => {
    let registration = componentRegistry.get(node.data.blockId!);

    if (node.type === ASSEMBLY_NODE_TYPE && !registration) {
      registration = createAssemblyRegistration({
        definitionId: node.data.blockId!,
        component: Assembly,
      });
    }

    if (!registration) {
      console.warn(
        `Component registration not found for component with id: "${node.data.blockId}". The registered component might have been removed from the code. To proceed, remove the component manually from the layers tab.`,
      );
      return undefined;
    }
    return registration;
  }, [node]);
};
