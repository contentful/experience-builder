import {
  CONTENTFUL_COMPONENTS,
  PATTERN_NODE_TYPE,
  LATEST_SCHEMA_VERSION,
} from '@contentful/experiences-core/constants';
import type { ExperienceTreeNode, SchemaVersions } from '@contentful/experiences-core/types';

type createPatternEntryArgs = {
  schemaVersion: SchemaVersions;
  id: string;
};

export const defaultPatternId = 'pattern-id';

export const patternGeneratedVariableName = 'text_uuid1Pattern';
export const createPatternEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
  id = defaultPatternId,
}: createPatternEntryArgs) => {
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
            definitionId: CONTENTFUL_COMPONENTS.container.id,
            variables: {},
            children: [
              {
                definitionId: 'custom-component',
                variables: {
                  text: {
                    key: patternGeneratedVariableName,
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
        unbound_uuid1Pattern: {
          value: 'custom component title',
        },
      },
      componentSettings: {
        variableDefinitions: {
          [patternGeneratedVariableName]: {
            displayName: 'Text',
            name: 'Text',
            type: 'Text',
            defaultValue: { type: 'UnboundValue', key: 'unbound_uuid1Pattern' },
            required: false,
          },
        },
      },
    },
  };
};

type createPatternNodeArgs = {
  id: string;
  blockId?: string;
  unboundValue?: string;
  unboundValueKey?: string;
  boundValueKey?: string;
};

export const createPatternNode = ({
  id,
  blockId = defaultPatternId,
  unboundValue = 'New year Eve',
  unboundValueKey = undefined,
  boundValueKey = undefined,
}: createPatternNodeArgs): ExperienceTreeNode => {
  const node: ExperienceTreeNode = {
    type: PATTERN_NODE_TYPE,
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
    node.data.props[patternGeneratedVariableName] = {
      type: 'UnboundValue',
      key: unboundValueKey,
    };
    node.data.unboundValues = {
      [unboundValueKey]: { value: unboundValue },
    };
  } else if (boundValueKey) {
    node.data.props[patternGeneratedVariableName] = {
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
