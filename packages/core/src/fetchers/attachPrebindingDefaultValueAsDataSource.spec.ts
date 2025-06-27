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
    const getterStub = vi.fn();
    const experience = {
      get fields() {
        getterStub();
        return {
          componentSettings: {
            parameterDefinitions: {},
            variableDefinitions: {},
          },
          dataSource: {},
        };
      },
    } as unknown as ExperienceEntry;

    mockCheckIsAssemblyEntry.mockReturnValue(false);

    attachPrebindingDefaultValueAsDataSource(experience);
    expect(getterStub).not.toHaveBeenCalled();
  });

  it('should not return early if a pattern', () => {
    const getterStub = vi.fn();
    const experience = {
      get fields() {
        getterStub();
        return {
          componentSettings: {
            parameterDefinitions: {},
            variableDefinitions: {},
          },
          dataSource: {},
        };
      },
    } as unknown as ExperienceEntry;

    mockCheckIsAssemblyEntry.mockReturnValue(true);

    attachPrebindingDefaultValueAsDataSource(experience);
    expect(getterStub).toHaveBeenCalled();
  });

  it('should attach default prebinding value to dataSource', () => {
    const defaultId = 'abc123';
    experience.fields = {
      ...experience.fields,
      componentSettings: {
        prebindingDefinitions: [
          {
            id: 'prebindingId',
            parameterDefinitions: {
              someField: {
                defaultSource: {
                  contentTypeId: 'defaultBindingCt',
                  type: 'Entry',
                  link: {
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
          },
        ],
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
          prebindingDefinitions: [
            {
              id: 'prebindingId',
              parameterDefinitions: {
                someField: {
                  contentTypes: {},
                  defaultSource: undefined,
                },
              },
            },
          ],
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
