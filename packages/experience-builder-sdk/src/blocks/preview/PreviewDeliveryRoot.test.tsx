import React from 'react';
import { render } from '@testing-library/react';
import { debug, EntityStore } from '@contentful/experiences-core';
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot';
import type { Experience } from '@contentful/experiences-core/types';
import { createExperienceEntry } from '../../../test/__fixtures__/composition';
import { assets, entries } from '../../../test/__fixtures__/entities';
import type { Entry } from 'contentful';
import { compatibleVersions } from '../../constants';
import { defineComponents, resetComponentRegistry } from '../../core/componentRegistry';
import { createAssemblyEntry } from '../../../test/__fixtures__';
import { PrebindingManager } from '../../core/preview/PrebindingManager';

const locale = 'en-US';
const experienceEntry = createExperienceEntry({
  schemaVersion: '2023-09-28',
});

const entityStore = new EntityStore({
  experienceEntry: experienceEntry as unknown as Entry,
  entities: [...entries, ...assets],
  locale,
});

const experience: Experience<EntityStore> = {
  entityStore,
};

describe('PreviewDeliveryRoot', () => {
  afterEach(() => {
    resetComponentRegistry();
  });

  it('returns null if experience is not fetched', () => {
    const { container } = render(<PreviewDeliveryRoot locale={locale} experience={experience} />);

    expect(container.childElementCount).toBe(0);
  });

  describe('when the schema version is not compatible', () => {
    let consoleWarnSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(debug, 'warn').mockImplementation(() => {});
    });
    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });
    it('throws an error', () => {
      // @ts-expect-error testing an unsupported version
      const experienceEntryMock = createExperienceEntry({ schemaVersion: '2023-06-27' });

      const entityStore = new EntityStore({
        experienceEntry: experienceEntryMock as unknown as Entry,
        entities: [...entries, ...assets],
        locale,
      });

      const experience: Experience<EntityStore> = {
        entityStore,
      };

      const consoleWarnSpy = jest.spyOn(debug, 'warn');

      render(<PreviewDeliveryRoot locale={locale} experience={experience} />);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `[experiences-sdk-react::PreviewDeliveryRoot] Contentful experience schema version: ${entityStore.schemaVersion} does not match the compatible schema versions: ${compatibleVersions}. Aborting.`,
      );
    });
  });

  it('renders the composition block', () => {
    defineComponents([
      {
        component: () => <div data-test-id="component-1">Component 1</div>,
        definition: {
          id: 'component-1',
          name: 'Component 1',
          variables: {},
        },
      },
    ]);

    const { container, getByTestId } = render(
      <PreviewDeliveryRoot locale={locale} experience={experience} />,
    );

    expect(container.childElementCount).toBe(1);
    expect(getByTestId('component-1')).toBeInTheDocument();
  });

  it('generates the default parameters for the root pattern and passes it down', () => {
    defineComponents([
      {
        component: () => <div data-test-id="parent-pattern-entry-id">Parent pattern entry</div>,
        definition: {
          id: 'pattern-entry-prebinding-definition-id',
          name: 'Pattern Entry with prebinding',
          category: 'Assembly',
          variables: {},
        },
      },
    ]);

    const parentPatternEntry = createAssemblyEntry({
      id: 'parent-pattern-entry-id',
      prebindingDefinitions: [
        {
          id: 'pattern-entry-prebinding-definition-id',
          parameterDefinitions: {
            nativeParamId: {
              contentTypes: ['ct1', 'ct2'],
              defaultSource: {
                type: 'Entry',
                contentTypeId: 'ct1',
                link: {
                  sys: {
                    id: 'default-entry-id-1',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              },
            },
            hoistedParamId1: {
              contentTypes: ['ct1', 'ct2'],
              defaultSource: {
                type: 'Entry',
                contentTypeId: 'ct1',
                link: {
                  sys: {
                    id: 'nested-default-entry-id-2',
                    linkType: 'Entry',
                    type: 'Link',
                  },
                },
              },
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-1',
                  parameterId: 'nested-pattern-native-param-id',
                  prebindingId: 'nested-pattern-prebinding-definition-id',
                },
              ],
            },
            hoistedParamId2: {
              contentTypes: ['ct1', 'ct2'],
              passToNodes: [
                {
                  nodeId: 'nested-pattern-node-id-2',
                  parameterId: 'nested-pattern-native-param-id',
                  prebindingId: 'nested-pattern-prebinding-definition-id',
                },
              ],
            },
          },
          variableMappings: {
            var1: {
              type: 'ContentTypeMapping',
              parameterId: 'nativeParamId',
              pathsByContentType: {
                ct1: {
                  path: '/fields/image/~locale/fields/url/~locale',
                },
                ct2: {
                  path: '/fields/description/~locale',
                },
              },
            },
          },
        },
      ],
    });

    const entityStore = new EntityStore({
      experienceEntry: parentPatternEntry,
      entities: [...entries, ...assets],
      locale,
    });

    const experience: Experience<EntityStore> = {
      entityStore,
    };

    expect(experience.entityStore?.dataSource).toEqual({});

    render(<PreviewDeliveryRoot locale={locale} experience={experience} />);

    // only 2 parameters, because one of the 3 parameters has no defaultSource
    expect(experience.entityStore?.dataSource).toEqual({
      'default-entry-id-1': {
        sys: {
          id: 'default-entry-id-1',
          linkType: 'Entry',
          type: 'Link',
        },
      },
      'nested-default-entry-id-2': {
        sys: {
          id: 'nested-default-entry-id-2',
          linkType: 'Entry',
          type: 'Link',
        },
      },
    });
    expect(PrebindingManager.getAllParameterIdsByNodeId('root')).toEqual([
      'nativeParamId',
      'hoistedParamId1',
      'hoistedParamId2',
    ]);
  });
});
