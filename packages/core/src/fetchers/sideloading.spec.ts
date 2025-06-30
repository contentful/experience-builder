import * as utils from '@/utils';
import { sideloadPrebindingDefaultValues } from './sideloading';
import {
  createExperienceEntry,
  createAssemblyEntry as createPatternEntry,
} from '@/test/__fixtures__/experience';
import { ExperienceEntry } from '@/types';
import { describe, it, expect, vi } from 'vitest';

describe('sideloadPrebindingDefaultValues', () => {
  const mockCheckIsAssemblyEntry = vi.spyOn(utils, 'checkIsAssemblyEntry');
  let parentPattern = createExperienceEntry({});

  afterEach(() => {
    vi.clearAllMocks();
    parentPattern = createExperienceEntry({});
  });

  it('should return early if not a pattern', () => {
    // We intentionally mock experience as denerate shape {}, to ensure that upon
    // failing to return early, an exception will be thrown eg.
    // during accessing `experience.fields.componentSettings`
    // because `fields` is not defined.
    const experience = {} as unknown as ExperienceEntry;

    mockCheckIsAssemblyEntry.mockReturnValue(false);

    expect(sideloadPrebindingDefaultValues(experience)).toBe(false);
  });

  describe('to sideload prebinding default value - when parent pattern does not have any nested patterns', () => {
    it('should be added to .dataSource when default prebinding value exists', () => {
      const defaultEntryId = 'abc123';
      parentPattern.fields = {
        ...parentPattern.fields,
        componentSettings: {
          parameterDefinitions: {
            ppdId111: {
              defaultSource: {
                type: 'Entry',
                contentTypeId: 'ct111',
                link: {
                  sys: {
                    id: defaultEntryId,
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              },
              contentTypes: {
                ct111: {
                  sys: {
                    id: 'ct111',
                    type: 'Link',
                    linkType: 'ContentType',
                  },
                },
              },
            },
          },
          variableDefinitions: {
            someField: {
              type: 'Text',
            },
          },
          variableMappings: {
            someField: {
              type: 'ContentTypeMapping',
              parameterId: 'ppdId111',
              pathsByContentType: {},
            },
          },
        },
        dataSource: {
          preexistingDsKey123: {
            sys: {
              type: 'Link',
              id: 'preexistingAsset123',
              linkType: 'Asset',
            },
          },
          preexistingDsKey456: {
            sys: {
              type: 'Link',
              id: 'preexistingEntry456',
              linkType: 'Entry',
            },
          },
        },
      };

      mockCheckIsAssemblyEntry.mockReturnValue(true);

      expect(sideloadPrebindingDefaultValues(parentPattern)).toBe(1);

      expect(parentPattern.fields.dataSource[`sideloaded_${defaultEntryId}`]).toEqual({
        sys: {
          id: defaultEntryId,
          type: 'Link',
          linkType: 'Entry',
        },
      });

      // Ensure we don't override existing dataSource keys
      expect(parentPattern.fields.dataSource).toHaveProperty('preexistingDsKey123');
      expect(parentPattern.fields.dataSource).toHaveProperty('preexistingDsKey456');
    });

    // ATM UI does not support multiple patternPropertyDefinitions, but the data structure supports
    // it and sideloadPrebindingDefaultValues() implements it.
    it('should be added to .dataSource when multiple patternPropertyDefinitions exist each with the default prebinding value', () => {
      const defaultEntryIdForCt111 = 'entry111';
      const defaultEntryIdForCt222 = 'entry222';
      parentPattern.fields = {
        ...parentPattern.fields,
        componentSettings: {
          parameterDefinitions: {
            ppdId111: {
              defaultSource: {
                type: 'Entry',
                contentTypeId: 'ct111',
                link: {
                  sys: {
                    id: defaultEntryIdForCt111,
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              },
              contentTypes: {
                ct111: {
                  sys: {
                    id: 'ct111',
                    type: 'Link',
                    linkType: 'ContentType',
                  },
                },
              },
            },
            ppdId222: {
              defaultSource: {
                type: 'Entry',
                contentTypeId: 'ct222',
                link: {
                  sys: {
                    id: defaultEntryIdForCt222,
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              },
              contentTypes: {
                ct222: {
                  sys: {
                    id: 'ct222',
                    type: 'Link',
                    linkType: 'ContentType',
                  },
                },
              },
            },
          },
          variableDefinitions: {
            someField: {
              type: 'Text',
            },
            someField222: {
              type: 'Text',
            },
          },
          variableMappings: {
            someField: {
              type: 'ContentTypeMapping',
              parameterId: 'ppdId111',
              pathsByContentType: {},
            },
            someField222: {
              type: 'ContentTypeMapping',
              parameterId: 'ppdId222',
              pathsByContentType: {},
            },
          },
        },
        dataSource: {
          preexistingDsKey123: {
            sys: {
              type: 'Link',
              id: 'preexistingAsset123',
              linkType: 'Asset',
            },
          },
          preexistingDsKey456: {
            sys: {
              type: 'Link',
              id: 'preexistingEntry456',
              linkType: 'Entry',
            },
          },
        },
      };

      mockCheckIsAssemblyEntry.mockReturnValue(true);

      expect(sideloadPrebindingDefaultValues(parentPattern)).toBe(2);

      expect(parentPattern.fields.dataSource[`sideloaded_${defaultEntryIdForCt111}`]).toEqual({
        sys: {
          id: defaultEntryIdForCt111,
          type: 'Link',
          linkType: 'Entry',
        },
      });
      expect(parentPattern.fields.dataSource[`sideloaded_${defaultEntryIdForCt222}`]).toEqual({
        sys: {
          id: defaultEntryIdForCt222,
          type: 'Link',
          linkType: 'Entry',
        },
      });

      // Ensure we don't override existing dataSource keys
      expect(parentPattern.fields.dataSource).toHaveProperty('preexistingDsKey123');
      expect(parentPattern.fields.dataSource).toHaveProperty('preexistingDsKey456');
    });

    it('should do nothing if no default prebinding value exists', () => {
      parentPattern = {
        ...parentPattern,
        fields: {
          ...parentPattern.fields,
          componentSettings: {
            parameterDefinitions: {
              ppdId111: {
                contentTypes: {
                  ct111: {
                    sys: {
                      id: 'ct111',
                      type: 'Link',
                      linkType: 'ContentType',
                    },
                  },
                },
                defaultSource: undefined,
              },
            },
            variableDefinitions: {
              someField: {
                type: 'Text',
              },
            },
            variableMappings: {
              someField: {
                type: 'ContentTypeMapping',
                parameterId: 'ppdId111',
                pathsByContentType: {},
              },
            },
          },
          dataSource: {},
        },
      };

      mockCheckIsAssemblyEntry.mockReturnValue(true);

      expect(sideloadPrebindingDefaultValues(parentPattern)).toBe(0);

      expect(parentPattern.fields.dataSource).toEqual({});
    });

    it('should do nothing if no default prebinding is not a valid link', () => {
      parentPattern = {
        ...parentPattern,
        fields: {
          ...parentPattern.fields,
          componentSettings: {
            parameterDefinitions: {
              ppdId111: {
                contentTypes: {
                  ct111: {
                    sys: {
                      id: 'ct111',
                      type: 'Link',
                      linkType: 'ContentType',
                    },
                  },
                },
                defaultSource: {
                  type: 'Entry',
                  contentTypeId: 'ct111',
                  link: {
                    sys: {
                      id: 'this-should-be-invalid-link',
                      // @ts-expect-error forcing an invalid type for testing
                      type: 'NOT_A_LINK',
                      linkType: 'Entry',
                    },
                  },
                },
              },
            },
            variableDefinitions: {
              someField: {
                type: 'Text',
              },
            },
            variableMappings: {
              someField: {
                type: 'ContentTypeMapping',
                parameterId: 'ppdId111',
                pathsByContentType: {},
              },
            },
          },
          dataSource: {},
        },
      };

      mockCheckIsAssemblyEntry.mockReturnValue(true);

      expect(sideloadPrebindingDefaultValues(parentPattern)).toBe(0);

      expect(parentPattern.fields.dataSource).toEqual({});
    });
  });

  describe('to sideload prebinding default value - when parent pattern has nested patterns', () => {
    let n1pattern: ExperienceEntry;
    const n1DefaultEntryId = 'n1defaultEntry222';
    beforeEach(() => {
      n1pattern = createPatternEntry({ id: 'n1pattern123' });
      n1pattern.fields.componentSettings = {
        ...n1pattern.fields.componentSettings, // eg. to preserve .variableDefinitions
        parameterDefinitions: {
          n1ppd111: {
            defaultSource: {
              type: 'Entry',
              contentTypeId: 'n1ct111',
              link: {
                sys: {
                  id: n1DefaultEntryId,
                  type: 'Link',
                  linkType: 'Entry',
                },
              },
            },
            contentTypes: {
              n1ct111: {
                sys: {
                  id: 'n1ct111',
                  type: 'Link',
                  linkType: 'ContentType',
                },
              },
            },
          },
        },
        variableDefinitions: {
          n1someField: {
            type: 'Text',
          },
        },
        variableMappings: {
          n1someField: {
            type: 'ContentTypeMapping',
            parameterId: 'n1ppd111',
            pathsByContentType: {},
          },
        },
      };
    });

    it('should be added to .dataSource when default prebinding value exists', () => {
      const defaultEntryId = 'abc123';
      parentPattern.fields = {
        ...parentPattern.fields,
        componentSettings: {
          parameterDefinitions: {
            ppdId111: {
              defaultSource: {
                type: 'Entry',
                contentTypeId: 'ct111',
                link: {
                  sys: {
                    id: defaultEntryId,
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              },
              contentTypes: {
                ct111: {
                  sys: {
                    id: 'ct111',
                    type: 'Link',
                    linkType: 'ContentType',
                  },
                },
              },
            },
          },
          variableDefinitions: {
            someField: {
              type: 'Text',
            },
          },
          variableMappings: {
            someField: {
              type: 'ContentTypeMapping',
              parameterId: 'ppdId111',
              pathsByContentType: {},
            },
          },
        },
        dataSource: {
          preexistingDsKey123: {
            sys: {
              type: 'Link',
              id: 'preexistingAsset123',
              linkType: 'Asset',
            },
          },
          preexistingDsKey456: {
            sys: {
              type: 'Link',
              id: 'preexistingEntry456',
              linkType: 'Entry',
            },
          },
        },
        usedComponents: [n1pattern],
      };

      mockCheckIsAssemblyEntry.mockReturnValue(true);

      expect(sideloadPrebindingDefaultValues(parentPattern)).toBe(2);

      expect(parentPattern.fields.dataSource[`sideloaded_${defaultEntryId}`]).toEqual({
        sys: {
          id: defaultEntryId,
          type: 'Link',
          linkType: 'Entry',
        },
      });

      expect(parentPattern.fields.dataSource[`sideloaded_${n1DefaultEntryId}`]).toEqual({
        sys: {
          id: n1DefaultEntryId,
          type: 'Link',
          linkType: 'Entry',
        },
      });

      // Ensure we don't override existing dataSource keys
      expect(parentPattern.fields.dataSource).toHaveProperty('preexistingDsKey123');
      expect(parentPattern.fields.dataSource).toHaveProperty('preexistingDsKey456');
    });
  });
});
