import * as utils from '@/utils';
import { attachPrebindingDefaultValueAsDataSource } from './attachPrebindingDefaultValueAsDataSource';
import { createExperienceEntry } from '@/test/__fixtures__/experience';
import { ExperienceEntry } from '@/types';
import { describe, it, expect, vi } from 'vitest';

describe('attachPrebindingDefaultValueAsDataSource', () => {
  const mockIsExperienceEntry = vi.spyOn(utils, 'isExperienceEntry');
  let experience = createExperienceEntry({});

  afterEach(() => {
    vi.clearAllMocks();
    experience = createExperienceEntry({});
  });

  it('should attach default prebinding value to dataSource', () => {
    const defaultId = 'abc123';
    experience.fields = {
      ...experience.fields,
      componentSettings: {
        patternPropertyDefinitions: {
          someField: {
            defaultValue: {
              defaultBinding: {
                sys: {
                  id: defaultId,
                  type: 'Link',
                  linkType: 'Entry',
                },
              },
            },
            contentTypes: {},
          },
        },
        variableDefinitions: {},
      },
      dataSource: {},
    };

    mockIsExperienceEntry.mockReturnValue(true);

    attachPrebindingDefaultValueAsDataSource(experience);

    expect(experience.fields.dataSource[defaultId]).toEqual({
      sys: {
        id: defaultId,
        type: 'Link',
        linkType: 'Entry',
      },
    });
  });

  it('should throw if not an experience entry', () => {
    const invalidExperience = {} as unknown as ExperienceEntry;

    mockIsExperienceEntry.mockReturnValue(false);

    expect(() => attachPrebindingDefaultValueAsDataSource(invalidExperience)).toThrow(
      /does not match experience entry schema/,
    );
  });

  it('should do nothing if no default prebinding value exists', () => {
    experience = {
      ...experience,
      fields: {
        ...experience.fields,
        componentSettings: {
          patternPropertyDefinitions: {
            someField: {
              contentTypes: {},
              defaultValue: undefined,
            },
          },
          variableDefinitions: {},
        },
        dataSource: {},
      },
    };

    mockIsExperienceEntry.mockReturnValue(true);

    attachPrebindingDefaultValueAsDataSource(experience);

    expect(experience.fields.dataSource).toEqual({});
  });
});
