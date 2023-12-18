import { CONTENTFUL_CONTAINER_ID, LATEST_SCHEMA_VERSION } from '@/constants';
import { Composition, ExperienceEntry, SchemaVersions } from '@/types';
import { entityIds } from './entities';

const compositionFields: Composition = {
  title: 'Test Composition',
  slug: 'test',
  componentTree: {
    children: [
      {
        definitionId: 'component-1',
        variables: {},
        children: [],
      },
      {
        definitionId: 'component-2',
        variables: {},
        children: [],
      },
    ],
    breakpoints: [],
    schemaVersion: '2023-06-27',
  },
  dataSource: {
    uuid2: {
      sys: {
        id: entityIds.ENTRY1,
        type: 'Link',
        linkType: 'Entry',
      },
    },
    uuid3: {
      sys: {
        id: entityIds.ENTRY2,
        type: 'Link',
        linkType: 'Entry',
      },
    },
    uuid4: {
      sys: {
        id: entityIds.ASSET1,
        type: 'Link',
        linkType: 'Asset',
      },
    },
  },
  unboundValues: {
    uuid1: {
      value: 'test',
    },
  },
};

export const compositionEntry: ExperienceEntry = {
  sys: {
    id: 'composition-id',
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
  fields: compositionFields as Composition,
};

type createCompositionEntryArgs = {
  schemaVersion: SchemaVersions;
};

export const createCompositionEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
}: createCompositionEntryArgs): ExperienceEntry => {
  return {
    sys: {
      id: 'composition-id',
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
            definitionId: 'component-1',
            variables: {},
            children: [],
          },
          {
            definitionId: 'component-2',
            variables: {},
            children: [],
          },
        ],
        breakpoints: [],
        schemaVersion,
      },
      dataSource: {
        uuid2: {
          sys: {
            id: entityIds.ENTRY1,
            type: 'Link',
            linkType: 'Entry',
          },
        },
        uuid3: {
          sys: {
            id: entityIds.ENTRY2,
            type: 'Link',
            linkType: 'Entry',
          },
        },
        uuid4: {
          sys: {
            id: entityIds.ASSET1,
            type: 'Link',
            linkType: 'Asset',
          },
        },
      },
      unboundValues: {
        uuid1: {
          value: 'test',
        },
      },
    },
  };
};

export const designComponentGeneratedVariableName = 'text_uuid1DesignComponent';
export const createDesignComponentEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
  id = 'design-component-id',
}: createCompositionEntryArgs & { id: string }) => {
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
