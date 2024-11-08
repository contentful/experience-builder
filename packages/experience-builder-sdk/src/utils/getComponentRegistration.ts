import { Assembly } from '@contentful/experiences-components-react';
import { createAssemblyRegistration, getComponentRegistration } from '../core/componentRegistry';
import { ComponentTreeNode } from '@contentful/experiences-validators';

export const getRegistration = (node: ComponentTreeNode, isAssembly: boolean) => {
  const registration = getComponentRegistration(node.definitionId as string);

  if (isAssembly && !registration) {
    return createAssemblyRegistration({
      definitionId: node.definitionId as string,
      component: Assembly,
    });
  }
  return registration;
};
