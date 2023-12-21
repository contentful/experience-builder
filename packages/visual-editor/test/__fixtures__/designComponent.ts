import {
  CONTENTFUL_CONTAINER_ID,
  DESIGN_COMPONENT_NODE_TYPE,
  LATEST_SCHEMA_VERSION,
} from '@contentful/experience-builder-core/constants';
import type {
  CompositionComponentNode,
  SchemaVersions,
} from '@contentful/experience-builder-core/types';

type createDesignComponentEntryArgs = {
  schemaVersion: SchemaVersions;
  id: string;
};

export const defaultDesignComponentId = 'design-component-id';

export const designComponentGeneratedVariableName = 'text_uuid1DesignComponent';
export const createDesignComponentEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
  id = defaultDesignComponentId,
}: createDesignComponentEntryArgs) => {
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
                    key: designComponentGeneratedVariableName,
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
        unbound_uuid1DesignComponent: {
          value: 'custom component title',
        },
      },
      componentSettings: {
        variableDefinitions: {
          [designComponentGeneratedVariableName]: {
            id: 'text',
            name: 'Text',
            type: 'Text',
            defaultValue: { type: 'UnboundValue', key: 'unbound_uuid1DesignComponent' },
            required: false,
          },
        },
      },
    },
  };
};

type createDesignComponentNodeArgs = {
  id: string;
  blockId?: string;
  unboundValue?: string;
  unboundValueKey?: string;
  boundValueKey?: string;
};

export const createDesignComponentNode = ({
  id,
  blockId = defaultDesignComponentId,
  unboundValue = 'New year Eve',
  unboundValueKey = undefined,
  boundValueKey = undefined,
}: createDesignComponentNodeArgs): CompositionComponentNode => {
  const node: CompositionComponentNode = {
    type: DESIGN_COMPONENT_NODE_TYPE,
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
    node.data.props[designComponentGeneratedVariableName] = {
      type: 'UnboundValue',
      key: unboundValueKey,
    };
    node.data.unboundValues = {
      [unboundValueKey]: { value: unboundValue },
    };
  } else if (boundValueKey) {
    node.data.props[designComponentGeneratedVariableName] = {
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
