import { CONTENTFUL_COMPONENTS, LATEST_SCHEMA_VERSION } from '@/constants';
import { ExperienceComponentSettings, ExperienceEntry, SchemaVersions } from '@/types';
import { entityIds } from './entities';

const experienceFields: ExperienceEntry['fields'] = {
  title: 'Test Composition',
  slug: 'test',
  componentTree: {
    children: [
      {
        definitionId: 'component-1',
        variables: {},
        children: [
          {
            definitionId: 'Image',
            variables: {
              imageSource: {
                type: 'BoundValue',
                path: '/uuid2/fields/logo/~locale/fields/file/~locale',
              },
            },
            children: [],
          },
        ],
      },
      {
        definitionId: 'component-2',
        variables: {},
        children: [],
      },
    ],
    breakpoints: [{ id: 'desktop', query: '*', previewSize: '100vw', displayName: 'Desktop' }],
    schemaVersion: '2023-09-28',
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

export const experienceEntry: ExperienceEntry = {
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
  fields: experienceFields as ExperienceEntry['fields'],
};

type createExperienceEntryArgs = {
  schemaVersion: SchemaVersions;
};

export const createExperienceEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
}: createExperienceEntryArgs): ExperienceEntry => {
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
        breakpoints: [{ id: 'desktop', query: '*', previewSize: '100vw', displayName: 'Desktop' }],
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

export const assemblyGeneratedVariableName = 'text_uuid1Assembly';
export const assemblyGeneratedDesignVariableName = 'cfWidth_uuid2Assembly';
export const createAssemblyEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
  id = 'assembly-id',
}: createExperienceEntryArgs & { id: string }) => {
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
            variables: {
              cfWidth: {
                type: 'ComponentValue',
                key: assemblyGeneratedDesignVariableName,
              },
            },
            children: [
              {
                definitionId: 'custom-component',
                variables: {
                  text: {
                    type: 'ComponentValue',
                    key: assemblyGeneratedVariableName,
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
            type: 'Text',
            defaultValue: { type: 'UnboundValue', key: 'unbound_uuid1Assembly' },
          },
          [assemblyGeneratedDesignVariableName]: {
            displayName: 'Width',
            type: 'Text',
            group: 'style',
            defaultValue: { type: 'DesignValue', valuesByBreakpoint: { desktop: '42px' } },
          },
        },
      } satisfies ExperienceComponentSettings,
    },
  };
};
