import { CONTENTFUL_COMPONENTS, LATEST_SCHEMA_VERSION } from '@/constants';
import {
  ExperienceComponentSettings,
  ExperienceEntry,
  SchemaVersions,
  ExperienceFields,
} from '@/types';
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
  schemaVersion?: SchemaVersions;
  id?: string;
};

export const createExperienceEntry = ({
  schemaVersion = LATEST_SCHEMA_VERSION,
  id = 'composition-id',
}: createExperienceEntryArgs): ExperienceEntry => {
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

// TODO: Turn global fixture into a factory method to avoid cloning data on the fly
export const experienceEntryFieldsWithFilledUsedComponents: ExperienceFields = {
  title: 'root-experience-1',
  slug: 'root-experience-1',
  componentTree: {
    breakpoints: [
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        displayIcon: 'desktop',
        previewSize: '100%',
      },
    ],
    schemaVersion: '2023-09-28',
    children: [
      {
        displayName: 'Container',
        definitionId: 'contentful-container',
        variables: {
          cfBackgroundColor: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              'test-desktop': 'rgba(240, 112, 182, 1)',
            },
          },
        },
        children: [
          {
            displayName: '[PN] Sample 1',
            definitionId: 'root-pattern-1',
            variables: {
              'e-XwpdP': {
                type: 'UnboundValue',
                key: 'FQQM1q8hyfCKvCQjvGb0a',
              },
              'cf-bg-color-root-pattern-1': {
                type: 'DesignValue',
                valuesByBreakpoint: {
                  'test-desktop': 'rgba(111,  111 , 111, 0)',
                },
              },
            },
            children: [],
          },
        ],
      },
    ],
  },
  dataSource: {},
  unboundValues: {},
  usedComponents: [
    {
      metadata: {
        tags: [],
        concepts: [],
      },
      sys: {
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'test-space',
          },
        },
        type: 'Entry',
        id: 'root-pattern-1',
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'layout',
          },
        },
        revision: 1,
        createdAt: '2023-09-28T00:00:00.000Z',
        updatedAt: '2023-09-28T00:00:00.000Z',
        environment: {
          sys: {
            id: 'master',
            type: 'Link',
            linkType: 'Environment',
          },
        },
        locale: 'en-US',
      },
      fields: {
        title: 'Root Pattern 1',
        slug: 'root-pattern-1',
        componentTree: {
          breakpoints: [
            {
              id: 'test-desktop',
              query: '*',
              displayName: 'All Sizes',
              displayIcon: 'desktop',
              previewSize: '100%',
            },
          ],
          schemaVersion: '2023-09-28',
          children: [
            {
              definitionId: 'contentful-container',
              displayName: 'Container',
              variables: {
                cfBackgroundColor: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    'test-desktop': 'rgba(93, 179, 91, 1)',
                  },
                },
              },
              children: [
                {
                  definitionId: 'nested-pattern-1',
                  displayName: '[NN] sample 1',
                  variables: {
                    lRFhtDQ: {
                      key: '_uKSlt2',
                      type: 'ComponentValue',
                    },
                    'cf-bg-color-nested-pattern-1': {
                      key: 'cf-bg-color-root-pattern-1',
                      type: 'ComponentValue',
                    },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
        dataSource: {},
        unboundValues: {},
        componentSettings: {
          variableDefinitions: {
            _uKSlt2: {
              displayName: 'Background image',
              type: 'Media',
              description: 'Background image for component',
              defaultValue: {
                key: '7VdIpMIm-BKBlFhXXlg-w',
                type: 'UnboundValue',
              },
            },
            'cf-bg-color-root-pattern-1': {
              displayName: 'Background color',
              type: 'Text',
              group: 'style',
              description: 'Background color for button',
              defaultValue: {
                type: 'DesignValue',
                valuesByBreakpoint: { 'test-desktop': 'rgba(189, 147, 147, 0)' },
              },
            },
          },
        },
        usedComponents: [
          {
            metadata: {
              tags: [],
              concepts: [],
            },
            sys: {
              space: {
                sys: {
                  type: 'Link',
                  linkType: 'Space',
                  id: 'tofsejyzyo24',
                },
              },
              type: 'Entry',
              id: 'nested-pattern-1',
              contentType: {
                sys: {
                  type: 'Link',
                  linkType: 'ContentType',
                  id: 'hostedLayout',
                },
              },
              revision: 1,
              environment: {
                sys: {
                  id: 'master',
                  type: 'Link',
                  linkType: 'Environment',
                },
              },
              locale: 'en-US',
              createdAt: '2023-09-28T00:00:00.000Z',
              updatedAt: '2023-09-28T00:00:00.000Z',
            },
            fields: {
              title: 'Nested Pattern 1',
              slug: 'nested-pattern-1',
              componentTree: {
                breakpoints: [
                  {
                    id: 'test-desktop',
                    query: '*',
                    displayName: 'All Sizes',
                    displayIcon: 'desktop',
                    previewSize: '100%',
                  },
                ],
                schemaVersion: '2023-09-28',
                children: [
                  {
                    definitionId: 'contentful-columns',
                    displayName: 'Columns',
                    variables: {
                      cfBackgroundImageUrl: {
                        key: 'lRFhtDQ',
                        type: 'ComponentValue',
                      },
                    },
                    children: [
                      {
                        definitionId: 'contentful-single-column',
                        displayName: 'Column',
                        variables: {},
                        children: [
                          {
                            definitionId: 'contentful-heading',
                            displayName: 'Heading',
                            variables: {},
                            children: [],
                          },
                        ],
                      },
                      {
                        definitionId: 'contentful-single-column',
                        displayName: 'Column',
                        variables: {},
                        children: [
                          {
                            definitionId: 'contentful-button',
                            displayName: 'Button',
                            variables: {
                              cfBackgroundColor: {
                                type: 'ComponentValue', // Exposed variable from nested pattern
                                key: 'cf-bg-color-nested-pattern-1',
                              },
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              dataSource: {},
              unboundValues: {
                z_0NfuFUKFQqHeyWPFVhX: {},
              },
              componentSettings: {
                variableDefinitions: {
                  lRFhtDQ: {
                    displayName: 'Background image',
                    type: 'Media',
                    description: 'Background image for component',
                    defaultValue: {
                      key: 'z_0NfuFUKFQqHeyWPFVhX',
                      type: 'UnboundValue',
                    },
                  },
                  'cf-bg-color-nested-pattern-1': {
                    displayName: 'Background color',
                    type: 'Text',
                    group: 'style',
                    description: 'Background color for button',
                    defaultValue: {
                      type: 'DesignValue',
                      valuesByBreakpoint: { 'test-desktop': 'rgba(0, 0, 0, 0)' },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  ],
};
