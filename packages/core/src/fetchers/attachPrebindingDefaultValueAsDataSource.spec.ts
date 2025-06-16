import * as utils from '@/utils';
import { attachPrebindingDefaultValueAsDataSource } from './attachPrebindingDefaultValueAsDataSource';
import { createExperienceEntry } from '@/test/__fixtures__/experience';
import { ExperienceEntry } from '@/types';
import { describe, it, expect, vi } from 'vitest';

describe('attachPrebindingDefaultValueAsDataSource', () => {
  const mockCheckIsAssemblyEntry = vi.spyOn(utils, 'checkIsAssemblyEntry');
  let experience = createExperienceEntry({});

  afterEach(() => {
    vi.clearAllMocks();
    experience = createExperienceEntry({});
  });

  it('should return early if not a pattern', () => {
    const experience = {} as unknown as ExperienceEntry;

    mockCheckIsAssemblyEntry.mockReturnValue(false);

    expect(attachPrebindingDefaultValueAsDataSource(experience)).toBeUndefined();
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

    mockCheckIsAssemblyEntry.mockReturnValue(true);

    attachPrebindingDefaultValueAsDataSource(experience);

    expect(experience.fields.dataSource[defaultId]).toEqual({
      sys: {
        id: defaultId,
        type: 'Link',
        linkType: 'Entry',
      },
    });
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

    mockCheckIsAssemblyEntry.mockReturnValue(true);

    attachPrebindingDefaultValueAsDataSource(experience);

    expect(experience.fields.dataSource).toEqual({});
  });
});
