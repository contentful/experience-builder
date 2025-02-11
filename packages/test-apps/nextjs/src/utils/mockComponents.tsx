import { registeredComponents } from '@/studio-config';
import { omit, pick } from 'lodash';
import {
  ComponentDefinition,
  ComponentDefinitionVariable,
  ComponentRegistration,
  ComponentTreeNode,
  DesignValue,
  Experience,
} from '../../../../core/dist/types';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-sdk-react';

const createComponentMock = (node: ComponentTreeNode): ComponentRegistration => {
  const designProps: Record<string, DesignValue> = {};
  const contentProps: Array<string> = [];

  for (const [propName, prop] of Object.entries(node.variables)) {
    if (prop.type === 'ComponentValue') {
      throw new Error('I dont know how to handle pattern props');
    }

    if (prop.type === 'DesignValue') {
      designProps[propName] = prop;
    } else {
      contentProps.push(propName);
    }
  }

  const Component = (props: React.PropsWithChildren) => {
    const designValues = pick(props, Object.keys(designProps));
    const contentValues = pick(props, contentProps);
    const other = omit(props, [...Object.keys(designProps), ...contentProps]);
    const { children, ...rest } = other;

    const propComponents = Object.entries(props).map(([propName, prop]) => {
      let val: any = undefined;
      try {
        val = JSON.stringify(prop);
      } catch (e) {
        val = prop;
      }
      return (
        <p key={propName}>
          {propName}: {val}
        </p>
      );
    });

    return (
      <div key={node.definitionId} {...designValues} {...rest} {...props}>
        {propComponents}
        {children}
      </div>
    );
  };

  const definition: ComponentDefinition = {
    id: node.definitionId,
    name: node.displayName ?? node.definitionId,
    children: !node.children.length,
    category: 'Mocks',
    variables: {
      ...Object.entries(designProps).reduce((acc, [propName, prop]) => {
        return {
          ...acc,
          [propName]: {
            type: 'Text',
            group: 'style',
            defaultValue: prop.valuesByBreakpoint[0],
          },
        };
      }, {}),
      ...contentProps.reduce<Record<string, ComponentDefinitionVariable>>((acc, propName) => {
        return {
          ...acc,
          [propName]: {
            type: 'Text',
            defaultValue: 'mock-default',
          },
        };
      }, {}),
    },
  };

  return {
    component: Component,
    definition,
  };
};

export const mockComponents = (experience?: Experience): Array<ComponentRegistration> => {
  if (!experience) {
    return [];
  }

  const registry = registeredComponents.reduce<Record<string, ComponentRegistration>>(
    (acc, registration) => {
      return {
        ...acc,
        [registration.definition.id]: registration,
      };
    },
    {
      ...(Object.values(CONTENTFUL_COMPONENTS).reduce((acc, data) => {
        return {
          ...acc,
          [data.id]: data,
        };
      }, {}) as any),
    },
  );

  const result = [...registeredComponents];

  const treeRoot = experience.entityStore?.experienceEntryFields?.componentTree;

  const queue = treeRoot?.children ? [...treeRoot.children] : [];

  while (queue.length) {
    const node = queue.shift();
    if (node) {
      const registration = registry[node.definitionId];
      if (!registration) {
        const mock = createComponentMock(node);
        registry[mock.definition.id] = mock;
        result.push(mock);
      }
      if (node.children) {
        queue.push(...node.children);
      }
    }
  }

  return result;
};
