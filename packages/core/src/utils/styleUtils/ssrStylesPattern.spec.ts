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
          id: 'column-node-id',
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
                desktop: '100%',
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
            cfBackgroundImageOptions: {
              type: 'ComponentValue',
              key: 'foDI5kW',
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
              id: 'column-single-column-id',
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
                cfBackgroundImageOptions: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: {
                      scaling: 'fit',
                      alignment: 'left',
                      targetSize: '300px',
                    },
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
                  id: 'heading-id',
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
                        desktop: '100%',
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
                  id: 'text-id',
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
                        desktop: '100%',
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
                  id: 'button-id',
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
              id: 'column-single-column-id-2',
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
                cfBackgroundImageOptions: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: {
                      scaling: 'fit',
                      alignment: 'left',
                      targetSize: '300px',
                    },
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
                  id: 'image-id',
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
        foDI5kW: {
          displayName: 'Background Image Options',
          type: 'Text',
          group: 'style',
          defaultValue: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: {
                scaling: 'fit',
                alignment: 'left',
                targetSize: '300px',
              },
            },
          },
          description: 'Background image options for section or container',
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
                desktop: '100%',
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
            cfBackgroundImageOptions: {
              type: 'ComponentValue',
              key: 'foDI5kW',
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
                cfBackgroundImageOptions: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: {
                      scaling: 'fit',
                      alignment: 'left',
                      targetSize: '300px',
                    },
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
                        desktop: '100%',
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
                        desktop: '100%',
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
                cfBackgroundImageOptions: {
                  type: 'DesignValue',
                  valuesByBreakpoint: {
                    desktop: {
                      scaling: 'fit',
                      alignment: 'left',
                      targetSize: '300px',
                    },
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
        foDI5kW: {
          displayName: 'Background Image Options',
          type: 'Text',
          group: 'style',
          defaultValue: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: {
                scaling: 'fit',
                alignment: 'left',
                targetSize: '300px',
              },
            },
          },
          description: 'Background image options for section or container',
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
        foDI5kW: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: {
              scaling: 'fit',
              alignment: 'left',
              targetSize: '400px',
            },
          },
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
      const currentNode = queue.shift();
      if (!currentNode) {
        continue;
      }

      const ssrNodeKey = `${patternNode.id}-${currentNode.id}`;
      const cfSsrClassName = patternWrapper.variables.cfSsrClassName as DesignValue;
      expect(cfSsrClassName).toHaveProperty(ssrNodeKey);
      expect((cfSsrClassName[ssrNodeKey] as DesignValue).valuesByBreakpoint.desktop).toBeDefined();
      if (currentNode?.children.length) {
        queue.push(...currentNode.children);
      }
    }

    expect(styles).toMatchInlineSnapshot(
      `".cf-99299a13710dc0424142cda3171fccb3{box-sizing:border-box;margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:100%;max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;}.cf-78c7850479e7576971295fe4922b859e{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-48c13d378b22c3ed56466c899cf40be6{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-e25e9a805249734900e79b6d0b34d888{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;}.cf-028b473da3c5300ae4af6a342efcbaba{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0px;color:rgba(0, 0, 0, 1);text-align:left;text-transform:none;}.cf-9bbe6045d604c01d3147a33499913ec7{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}.cf-8d6190f2e454659796914f80d3a92725{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}@media(max-width:992px){.cf-ffd850859fe3d7c847303ef9c9f2a6f2{box-sizing:border-box;}.cf-9cfdb42946ea1d6dc46e93634b659e83{box-sizing:border-box;}.cf-5d894f6e345a0400f4b3f2ff16ce47da{box-sizing:border-box;}.cf-2dcaeb5cdf9eb315cd71f268ac220816{box-sizing:border-box;}.cf-d79f88e50b7ffd73ddec6c00b5190fff{box-sizing:border-box;}.cf-7a3a1b01b74b9ae1682a74a54001ac9c{box-sizing:border-box;}.cf-e6da8d23595a9b0039f2debea8fab3a2{box-sizing:border-box;}}@media(max-width:576px){.cf-8c3fe465b6c0913b56923a230c661949{box-sizing:border-box;}.cf-d53d4636178a2c21ca1b648186a88225{box-sizing:border-box;}.cf-99d0845eceaa293b8ee678a5e153b9fa{box-sizing:border-box;}.cf-eac3c8558eeb99a561abd97963e84764{box-sizing:border-box;}.cf-e1cab4ef1fb3c731741497f4823c03ab{box-sizing:border-box;}.cf-75ef9cfd7e8c44c34c35c4730b6cfa8c{box-sizing:border-box;}.cf-78f88e6375d9e7707d83d948522fc18f{box-sizing:border-box;}}"`,
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
          details: {
            image: {
              width: 2000,
            },
          },
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

      const cfSsrClassName = node.variables.cfSsrClassName as DesignValue;
      expect(cfSsrClassName).toBeDefined();
      expect(cfSsrClassName.type).toBe('DesignValue');
      expect(cfSsrClassName.valuesByBreakpoint.desktop).toBeDefined();
      expect(cfSsrClassName.valuesByBreakpoint.tablet).not.toBeDefined();
      expect(cfSsrClassName.valuesByBreakpoint.mobile).not.toBeDefined();

      if (node?.children.length) {
        queue.push(...node.children);
      }
    }

    expect(styles).toMatchInlineSnapshot(
      `".cf-5f6e024f4744543c73051afa147fd851{box-sizing:border-box;margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:100%;max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;background-image:url(https://www.contentful.com/image-asset.jpg?w=600);background-image:image-set(url(https://www.contentful.com/image-asset.jpg?w=300) 1x,url(https://www.contentful.com/image-asset.jpg?w=600) 2x);background-repeat:no-repeat;background-position:left center;background-size:contain;}.cf-ae5fa0af175122795af0a73151dbab26{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-33121618e09a5f3cc14b31b7dd46994b{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-59cbfbc5a78dab168dace7be86bc02f5{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;}.cf-ab0937b0893670b2ffcc901d046772bb{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0px;color:rgba(0, 0, 0, 1);text-align:left;text-transform:none;}.cf-8e3f64e46441454fc49f062c56bcdb15{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}.cf-9cb0b5395623d0ff9f5b2f5ac8b21922{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}@media(max-width:992px){.cf-ae781136a95976275e5cbbfa7bd8d7a2{box-sizing:border-box;}.cf-afa08da797f105e82ae33e1b5a4b5a39{box-sizing:border-box;}.cf-7d96b11efc9f647b4bc3fdfd10228cd1{box-sizing:border-box;}.cf-9f6b89434f40b9887785c37fba6b0c27{box-sizing:border-box;}.cf-a0e2ce819ff0dcdbdc9e2a8f73ddb419{box-sizing:border-box;}.cf-3ea3755197f9d52f7b98448b0550031e{box-sizing:border-box;}.cf-47cc5b3a4d5c430eb81dc16e428e2b6c{box-sizing:border-box;}}@media(max-width:576px){.cf-cfa6e20f2eb5a3905f3c92b2bfc2b1d5{box-sizing:border-box;}.cf-763cfaf3baf1865e3c7884d9ae7d354f{box-sizing:border-box;}.cf-9e2e3cb7d09e05fea0658331535a2da6{box-sizing:border-box;}.cf-605cb60183c58bff0bc99ad2e596888e{box-sizing:border-box;}.cf-1e951e8e553fc9bb6d80c4bac19e3f17{box-sizing:border-box;}.cf-7b37f263a4b8bae7bed8355cbc291ec6{box-sizing:border-box;}.cf-01021ae4c462cd97ffbb3a4f580270ff{box-sizing:border-box;}}"`,
    );
    expect(styles).toContain(
      `background-image:url(${boundAsset.fields.file?.url}?w=600);background-image:image-set(url(${boundAsset.fields.file?.url}?w=300) 1x,url(${boundAsset.fields.file?.url}?w=600) 2x)`,
    );
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
          details: {
            image: {
              width: 2000,
            },
          },
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
      `".cf-5f6e024f4744543c73051afa147fd851{box-sizing:border-box;margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:100%;max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;background-image:url(https://www.contentful.com/image-asset.jpg?w=600);background-image:image-set(url(https://www.contentful.com/image-asset.jpg?w=300) 1x,url(https://www.contentful.com/image-asset.jpg?w=600) 2x);background-repeat:no-repeat;background-position:left center;background-size:contain;}.cf-ae5fa0af175122795af0a73151dbab26{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-33121618e09a5f3cc14b31b7dd46994b{box-sizing:border-box;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;}.cf-59cbfbc5a78dab168dace7be86bc02f5{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;}.cf-ab0937b0893670b2ffcc901d046772bb{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;width:100%;max-width:none;font-size:16px;font-weight:400;line-height:20px;letter-spacing:0px;color:rgba(0, 0, 0, 1);text-align:left;text-transform:none;}.cf-8e3f64e46441454fc49f062c56bcdb15{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}.cf-9cb0b5395623d0ff9f5b2f5ac8b21922{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;}@media(max-width:992px){.cf-ae781136a95976275e5cbbfa7bd8d7a2{box-sizing:border-box;}.cf-afa08da797f105e82ae33e1b5a4b5a39{box-sizing:border-box;}.cf-7d96b11efc9f647b4bc3fdfd10228cd1{box-sizing:border-box;}.cf-9f6b89434f40b9887785c37fba6b0c27{box-sizing:border-box;}.cf-a0e2ce819ff0dcdbdc9e2a8f73ddb419{box-sizing:border-box;}.cf-3ea3755197f9d52f7b98448b0550031e{box-sizing:border-box;}.cf-47cc5b3a4d5c430eb81dc16e428e2b6c{box-sizing:border-box;}}@media(max-width:576px){.cf-cfa6e20f2eb5a3905f3c92b2bfc2b1d5{box-sizing:border-box;}.cf-763cfaf3baf1865e3c7884d9ae7d354f{box-sizing:border-box;}.cf-9e2e3cb7d09e05fea0658331535a2da6{box-sizing:border-box;}.cf-605cb60183c58bff0bc99ad2e596888e{box-sizing:border-box;}.cf-1e951e8e553fc9bb6d80c4bac19e3f17{box-sizing:border-box;}.cf-7b37f263a4b8bae7bed8355cbc291ec6{box-sizing:border-box;}.cf-01021ae4c462cd97ffbb3a4f580270ff{box-sizing:border-box;}}"`,
    );
    expect(styles).toContain(
      `background-image:url(${referencedAsset.fields.file?.url}?w=600);background-image:image-set(url(${referencedAsset.fields.file?.url}?w=300) 1x,url(${referencedAsset.fields.file?.url}?w=600) 2x)`,
    );
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
