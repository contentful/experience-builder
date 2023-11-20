import React, { useEffect, useMemo } from 'react';
// Editor.jsx
import { ComponentConfig, Field, Fields, Puck, SelectField, TextField, Config, Data } from './core';

import { ComponentDefinitionVariable, ComponentDefinitionVariableType, InitConfig } from './types';
import { VerticalSpace } from './components/editor-components/VerticalSpace';
import { Flex } from './components/editor-components/Flex';
import { Columns } from './components/editor-components/Columns';
import { Container } from './components/editor-components/Container';

// Describe the initial data
const initialData: Data = {
  content: [
    {
      type: 'Columns',
      props: {
        distribution: 'auto',
        columns: [{}, {}],
        id: 'Columns-a82cb578-d3eb-4a16-a5ac-f5fad8a302db',
      },
    },
    {
      type: 'Flex',
      props: {
        items: [{}, {}],
        minItemWidth: 356,
        id: 'Flex-19f69963-5143-4549-aa82-294c74899cb3',
      },
    },
    {
      type: 'Button',
      props: {
        id: 'Button-cdc56262-36ea-4f3a-8b45-43b1049f4217',
      },
    },
    {
      type: 'Flex',
      props: {
        items: [{}, {}],
        minItemWidth: 356,
        id: 'Flex-af8dd054-927a-4b22-b0ca-a6378bc7b357',
      },
    },
    {
      type: 'Button',
      props: {
        id: 'Button-ab847982-a5e2-41f3-80ce-c3fbe7c166ad',
      },
    },
  ],
  root: {
    title: 'Test',
  },
  zones: {
    'Columns-a82cb578-d3eb-4a16-a5ac-f5fad8a302db:column-0': [],
    'Columns-a82cb578-d3eb-4a16-a5ac-f5fad8a302db:column-1': [],
    'Flex-af8dd054-927a-4b22-b0ca-a6378bc7b357:item-0': [],
    'Flex-af8dd054-927a-4b22-b0ca-a6378bc7b357:item-1': [],
    'Flex-19f69963-5143-4549-aa82-294c74899cb3:item-0': [],
    'Flex-19f69963-5143-4549-aa82-294c74899cb3:item-1': [],
  },
};
// Save the data to your database
const save = (data: any) => {
  console.log('saving', data);
};

const makeField = (
  variable: ComponentDefinitionVariable<ComponentDefinitionVariableType>
): Field => {
  if (variable.validations?.in?.length) {
    return {
      type: 'select',
      label: variable.displayName,
      options: variable.validations.in.map((v) => ({
        label: v.displayName,
        value: v.value,
      })),
    } as SelectField;
  }

  if (variable.type === 'Boolean') {
    return {
      type: 'radio',
      label: variable.displayName,
      options: [
        {
          label: 'True',
          value: true,
        },
        {
          label: 'False',
          value: false,
        },
      ],
    } as SelectField;
  }

  if (variable.type === 'Date') {
    return {
      type: 'text',
      label: variable.displayName,
    } as TextField;
  }

  if (variable.type === 'Text') {
    return {
      type: 'text',
      label: variable.displayName,
    } as TextField;
  }

  if (variable.type === 'Number') {
    return {
      type: 'text',
      label: variable.displayName,
    } as TextField;
  }

  return {
    type: 'text',
    label: variable.displayName,
  } as TextField;
};

// Render Puck editor
const VisualEditor: React.FC<InitConfig> = ({ components = [] }) => {
  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const data = {
        name: 'MOUSE_MOVE',
        data: {
          x: event.pageX,
          y: event.pageY,
        },
      };

      window.parent.postMessage(JSON.stringify(data), '*');
    };
    const onMouseUp = (event: MouseEvent) => {
      const data = {
        name: 'MOUSE_UP',
      };

      window.parent.postMessage(JSON.stringify(data), '*');
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const config = useMemo<Config>(() => {
    const customComponents = components.reduce((definitions, obj) => {
      const propNames = Object.keys(obj.definition.variables);

      let fields: Fields = {};
      let defaultProps = {};

      propNames.forEach((propName) => {
        const prop = obj.definition.variables[propName];

        const field = makeField(prop);

        if (prop.defaultValue) {
          defaultProps = { ...defaultProps, [propName]: prop.defaultValue };
        }

        fields = { ...fields, [propName]: field };
      });

      const component: ComponentConfig<any, any> = {
        fields,
        defaultProps,
        render: obj.component as any,
      };

      if (obj.definition.category === 'contentful-component') {
        return definitions;
      }

      return { ...definitions, [obj.definition.name]: component };
    }, {});

    const defaultCategories: Record<string, { components: string[] }> = {
      layout: {
        components: ['Container', 'Columns', 'Flex', 'VerticalSpace'],
      },
    };
    const categories = components.reduce((categories, comp) => {
      if (!comp.definition.category) {
        return categories;
      }
      if (comp.definition.category === 'contentful-component') {
        return categories;
      }
      const exists = categories[comp.definition.category];

      if (exists) {
        return {
          ...categories,
          [comp.definition.category]: {
            components: [...categories[comp.definition.category].components, comp.definition.name],
          },
        };
      }
      return {
        ...categories,
        [comp.definition.category]: { components: [comp.definition.name] },
      };
    }, defaultCategories);

    const builtInComponents = {
      Columns,
      Flex,
      VerticalSpace,
      Container,
    };

    return {
      categories,
      components: { ...builtInComponents, ...customComponents },
    } as any;
  }, [components]);

  return (
    <Puck
      // renderHeader={() => <>{null}</>}
      config={config}
      data={initialData}
      // onChange={console.log}
    />
  );
};

export default VisualEditor;
