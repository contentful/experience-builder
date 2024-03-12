import {
  CONTENTFUL_COMPONENTS,
  ASSEMBLY_NODE_TYPE,
  LATEST_SCHEMA_VERSION,
} from '@contentful/experiences-core/constants';
import type { ExperienceTreeNode, SchemaVersions } from '@contentful/experiences-core/types';

type createAssemblyEntryArgs = {
  schemaVersion: SchemaVersions;
  id: string;
};

export const defaultAssemblyId = 'assembly-id';

export const assemblyGeneratedVariableName = 'text_uuid1Assembly';
export const createAssemblyEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
  id = defaultAssemblyId,
}: createAssemblyEntryArgs) => {
  return {
    sys: {
      id,
      type: 'Entry',
      contentType: {
        sys: {
          id: 'layout',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2023-06-27T00:00:00.000Z',
      updatedAt: '2023-06-27T00:00:00.000Z',
      revision: 1,
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'cfexampleSpace',
        },
      },
      environment: {
        sys: {
          type: 'Link',
          linkType: 'Environment',
          id: 'cfexampleEnvironment',
        },
      },
    },
    metadata: { tags: [] },
    fields: {
      title: 'Test experience',
      slug: 'test',
      componentTree: {
        children: [
          {
            definitionId: CONTENTFUL_COMPONENTS.container.id,
            variables: {},
            children: [
              {
                definitionId: 'custom-component',
                variables: {
                  text: {
                    key: assemblyGeneratedVariableName,
                    type: 'ComponentValue',
                  },
                },
                children: [],
              },
            ],
          },
        ],
        breakpoints: [{ id: 'desktop', query: '*', previewSize: '100vw', displayName: 'Desktop' }],
        schemaVersion,
      },
      dataSource: {},
      unboundValues: {
        unbound_uuid1Assembly: {
          value: 'custom component title',
        },
      },
      componentSettings: {
        variableDefinitions: {
          [assemblyGeneratedVariableName]: {
            displayName: 'Text',
            name: 'Text',
            type: 'Text',
            defaultValue: { type: 'UnboundValue', key: 'unbound_uuid1Assembly' },
            required: false,
          },
        },
      },
    },
  };
};

type createAssemblyNodeArgs = {
  id: string;
  blockId?: string;
  unboundValue?: string;
  unboundValueKey?: string;
  boundValueKey?: string;
};

export const createAssemblyNode = ({
  id,
  blockId = defaultAssemblyId,
  unboundValue = 'New year Eve',
  unboundValueKey = undefined,
  boundValueKey = undefined,
}: createAssemblyNodeArgs): ExperienceTreeNode => {
  const node: ExperienceTreeNode = {
    type: ASSEMBLY_NODE_TYPE,
    data: {
      blockId,
      id,
      props: {},
      dataSource: {},
      unboundValues: {},
      breakpoints: [],
    },
    children: [],
    parentId: 'root',
  };
  if (unboundValueKey) {
    node.data.props[assemblyGeneratedVariableName] = {
      type: 'UnboundValue',
      key: unboundValueKey,
    };
    node.data.unboundValues = {
      [unboundValueKey]: { value: unboundValue },
    };
  } else if (boundValueKey) {
    node.data.props[assemblyGeneratedVariableName] = {
      type: 'BoundValue',
      path: `/${boundValueKey}/fields/someFieldId/~locale`,
    };
    node.data.dataSource = {
      [boundValueKey]: {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: 'someEntryId',
        },
      },
    };
  }
  return node;
};
