import React from 'react';
import {
  ASSEMBLY_BLOCK_NODE_TYPE,
  ASSEMBLY_NODE_TYPE,
  CONTENTFUL_COMPONENTS,
} from '@contentful/experiences-core/constants';
import { useComponentProps } from './useComponentProps';
import {
  ComponentDefinition as ComponentDefinitionWithOptionalVariables,
  ComponentDefinitionVariable,
  ComponentPropertyValue,
  ExperienceTreeNode as ExperienceTreeNodeWithOptionalProperties,
  ComponentRegistration,
} from '@contentful/experiences-core/types';
import { vi, it, describe } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createBreakpoints } from '@/__fixtures__/breakpoints';
import { EditorModeEntityStore, getValueForBreakpoint } from '@contentful/experiences-core';
import { useEditorModeClassName } from './useEditorModeClassName';
import * as editorStore from '@/store/editor';

// Redefining this type to make 'data.props.cfVisibility' a required field.
// Semantically, it is always available on the node at runtime,
// and this stricter type ensures that when making mock nodes, we don't miss it.
type ExperienceTreeNode = Omit<ExperienceTreeNodeWithOptionalProperties, 'data'> & {
  data: Omit<ExperienceTreeNodeWithOptionalProperties['data'], 'props'> & {
    props: ExperienceTreeNodeWithOptionalProperties['data']['props'] & {
      cfVisibility: ComponentPropertyValue;
    };
  };
} & {
  exposedPropertyNameToKeyMap?: Record<string, string>;
};

// When defining components in tests, must make the cfVisibility variable required,
// otherwise some tests may glitch, as when useComponentProps() logic iterates
// over nodes variables, it actually iterates over definition variables which are present on the node.
type ComponentDefinition = Omit<ComponentDefinitionWithOptionalVariables, 'variables'> & {
  variables: ComponentDefinitionWithOptionalVariables['variables'] & {
    cfVisibility: ComponentDefinitionVariable;
  };
};

const breakpoints = createBreakpoints();
const desktopIndex = 0;
const desktop = breakpoints[desktopIndex];

const mocks = vi.hoisted<{ componentRegistration: ComponentRegistration }>(() => {
  return {
    componentRegistration: {
      component: () => React.createElement('div'),
      definition: {
        id: 'pattern-id',
        name: 'Pattern Name',
        category: 'Assemblies',
        variables: {
          '7tZxaxR': {
            displayName: 'Background color',
            type: 'Text',
            group: 'style',
            description: 'The background color of the section',
            defaultValue: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'white',
                tablet: 'green',
                mobile: 'blue',
              },
            },
          },
        },
      },
    },
  };
});

let useEditorStoreMock: jest.SpyInstance;

vi.mock('@/store/registries', () => ({
  componentRegistry: new Map<string, ComponentRegistration>([
    ['pattern-id', mocks.componentRegistration],
  ]),
}));

vi.mock('./useEditorModeClassName', { spy: true });

let activeBreakpointIndex = desktopIndex;

const resolveDesignValue = vi.fn((valuesByBreakpoint, variableName) =>
  getValueForBreakpoint(
    valuesByBreakpoint,
    breakpoints,
    activeBreakpointIndex,
    desktopIndex,
    variableName,
  ),
);

const areEntitiesFetched = true;

describe('useComponentProps', () => {
  beforeEach(() => {
    // @ts-expect-error not important
    useEditorStoreMock = vi.spyOn(editorStore, 'useEditorStore');
  });

  afterEach(() => {
    useEditorStoreMock.mockReset();
  });
  const definition: ComponentDefinition = {
    id: 'button',
    name: 'Button',
    variables: {
      cfVisibility: { type: 'Boolean' },
      label: {
        type: 'Text',
        defaultValue: 'Click here',
      },
    },
  };
  const node: ExperienceTreeNode = {
    data: {
      id: 'id',
      props: {
        cfVisibility: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            [desktop.id]: true,
          },
        },
      },
      unboundValues: {},
      dataSource: {},
      breakpoints: [],
    },
    children: [],
    type: 'block',
  };

  let entityStore: EditorModeEntityStore;
  beforeEach(() => {
    entityStore = new EditorModeEntityStore({ locale: 'en-US', entities: [] });
  });

  it('should return empty object when node type is ASSEMBLY_NODE_TYPE', () => {
    const { result } = renderHook(() =>
      useComponentProps({
        node: { ...node, type: ASSEMBLY_NODE_TYPE },
        entityStore,
        areEntitiesFetched,
        resolveDesignValue,
        definition,
      }),
    );

    expect(Object.keys(result.current.componentProps)).not.toContain('label');
  });

  it('should resolve design value when node type is ASSEMBLY_BLOCK_NODE_TYPE', () => {
    const areEntitiesFetched = true;
    const patternBlockNode = {
      ...node,
      data: {
        ...node.data,
        props: {
          cfBackgroundColor: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: 'red',
            },
          },
        },
        pattern: {
          id: 'pattern-id',
          nodeId: 'pattern-node-id',
          nodeIdOnPattern: 'pattern-node-id',
          nodeLocation: '0_0',
          isVisibilityPropertyExposed: true,
          variableNameToComponentValueKeyMap: {},
        },
      },
      type: ASSEMBLY_BLOCK_NODE_TYPE,
      exposedPropertyNameToKeyMap: {
        cfBackgroundColor: '7tZxaxR',
      },
    };

    // changing the active breakpoint to non-desktop
    activeBreakpointIndex = 1;

    // Clear previous calls before running the test
    (useEditorModeClassName as jest.Mock).mockClear();

    renderHook(() =>
      useComponentProps({
        node: patternBlockNode as unknown as ExperienceTreeNode,
        entityStore,
        areEntitiesFetched,
        resolveDesignValue,
        definition: {
          ...definition,
          variables: {
            ...definition.variables,
            cfBackgroundColor: {
              displayName: 'Background color',
              type: 'Text',
              group: 'style',
              description: 'The background color of the section',
              defaultValue: 'rgba(0, 0, 0, 0)',
            },
          },
        },
      }),
    );

    // making sure that the design value is resolved to the correct pattern variable definition value
    expect(useEditorModeClassName).toHaveBeenCalledWith(
      expect.objectContaining({
        styles: {
          backgroundColor: 'green',
        },
      }),
    );
  });

  it('should return props with default values when variableMapping is falsy', () => {
    const { result } = renderHook(() =>
      useComponentProps({
        node,
        entityStore,
        areEntitiesFetched,
        resolveDesignValue,
        definition,
      }),
    );

    expect(result.current.componentProps.label).toEqual('Click here');
  });

  it('should return definition default value when type is ComponentValue', () => {
    const { result } = renderHook(() =>
      useComponentProps({
        node: {
          ...node,
          data: {
            ...node.data,
            props: {
              label: {
                key: 'random-uuid',
                type: 'ComponentValue',
              },
            },
          },
        },
        entityStore,
        areEntitiesFetched,
        resolveDesignValue,
        definition,
      }),
    );

    expect(result.current.componentProps.label).toEqual('Click here');
  });

  describe('structure components', () => {
    const definition: ComponentDefinition = {
      id: CONTENTFUL_COMPONENTS.section.id,
      name: CONTENTFUL_COMPONENTS.section.name,
      variables: {
        cfVisibility: { type: 'Boolean' },
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
        myValue: { type: 'Text', defaultValue: 'default' },
      },
    };
    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        // This block id will identify the component as a structure component
        blockId: CONTENTFUL_COMPONENTS.section.id,
        props: {
          cfVisibility: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: true,
            },
          },
          cfWidth: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
          cfHeight: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: 'fit-content',
            },
          },
          myValue: {
            type: 'UnboundValue',
            key: 'myValue',
          },
        },
        unboundValues: {
          myValue: { value: 'test' },
        },
        dataSource: {},
        breakpoints: [],
      },
      children: [],
      type: 'block',
    };

    it('should not return isInExpEditorMode for structural components', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          entityStore,
          areEntitiesFetched,
          resolveDesignValue,
          definition,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.isInExpEditorMode).toBeUndefined();
    });
  });

  describe('when preboundValue is provided', () => {
    beforeEach(() => {
      useEditorStoreMock.mockReturnValue({
        uuid1: {
          sys: {
            id: 'entry1',
            linkType: 'Entry',
            type: 'Link',
          },
        },
      });
    });

    it('should resolve prebound variables with incomplete paths', () => {
      const definition: ComponentDefinition = {
        id: 'custom-component',
        name: 'Stub component',
        variables: {
          cfVisibility: {
            type: 'Boolean',
          },
          variable: {
            type: 'Media',
          },
        },
      };
      const entityStore = new EditorModeEntityStore({
        entities: [
          {
            // @ts-expect-error not important
            sys: {
              id: 'entry1',
              type: 'Entry',
              contentType: {
                sys: {
                  id: 'contentTypeId1',
                  type: 'Link',
                  linkType: 'ContentType',
                },
              },
            },
            fields: {
              imageRef: {
                sys: {
                  id: 'asset1',
                  type: 'Link',
                  linkType: 'Asset',
                },
              },
            },
          },
          {
            // @ts-expect-error not important
            sys: {
              id: 'asset1',
              type: 'Asset',
            },
            fields: {
              file: {
                url: 'https://example.com/cat.jpg',
              },
            },
          },
        ],
        locale: 'en-US',
      });
      const stub = vi.fn();
      const { result } = renderHook(() =>
        useComponentProps({
          node: {
            type: 'block',
            data: {
              dataSource: {
                uuid1: {
                  sys: {
                    id: 'entry1',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              },
              props: {
                variable: {
                  type: 'BoundValue',
                  path: '/uuid1',
                  // @ts-expect-error not important
                  isPrebound: true,
                  pathsByContentType: {
                    contentTypeId1: {
                      path: '/uuid1/fields/imageRef/~locale/fields/file/~locale',
                      isPrebound: true,
                    },
                    contentTypeId2: {
                      path: '/uuid2/fields/catImage/~locale/fields/file/~locale',
                      isPrebound: true,
                    },
                  },
                },
              },
            },
            children: [],
          },
          entityStore,
          areEntitiesFetched,
          stub,
          definition,
        }),
      );

      expect(result.current.componentProps.variable).toBe('https://example.com/cat.jpg');
    });

    it('should return undefined if the deep bound asset isnt link on the prebinding source entry', () => {
      const definition: ComponentDefinition = {
        id: 'custom-component',
        name: 'Stub component',
        variables: {
          cfVisibility: {
            type: 'Boolean',
          },
          variable: {
            type: 'Media',
          },
        },
      };
      const entityStore = new EditorModeEntityStore({
        entities: [
          {
            // @ts-expect-error not important
            sys: {
              id: 'entry1',
              type: 'Entry',
              contentType: {
                sys: {
                  id: 'contentTypeId1',
                  type: 'Link',
                  linkType: 'ContentType',
                },
              },
            },
            fields: {
              imageRef: {
                sys: {
                  id: 'asset1',
                  type: 'Link',
                  linkType: 'Asset',
                },
              },
            },
          },
        ],
        locale: 'en-US',
      });
      const stub = vi.fn();
      const { result } = renderHook(() =>
        useComponentProps({
          node: {
            type: 'block',
            data: {
              dataSource: {
                uuid1: {
                  sys: {
                    id: 'entry1',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              },
              props: {
                variable: {
                  type: 'BoundValue',
                  path: '/uuid1',
                  // @ts-expect-error not important
                  isPrebound: true,
                  pathsByContentType: {
                    contentTypeId1: {
                      path: '/uuid1/fields/imageRef/~locale/fields/file/~locale',
                      isPrebound: true,
                    },
                    contentTypeId2: {
                      path: '/uuid2/fields/catImage/~locale/fields/file/~locale',
                      isPrebound: true,
                    },
                  },
                },
              },
            },
            children: [],
          },
          entityStore,
          areEntitiesFetched,
          stub,
          definition,
        }),
      );

      expect(result.current.componentProps.variable).toBe(undefined);
    });
  });

  describe('custom components', () => {
    const definition: ComponentDefinition = {
      id: 'banner',
      name: 'Banner',
      variables: {
        cfVisibility: { type: 'Boolean' },
        cfWidth: { type: 'Text' },
        cfHeight: { type: 'Text' },
        cfMaxWidth: { type: 'Text' },
        cfMargin: { type: 'Text' },
        myValue: { type: 'Text', defaultValue: 'default' },
      },
    };

    const node: ExperienceTreeNode = {
      data: {
        id: 'id',
        blockId: 'banner',
        props: {
          cfVisibility: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: true,
            },
          },
          cfWidth: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
          cfHeight: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
          cfMaxWidth: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '50%',
            },
          },
          cfMargin: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              [desktop.id]: '10px 0 10px 0',
            },
          },
          myValue: {
            type: 'UnboundValue',
            key: 'myValue',
          },
        },
        unboundValues: {
          myValue: { value: 'test' },
        },
        dataSource: {},
        breakpoints: [],
      },
      children: [],
      type: 'block',
    };

    it('should return isInExpEditorMode as true for custom components when flag is enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          entityStore,
          areEntitiesFetched,
          resolveDesignValue,
          definition,
          options: { wrapComponent: false, enableCustomEditorView: true },
        }),
      );

      expect(result.current.componentProps.isInExpEditorMode).toBe(true);
    });

    it('should not return isInExpEditorMode when the flag is not enabled', () => {
      const { result } = renderHook(() =>
        useComponentProps({
          node,
          entityStore,
          areEntitiesFetched,
          resolveDesignValue,
          definition,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.isInExpEditorMode).toBeUndefined();
    });

    it('should return unbound values in componentProps for structural components', () => {
      useEditorStoreMock.mockReturnValue({
        myValue: { value: 'test' },
      });

      const { result } = renderHook(() =>
        useComponentProps({
          node,
          entityStore,
          areEntitiesFetched,
          resolveDesignValue,
          definition,
          options: { wrapComponent: false },
        }),
      );

      expect(result.current.componentProps.myValue).toBe('test');
    });
  });
});
