import {
  CONTENTFUL_CONTAINER_ID,
  ASSEMBLY_NODE_TYPE,
  LATEST_SCHEMA_VERSION,
} from '@contentful/experience-builder-core/constants';
import type {
  CompositionComponentNode,
  SchemaVersions,
} from '@contentful/experience-builder-core/types';

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
      title: 'Test Composition',
      slug: 'test',
      componentTree: {
        children: [
          {
            definitionId: CONTENTFUL_CONTAINER_ID,
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
        breakpoints: [],
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
            id: 'text',
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
}: createAssemblyNodeArgs): CompositionComponentNode => {
  const node: CompositionComponentNode = {
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
