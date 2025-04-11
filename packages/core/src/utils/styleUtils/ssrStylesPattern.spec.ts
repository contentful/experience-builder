/**
 * FIXME: Drop snapshot tests (i.e. hard comparing the full string including hash)
 * Instead we should test specific atomic functionality. So the test doesn't fail on every
 * single code change but only when the code change would actually break a specific functionality.
 */
import { Asset, Entry } from 'contentful';
import {
  ComponentTreeNode,
  DesignValue,
  ExperienceDataSource,
  ExperienceEntry,
  ExperienceUnboundValues,
} from '../../types';
import { createExperience, detachExperienceStyles } from '../../index';
import { experienceEntryFieldsWithFilledUsedComponents } from '../../test/__fixtures__/experience';
const patternEntry: ExperienceEntry = {
  metadata: {
    tags: [],
  },
  sys: {
    id: '4JYGAfHMSVdWkuf6kbd1n8',
    type: 'Entry',
    locale: 'en-US',
    createdAt: '2024-02-21T16:20:49.414Z',
    updatedAt: '2024-03-05T10:52:46.832Z',
    revision: 1,
    contentType: {
      sys: {
        id: 'contentful-component',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    space: {
      sys: {
        id: 'space-id',
        type: 'Link',
        linkType: 'Space',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
  },
  fields: {
    title: 'Hero image',
    slug: 'hero-image-XpKBMxZnNvaLPm5rZXp3c',
    componentTree: {
      schemaVersion: '2023-09-28',
      breakpoints: [
        {
          id: 'desktop',
          query: '*',
          displayName: 'All Sizes',
          previewSize: '100%',
        },
        {
          id: 'tablet',
          query: '<992px',
          displayName: 'Tablet',
          previewSize: '820px',
        },
        {
          id: 'mobile',
          query: '<576px',
          displayName: 'Mobile',
          previewSize: '390px',
        },
      ],
      children: [
        {
          definitionId: 'contentful-columns',
          variables: {
            cfMargin: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '0 Auto 0 Auto',
              },
            },
            cfWidth: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'fill',
              },
            },
            cfMaxWidth: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '1192px',
              },
            },
            cfPadding: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '10px 10px 10px 10px',
              },
            },
            cfBackgroundColor: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'rgba(255, 255, 255, 0)',
              },
            },
            cfBorder: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '0px outside rgba(255, 255, 255, 0)',
              },
            },
            cfBackgroundImageUrl: {
              key: 'cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88',
              type: 'ComponentValue',
            },
            cfGap: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '10px 10px',
              },
            },
            cfBackgroundImageScaling: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'fit',
              },
            },
            cfBackgroundImageAlignment: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'left top',
              },
            },
            cfColumns: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '[6,6]',
              },
            },
            cfWrapColumns: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: false,
              },
            },
            cfWrapColumnsCount: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '2',
              },
            },
          },
          children: [
            {
              definitionId: 'contentful-single-column',
              variables: {
                cfVerticalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'start',
                  },
                },
                cfHorizontalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'center',
                  },
                },
                cfPadding: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0 0 0 0',
                  },
                },
                cfBackgroundColor: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'rgba(255, 255, 255, 0)',
                  },
                },
                cfFlexDirection: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'column',
                  },
                },
                cfFlexWrap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'nowrap',
                  },
                },
                cfBorder: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px outside rgba(255, 255, 255, 0)',
                  },
                },
                cfGap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px 0px',
                  },
                },
                cfBackgroundImageUrl: {
                  key: 'y-jkcH7tyRZjjY-fukECH',
                  type: 'UnboundValue',
                },
                cfBackgroundImageScaling: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'fit',
                  },
                },
                cfBackgroundImageAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'left top',
                  },
                },
                cfColumnSpan: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '6',
                  },
                },
                cfColumnSpanLock: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: false,
                  },
                },
              },
              children: [
                {
                  definitionId: 'heading',
                  variables: {
                    text: {
                      key: 'text_4aWMAKDfoDI5kWX7L3N-t',
                      type: 'ComponentValue',
                    },
                    type: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'h1',
                      },
                    },
                    textAlign: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    color: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'fill',
                      },
                    },
                    cfMaxWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'none',
                      },
                    },
                  },
                  children: [],
                },
                {
                  definitionId: 'text',
                  variables: {
                    text: {
                      key: 'text_yZeyLCpBGe-Q5ZCQ6POKF',
                      type: 'ComponentValue',
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'fill',
                      },
                    },
                    cfMaxWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'none',
                      },
                    },
                    cfFontSize: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '16px',
                      },
                    },
                    cfFontWeight: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '400',
                      },
                    },
                    cfLineHeight: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '20px',
                      },
                    },
                    cfLetterSpacing: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0px',
                      },
                    },
                    cfTextColor: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'rgba(0, 0, 0, 1)',
                      },
                    },
                    cfTextAlign: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'left',
                      },
                    },
                    cfTextTransform: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'none',
                      },
                    },
                    cfTextBold: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: false,
                      },
                    },
                    cfTextItalic: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: false,
                      },
                    },
                    cfTextUnderline: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: false,
                      },
                    },
                  },
                  children: [],
                },
                {
                  definitionId: 'button',
                  variables: {
                    label: {
                      key: 'label_ReqsD8BhJLQ_-LEQQsFmf',
                      type: 'ComponentValue',
                    },
                    targetUrl: {
                      key: 'targetUrl_ReqsD8BhJLQ_-LEQQsFmf',
                      type: 'ComponentValue',
                    },
                    variant: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                  },
                  children: [],
                },
              ],
            },
            {
              definitionId: 'contentful-single-column',
              variables: {
                cfVerticalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'center',
                  },
                },
                cfHorizontalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'center',
                  },
                },
                cfPadding: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0 0 0 0',
                  },
                },
                cfBackgroundColor: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'rgba(255, 255, 255, 0)',
                  },
                },
                cfFlexDirection: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'column',
                  },
                },
                cfFlexWrap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'nowrap',
                  },
                },
                cfBorder: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px outside rgba(255, 255, 255, 0)',
                  },
                },
                cfGap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px 0px',
                  },
                },
                cfBackgroundImageUrl: {
                  key: 'KAWCUcizVSEoTtSPste7S',
                  type: 'UnboundValue',
                },
                cfBackgroundImageScaling: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'fit',
                  },
                },
                cfBackgroundImageAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'left top',
                  },
                },
                cfColumnSpan: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '6',
                  },
                },
                cfColumnSpanLock: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: false,
                  },
                },
              },
              children: [
                {
                  definitionId: 'Image',
                  variables: {
                    alt: {
                      key: 'alt_GQZDBcONTKHYmPU-nOPlw',
                      type: 'ComponentValue',
                    },
                    url: {
                      key: 'url_GQZDBcONTKHYmPU-nOPlw',
                      type: 'ComponentValue',
                    },
                    width: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
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
      '9Ew1GTxkZvOXiBZxKPCSC': {
        value: '',
      },
      'y-jkcH7tyRZjjY-fukECH': {
        value: '',
      },
      OK5AKAasFE9EoMRngKZTC: {
        value: 'Lorem ipsum',
      },
      qaov8cyn5yUVk0tA6Nrdr: {
        value: 'Lorem ipsum',
      },
      QyZuk2tCmN0UwsRZuq9Wm: {
        value: 'Lorem ipsum',
      },
      'dgl5-6XS2CxI24GQ2b2rl': {
        value: '/',
      },
      KAWCUcizVSEoTtSPste7S: {
        value: '',
      },
      QbZdm2qAJt8U14BL2ptcq: {},
      md0XbAEkEck8ZACOrXppn: {
        value:
          'https://images.ctfassets.net/tofsejyzyo24/5owPX1vp6cXDZr7QOabwzT/d5580f5b4dbad3f74c87ce2f03efa581/Image_container.png',
      },
    },
    componentSettings: {
      variableDefinitions: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
        'text_4aWMAKDfoDI5kWX7L3N-t': {
          displayName: 'Text',
          defaultValue: {
            key: 'OK5AKAasFE9EoMRngKZTC',
            type: 'UnboundValue',
          },
          type: 'Text',
          group: 'content',
        },
        'text_yZeyLCpBGe-Q5ZCQ6POKF': {
          displayName: 'Text',
          type: 'Text',
          defaultValue: {
            key: 'qaov8cyn5yUVk0tA6Nrdr',
            type: 'UnboundValue',
          },
          group: 'content',
        },
        'label_ReqsD8BhJLQ_-LEQQsFmf': {
          displayName: 'Label',
          type: 'Text',
          defaultValue: {
            key: 'QyZuk2tCmN0UwsRZuq9Wm',
            type: 'UnboundValue',
          },
          group: 'content',
        },
        'targetUrl_ReqsD8BhJLQ_-LEQQsFmf': {
          displayName: 'Target URL',
          type: 'Text',
          defaultValue: {
            key: 'dgl5-6XS2CxI24GQ2b2rl',
            type: 'UnboundValue',
          },
          group: 'content',
        },
        'alt_GQZDBcONTKHYmPU-nOPlw': {
          displayName: 'Alt',
          type: 'Text',
          group: 'content',
          defaultValue: {
            key: 'QbZdm2qAJt8U14BL2ptcq',
            type: 'UnboundValue',
          },
        },
        'url_GQZDBcONTKHYmPU-nOPlw': {
          displayName: 'Image Url',
          type: 'Media',
          defaultValue: {
            key: 'md0XbAEkEck8ZACOrXppn',
            type: 'UnboundValue',
          },
          group: 'content',
        },
      },
    },
  },
};

const editablePatternEntry: ExperienceEntry = {
  metadata: {
    tags: [],
  },
  sys: {
    id: '4JYGAfHMSVdWkuf6kbd1n8-EditablePattern',
    type: 'Entry',
    locale: 'en-US',
    createdAt: '2024-02-21T16:20:49.414Z',
    updatedAt: '2024-03-05T10:52:46.832Z',
    revision: 1,
    contentType: {
      sys: {
        id: 'contentful-component',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    space: {
      sys: {
        id: 'space-id',
        type: 'Link',
        linkType: 'Space',
      },
    },
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
  },
  fields: {
    title: 'Hero image',
    slug: 'hero-image-XpKBMxZnNvaLPm5rZXp3c',
    componentTree: {
      schemaVersion: '2023-09-28',
      breakpoints: [
        {
          id: 'desktop',
          query: '*',
          displayName: 'All Sizes',
          previewSize: '100%',
        },
        {
          id: 'tablet',
          query: '<992px',
          displayName: 'Tablet',
          previewSize: '820px',
        },
        {
          id: 'mobile',
          query: '<576px',
          displayName: 'Mobile',
          previewSize: '390px',
        },
      ],
      children: [
        {
          definitionId: 'contentful-columns',
          variables: {
            cfMargin: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '0 Auto 0 Auto',
              },
            },
            cfWidth: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'fill',
              },
            },
            cfMaxWidth: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '1192px',
              },
            },
            cfPadding: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '10px 10px 10px 10px',
              },
            },
            cfBackgroundColor: {
              key: 'cfBackgroundColor_yZeyLCpBGeQ5ZCQ6POKF',
              type: 'ComponentValue',
            },
            cfBorder: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '0px outside rgba(255, 255, 255, 0)',
              },
            },
            cfBackgroundImageUrl: {
              key: 'cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88',
              type: 'ComponentValue',
            },
            cfGap: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '10px 10px',
              },
            },
            cfBackgroundImageScaling: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'fit',
              },
            },
            cfBackgroundImageAlignment: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'left top',
              },
            },
            cfColumns: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '[6,6]',
              },
            },
            cfWrapColumns: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: false,
              },
            },
            cfWrapColumnsCount: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '2',
              },
            },
          },
          children: [
            {
              definitionId: 'contentful-single-column',
              variables: {
                cfVerticalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'start',
                  },
                },
                cfHorizontalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'center',
                  },
                },
                cfPadding: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0 0 0 0',
                  },
                },
                cfBackgroundColor: {
                  key: 'cfBackgroundColor_yZeyLCpBGeQ5ZCQ6POKF',
                  type: 'ComponentValue',
                },
                cfFlexDirection: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'column',
                  },
                },
                cfFlexWrap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'nowrap',
                  },
                },
                cfBorder: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px outside rgba(255, 255, 255, 0)',
                  },
                },
                cfGap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px 0px',
                  },
                },
                cfBackgroundImageUrl: {
                  key: 'y-jkcH7tyRZjjY-fukECH',
                  type: 'UnboundValue',
                },
                cfBackgroundImageScaling: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'fit',
                  },
                },
                cfBackgroundImageAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'left top',
                  },
                },
                cfColumnSpan: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '6',
                  },
                },
                cfColumnSpanLock: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: false,
                  },
                },
              },
              children: [
                {
                  definitionId: 'heading',
                  variables: {
                    text: {
                      key: 'text_4aWMAKDfoDI5kWX7L3N-t',
                      type: 'ComponentValue',
                    },
                    type: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'h1',
                      },
                    },
                    textAlign: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    color: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'fill',
                      },
                    },
                    cfMaxWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'none',
                      },
                    },
                  },
                  children: [],
                },
                {
                  definitionId: 'text',
                  variables: {
                    text: {
                      key: 'text_yZeyLCpBGe-Q5ZCQ6POKF',
                      type: 'ComponentValue',
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'fill',
                      },
                    },
                    cfMaxWidth: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'none',
                      },
                    },
                    cfFontSize: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '16px',
                      },
                    },
                    cfFontWeight: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '400',
                      },
                    },
                    cfLineHeight: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '20px',
                      },
                    },
                    cfLetterSpacing: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0px',
                      },
                    },
                    cfTextColor: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'rgba(0, 0, 0, 1)',
                      },
                    },
                    cfTextAlign: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'left',
                      },
                    },
                    cfTextTransform: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: 'none',
                      },
                    },
                    cfTextBold: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: false,
                      },
                    },
                    cfTextItalic: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: false,
                      },
                    },
                    cfTextUnderline: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: false,
                      },
                    },
                  },
                  children: [],
                },
                {
                  definitionId: 'button',
                  variables: {
                    label: {
                      key: 'label_ReqsD8BhJLQ_-LEQQsFmf',
                      type: 'ComponentValue',
                    },
                    targetUrl: {
                      key: 'targetUrl_ReqsD8BhJLQ_-LEQQsFmf',
                      type: 'ComponentValue',
                    },
                    variant: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                  },
                  children: [],
                },
              ],
            },
            {
              definitionId: 'contentful-single-column',
              variables: {
                cfVerticalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'center',
                  },
                },
                cfHorizontalAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'center',
                  },
                },
                cfPadding: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0 0 0 0',
                  },
                },
                cfBackgroundColor: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'rgba(255, 255, 255, 0)',
                  },
                },
                cfFlexDirection: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'column',
                  },
                },
                cfFlexWrap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'nowrap',
                  },
                },
                cfBorder: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px outside rgba(255, 255, 255, 0)',
                  },
                },
                cfGap: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '0px 0px',
                  },
                },
                cfBackgroundImageUrl: {
                  key: 'KAWCUcizVSEoTtSPste7S',
                  type: 'UnboundValue',
                },
                cfBackgroundImageScaling: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'fit',
                  },
                },
                cfBackgroundImageAlignment: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: 'left top',
                  },
                },
                cfColumnSpan: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: '6',
                  },
                },
                cfColumnSpanLock: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: false,
                  },
                },
              },
              children: [
                {
                  definitionId: 'Image',
                  variables: {
                    alt: {
                      key: 'alt_GQZDBcONTKHYmPU-nOPlw',
                      type: 'ComponentValue',
                    },
                    url: {
                      key: 'url_GQZDBcONTKHYmPU-nOPlw',
                      type: 'ComponentValue',
                    },
                    width: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {},
                    },
                    cfMargin: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
                    },
                    cfPadding: {
                      type: 'DesignValue',
                      valuesByBreakpoint: {
                        desktop: '0 0 0 0',
                      },
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
      '9Ew1GTxkZvOXiBZxKPCSC': {
        value: '',
      },
      'y-jkcH7tyRZjjY-fukECH': {
        value: '',
      },
      OK5AKAasFE9EoMRngKZTC: {
        value: 'Lorem ipsum',
      },
      qaov8cyn5yUVk0tA6Nrdr: {
        value: 'Lorem ipsum',
      },
      QyZuk2tCmN0UwsRZuq9Wm: {
        value: 'Lorem ipsum',
      },
      'dgl5-6XS2CxI24GQ2b2rl': {
        value: '/',
      },
      KAWCUcizVSEoTtSPste7S: {
        value: '',
      },
      QbZdm2qAJt8U14BL2ptcq: {},
      md0XbAEkEck8ZACOrXppn: {
        value:
          'https://images.ctfassets.net/tofsejyzyo24/5owPX1vp6cXDZr7QOabwzT/d5580f5b4dbad3f74c87ce2f03efa581/Image_container.png',
      },
    },
    componentSettings: {
      variableDefinitions: {
        cfBackgroundColor_yZeyLCpBGeQ5ZCQ6POKF: {
          displayName: 'Background Color',
          type: 'Text',
          group: 'style',
          defaultValue: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: 'rgba(255, 255, 255, 0)',
            },
          },
          description: 'Background image for section or container',
        },
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
        'text_4aWMAKDfoDI5kWX7L3N-t': {
          displayName: 'Text',
          defaultValue: {
            key: 'OK5AKAasFE9EoMRngKZTC',
            type: 'UnboundValue',
          },
          type: 'Text',
          group: 'content',
        },
        'text_yZeyLCpBGe-Q5ZCQ6POKF': {
          displayName: 'Text',
          type: 'Text',
          defaultValue: {
            key: 'qaov8cyn5yUVk0tA6Nrdr',
            type: 'UnboundValue',
          },
          group: 'content',
        },
        'label_ReqsD8BhJLQ_-LEQQsFmf': {
          displayName: 'Label',
          type: 'Text',
          defaultValue: {
            key: 'QyZuk2tCmN0UwsRZuq9Wm',
            type: 'UnboundValue',
          },
          group: 'content',
        },
        'targetUrl_ReqsD8BhJLQ_-LEQQsFmf': {
          displayName: 'Target URL',
          type: 'Text',
          defaultValue: {
            key: 'dgl5-6XS2CxI24GQ2b2rl',
            type: 'UnboundValue',
          },
          group: 'content',
        },
        'alt_GQZDBcONTKHYmPU-nOPlw': {
          displayName: 'Alt',
          type: 'Text',
          group: 'content',
          defaultValue: {
            key: 'QbZdm2qAJt8U14BL2ptcq',
            type: 'UnboundValue',
          },
        },
        'url_GQZDBcONTKHYmPU-nOPlw': {
          displayName: 'Image Url',
          type: 'Media',
          defaultValue: {
            key: 'md0XbAEkEck8ZACOrXppn',
            type: 'UnboundValue',
          },
          group: 'content',
        },
      },
    },
  },
};

const getExperienceEntryWithNode = ({
  node,
  unboundValues = {},
  dataSource = {},
  usedComponents = undefined,
}: {
  node: ComponentTreeNode;
  unboundValues?: ExperienceUnboundValues;
  dataSource?: ExperienceDataSource;
  usedComponents?: Array<ExperienceEntry>;
}): ExperienceEntry => {
  return {
    sys: {
      id: 'test-id',
      type: 'Entry',
      locale: 'en-US',
      contentType: {
        sys: {
          id: 'test-content-type-id',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      space: {
        sys: {
          id: 'test-space-id',
          type: 'Link',
          linkType: 'Space',
        },
      },
      environment: {
        sys: {
          id: 'test-environmnet-id',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 1,
      createdAt: '2021-07-07T00:00:00Z',
      updatedAt: '2021-07-07T00:00:00Z',
    },
    fields: {
      title: 'GlaDOS',
      slug: '/test-entry',
      componentTree: {
        breakpoints: [
          {
            id: 'desktop',
            query: '*',
            displayName: 'All Sizes',
            previewSize: '100%',
          },
          {
            id: 'tablet',
            query: '<992px',
            displayName: 'Tablet',
            previewSize: '820px',
          },
          {
            id: 'mobile',
            query: '<576px',
            displayName: 'Mobile',
            previewSize: '390px',
          },
        ],
        schemaVersion: '2023-09-28',
        children: [node],
      },
      dataSource,
      unboundValues,
      usedComponents,
    },
    metadata: {
      tags: [],
    },
  };
};

describe('pattern component', () => {
  it('should extract media query css', () => {
    const patternNode: ComponentTreeNode = {
      definitionId: '4JYGAfHMSVdWkuf6kbd1n8',
      id: 'random-id',
      variables: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          type: 'UnboundValue',
          key: '9TLvjMnVsdRjmY1ubLNoy',
        },
        'text_4aWMAKDfoDI5kWX7L3N-t': {
          path: '/44VNjJs2idfY07POQ__X8/fields/title/~locale',
          type: 'BoundValue',
        },
        'text_yZeyLCpBGe-Q5ZCQ6POKF': {
          type: 'UnboundValue',
          key: 'nd1ip1F1Qb8M8CHzfIJ9M',
        },
        'label_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: '2U2Pjx_SAg4fY9uFBmtPZ',
        },
        'targetUrl_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: 'khZLhNHYnmfN834xJhmmb',
        },
        'alt_GQZDBcONTKHYmPU-nOPlw': {
          type: 'UnboundValue',
          key: 'Q2Nxbd109_raK29mhzNHJ',
        },
        'url_GQZDBcONTKHYmPU-nOPlw': {
          path: '/Bw0eYqeQVjz4vfkJPlZUe/fields/file/~locale',
          type: 'BoundValue',
        },
      },
      children: [],
    };

    const experienceEntry = getExperienceEntryWithNode({
      node: patternNode,
      unboundValues: {
        '2U2Pjx_SAg4fY9uFBmtPZ': {
          value: 'Lorem ipsum',
        },
        '9TLvjMnVsdRjmY1ubLNoy': {
          value: '',
        },
        Q2Nxbd109_raK29mhzNHJ: {},
        khZLhNHYnmfN834xJhmmb: {
          value: '/',
        },
        nd1ip1F1Qb8M8CHzfIJ9M: {
          value: 'Lorem ipsum',
        },
      },
      dataSource: {
        '44VNjJs2idfY07POQ__X8': {
          sys: {
            id: 'bound-asset-id',
            type: 'Link',
            linkType: 'Asset',
          },
        },
        Bw0eYqeQVjz4vfkJPlZUe: {
          sys: {
            id: 'bound-asset-id',
            type: 'Link',
            linkType: 'Asset',
          },
        },
      },
      usedComponents: [patternEntry],
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [patternEntry as Entry],
      referencedAssets: [],
    });

    const styles = detachExperienceStyles(experience);

    const resolvedPatternEntry = experience.entityStore?.usedComponents[0] as ExperienceEntry;
    const patternWrapper = experienceEntry.fields.componentTree.children[0];
    const queue = [...resolvedPatternEntry.fields.componentTree.children];

    expect(patternWrapper.variables.cfSsrClassName.type).toBe('DesignValue');
    while (queue.length) {
      const node = queue.shift();

      if (!node) {
        continue;
      }

      const patternNodeIdsChain = `${patternNode.id}${node.id}`;

      expect(patternWrapper.variables.cfSsrClassName[patternNodeIdsChain]).toBeDefined();
      expect(
        (patternWrapper.variables.cfSsrClassName[patternNodeIdsChain] as DesignValue)
          .valuesByBreakpoint.desktop,
      ).toBeDefined();
      if (node?.children.length) {
        queue.push(...node.children);
      }
    }

    expect(styles).toMatchInlineSnapshot(
      `".cf-fb5147aff29cf3474d7f68cd382ba916{box-sizing:border-box;margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:100%;max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;}.cf-1031d744e26de7b4e9422de0e74ae5cd{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-4c0b9d7e44ec5898b6f5480ac5b1a634{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-2745e04133568665b6d779d76342d59f{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;}.cf-fe878a9e705110f2fee7b5698943918a{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0px;color:rgba(0, 0, 0, 1);text-align:left;text-transform:none;}.cf-0326e88429ff35544d5acf70391db2b2{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}@media(max-width:992px){.cf-92b718a315702272accd18eb39a4a427{box-sizing:border-box;}}@media(max-width:576px){.cf-8187cd93307f9e0ceffff3cad17ce4d3{box-sizing:border-box;}}"`,
    );
  });

  it('should resolve binding to an asset and get background-image in extracted css', () => {
    const patternNode: ComponentTreeNode = {
      definitionId: '4JYGAfHMSVdWkuf6kbd1n8',
      variables: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          type: 'BoundValue',
          path: '/9TLvjMnVsdRjmY1ubLNoy/fields/file/url/~locale',
        },
        'text_4aWMAKDfoDI5kWX7L3N-t': {
          path: '/44VNjJs2idfY07POQ__X8/fields/title/~locale',
          type: 'BoundValue',
        },
        'text_yZeyLCpBGe-Q5ZCQ6POKF': {
          type: 'UnboundValue',
          key: 'nd1ip1F1Qb8M8CHzfIJ9M',
        },
        'label_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: '2U2Pjx_SAg4fY9uFBmtPZ',
        },
        'targetUrl_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: 'khZLhNHYnmfN834xJhmmb',
        },
        'alt_GQZDBcONTKHYmPU-nOPlw': {
          type: 'UnboundValue',
          key: 'Q2Nxbd109_raK29mhzNHJ',
        },
        'url_GQZDBcONTKHYmPU-nOPlw': {
          type: 'UnboundValue',
          key: 'Bw0eYqeQVjz4vfkJPlZUe',
        },
      },
      children: [],
    };

    const boundAsset: Asset = {
      sys: {
        id: 'bound-asset-id',
        type: 'Asset',
        locale: 'en-US',
      },
      fields: {
        title: 'Test Asset',
        file: {
          url: 'https://www.contentful.com/image-asset.jpg',
        },
      },
    } as unknown as Asset;

    const experienceEntry = getExperienceEntryWithNode({
      node: patternNode,
      unboundValues: {
        '2U2Pjx_SAg4fY9uFBmtPZ': {
          value: 'Lorem ipsum',
        },
        Q2Nxbd109_raK29mhzNHJ: {},
        khZLhNHYnmfN834xJhmmb: {
          value: '/',
        },
        nd1ip1F1Qb8M8CHzfIJ9M: {
          value: 'Lorem ipsum',
        },
        Bw0eYqeQVjz4vfkJPlZUe: {
          value: '',
        },
      },
      dataSource: {
        '44VNjJs2idfY07POQ__X8': {
          sys: {
            id: boundAsset.sys.id,
            type: 'Link',
            linkType: 'Asset',
          },
        },
        '9TLvjMnVsdRjmY1ubLNoy': {
          sys: {
            id: boundAsset.sys.id,
            type: 'Link',
            linkType: 'Asset',
          },
        },
      },
      usedComponents: [patternEntry],
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [patternEntry as Entry],
      referencedAssets: [boundAsset],
    });

    const styles = detachExperienceStyles(experience);

    const patternTreeNode = experienceEntry.fields.componentTree.children[0];
    const queue = [...patternTreeNode.children];

    // classname property is added to each individual node, which makes a pattern,
    // so the next code traverses over the pattern nodes and checks for the classname property
    while (queue.length) {
      const node = queue.shift();

      if (!node) {
        continue;
      }

      expect(node.variables.cfSsrClassName).toBeDefined();
      expect(node.variables.cfSsrClassName.type).toBe('DesignValue');
      expect(
        (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop,
      ).toBeDefined();

      expect(
        (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
      ).not.toBeDefined();
      expect(
        (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
      ).not.toBeDefined();

      if (node?.children.length) {
        queue.push(...node.children);
      }
    }

    expect(styles).toMatchInlineSnapshot(
      `".cf-b273d5086ed8b6bec34c3266055cef11{box-sizing:border-box;margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:100%;max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;background-image:url(https://www.contentful.com/image-asset.jpg);background-repeat:no-repeat;}.cf-1031d744e26de7b4e9422de0e74ae5cd{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-4c0b9d7e44ec5898b6f5480ac5b1a634{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-2745e04133568665b6d779d76342d59f{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;}.cf-fe878a9e705110f2fee7b5698943918a{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0px;color:rgba(0, 0, 0, 1);text-align:left;text-transform:none;}.cf-0326e88429ff35544d5acf70391db2b2{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}@media(max-width:992px){.cf-92b718a315702272accd18eb39a4a427{box-sizing:border-box;}}@media(max-width:576px){.cf-8187cd93307f9e0ceffff3cad17ce4d3{box-sizing:border-box;}}"`,
    );
    expect(styles).toContain(`background-image:url(${boundAsset.fields.file?.url})`);
  });

  it('should resolve deep binding to an asset and get background-image in extracted css', () => {
    const patternNode: ComponentTreeNode = {
      definitionId: '4JYGAfHMSVdWkuf6kbd1n8',
      variables: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          type: 'BoundValue',
          path: '/9TLvjMnVsdRjmY1ubLNoy/fields/assetReference/~locale/file/url/~locale',
        },
        'text_4aWMAKDfoDI5kWX7L3N-t': {
          path: '/44VNjJs2idfY07POQ__X8/fields/title/~locale',
          type: 'BoundValue',
        },
        'text_yZeyLCpBGe-Q5ZCQ6POKF': {
          type: 'UnboundValue',
          key: 'nd1ip1F1Qb8M8CHzfIJ9M',
        },
        'label_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: '2U2Pjx_SAg4fY9uFBmtPZ',
        },
        'targetUrl_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: 'khZLhNHYnmfN834xJhmmb',
        },
        'alt_GQZDBcONTKHYmPU-nOPlw': {
          type: 'UnboundValue',
          key: 'Q2Nxbd109_raK29mhzNHJ',
        },
        'url_GQZDBcONTKHYmPU-nOPlw': {
          type: 'UnboundValue',
          key: 'Bw0eYqeQVjz4vfkJPlZUe',
        },
      },
      children: [],
    };

    const referencedAsset: Asset = {
      sys: {
        id: 'bound-asset-id',
        type: 'Asset',
        locale: 'en-US',
      },
      fields: {
        title: 'Test Asset',
        file: {
          url: 'https://www.contentful.com/image-asset.jpg',
        },
      },
    } as unknown as Asset;

    const boundEntry: Entry = {
      sys: {
        id: 'bound-entry-id',
        type: 'Entry',
        locale: 'en-US',
      },
      fields: {
        title: 'Test Entry',
        assetReference: {
          sys: {
            id: referencedAsset.sys.id,
            type: 'Link',
            linkType: 'Asset',
          },
        },
      },
    } as unknown as Entry;

    const experienceEntry = getExperienceEntryWithNode({
      node: patternNode,
      unboundValues: {
        '2U2Pjx_SAg4fY9uFBmtPZ': {
          value: 'Lorem ipsum',
        },
        Q2Nxbd109_raK29mhzNHJ: {},
        khZLhNHYnmfN834xJhmmb: {
          value: '/',
        },
        nd1ip1F1Qb8M8CHzfIJ9M: {
          value: 'Lorem ipsum',
        },
        Bw0eYqeQVjz4vfkJPlZUe: {
          value: '',
        },
      },
      dataSource: {
        '44VNjJs2idfY07POQ__X8': {
          sys: {
            id: referencedAsset.sys.id,
            type: 'Link',
            linkType: 'Asset',
          },
        },
        '9TLvjMnVsdRjmY1ubLNoy': {
          sys: {
            id: boundEntry.sys.id,
            type: 'Link',
            linkType: 'Entry',
          },
        },
      },
      usedComponents: [patternEntry],
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [patternEntry as Entry, boundEntry],
      referencedAssets: [referencedAsset],
    });

    const styles = detachExperienceStyles(experience);

    const patternTreeNode = experienceEntry.fields.componentTree.children[0];
    const queue = [...patternTreeNode.children];

    // classname property is added to each individual node, which makes a pattern,
    // so the next code traverses over the pattern nodes and checks for the classname property
    while (queue.length) {
      const node = queue.shift();

      if (!node) {
        continue;
      }

      expect(node.variables.cfSsrClassName).toBeDefined();
      expect(node.variables.cfSsrClassName.type).toBe('DesignValue');
      expect(
        (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop,
      ).toBeDefined();

      expect(
        (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
      ).not.toBeDefined();
      expect(
        (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
      ).not.toBeDefined();

      if (node?.children.length) {
        queue.push(...node.children);
      }
    }

    expect(styles).toMatchInlineSnapshot(
      `".cf-b273d5086ed8b6bec34c3266055cef11{box-sizing:border-box;margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:100%;max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;background-image:url(https://www.contentful.com/image-asset.jpg);background-repeat:no-repeat;}.cf-1031d744e26de7b4e9422de0e74ae5cd{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-4c0b9d7e44ec5898b6f5480ac5b1a634{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-2745e04133568665b6d779d76342d59f{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;}.cf-fe878a9e705110f2fee7b5698943918a{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0px;color:rgba(0, 0, 0, 1);text-align:left;text-transform:none;}.cf-0326e88429ff35544d5acf70391db2b2{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}@media(max-width:992px){.cf-92b718a315702272accd18eb39a4a427{box-sizing:border-box;}}@media(max-width:576px){.cf-8187cd93307f9e0ceffff3cad17ce4d3{box-sizing:border-box;}}"`,
    );
    expect(styles).toContain(`background-image:url(${referencedAsset.fields.file?.url})`);
  });

  it('should resolve styles for a pattern with exposed design properties', () => {
    const patternNode: ComponentTreeNode = {
      definitionId: '4JYGAfHMSVdWkuf6kbd1n8-EditablePattern',
      variables: {
        cfBackgroundColor_yZeyLCpBGeQ5ZCQ6POKF: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: 'rgba(270, 154, 255, 0)',
          },
        },
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          type: 'UnboundValue',
          key: '9TLvjMnVsdRjmY1ubLNoy',
        },
        'text_4aWMAKDfoDI5kWX7L3N-t': {
          path: '/44VNjJs2idfY07POQ__X8/fields/title/~locale',
          type: 'BoundValue',
        },
        'text_yZeyLCpBGe-Q5ZCQ6POKF': {
          type: 'UnboundValue',
          key: 'nd1ip1F1Qb8M8CHzfIJ9M',
        },
        'label_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: '2U2Pjx_SAg4fY9uFBmtPZ',
        },
        'targetUrl_ReqsD8BhJLQ_-LEQQsFmf': {
          type: 'UnboundValue',
          key: 'khZLhNHYnmfN834xJhmmb',
        },
        'alt_GQZDBcONTKHYmPU-nOPlw': {
          type: 'UnboundValue',
          key: 'Q2Nxbd109_raK29mhzNHJ',
        },
        'url_GQZDBcONTKHYmPU-nOPlw': {
          path: '/Bw0eYqeQVjz4vfkJPlZUe/fields/file/~locale',
          type: 'BoundValue',
        },
      },
      children: [],
    };

    const experienceEntry = getExperienceEntryWithNode({
      node: patternNode,
      unboundValues: {
        '2U2Pjx_SAg4fY9uFBmtPZ': {
          value: 'Lorem ipsum',
        },
        '9TLvjMnVsdRjmY1ubLNoy': {
          value: '',
        },
        Q2Nxbd109_raK29mhzNHJ: {},
        khZLhNHYnmfN834xJhmmb: {
          value: '/',
        },
        nd1ip1F1Qb8M8CHzfIJ9M: {
          value: 'Lorem ipsum',
        },
      },
      dataSource: {
        '44VNjJs2idfY07POQ__X8': {
          sys: {
            id: 'bound-asset-id',
            type: 'Link',
            linkType: 'Asset',
          },
        },
        Bw0eYqeQVjz4vfkJPlZUe: {
          sys: {
            id: 'bound-asset-id',
            type: 'Link',
            linkType: 'Asset',
          },
        },
      },
      usedComponents: [editablePatternEntry],
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [editablePatternEntry as Entry],
      referencedAssets: [],
    });

    const styles = detachExperienceStyles(experience);

    // Expecting if it style contains updated background color of pattern instance
    expect(styles).toMatch('background-color:rgba(270, 154, 255, 0)');
  });

  it('should resolve styles for an experience with exposed design properties of nested pattern', () => {
    const experienceEntryWithNestedPattern = {
      sys: {
        id: 'test-experience-entry-id',
        type: 'Entry',
        locale: 'en-US',
      },
      fields: experienceEntryFieldsWithFilledUsedComponents,
      metadata: {},
    } as never as Entry;
    const experience = createExperience({
      experienceEntry: experienceEntryWithNestedPattern,
      locale: 'en-US',
      referencedEntries: [],
      referencedAssets: [],
    });

    const styles = detachExperienceStyles(experience);

    // Making sure that the extracted styles contain the updated background color for the nested pattern component
    expect(styles).toMatch('background-color:rgba(111,  111 , 111, 0)');
  });
});
