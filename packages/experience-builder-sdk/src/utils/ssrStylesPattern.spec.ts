import { createExperience, detachExperienceStyles } from '../index';
import {
  ComponentTreeNode,
  DesignValue,
  ExperienceDataSource,
  ExperienceEntry,
  ExperienceUnboundValues,
} from '@contentful/experiences-core/types';
import { ExperienceUsedComponents } from '@contentful/experiences-validators';
import { Asset, Entry } from 'contentful';

const patternEntry: ExperienceEntry = {
  metadata: {
    tags: [],
  },
  sys: {
    id: '4JYGAfHMSVdWkuf6kbd1n8',
    type: 'Entry',
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

const getExperienceEntryWithNode = ({
  node,
  unboundValues = {},
  dataSource = {},
  usedComponents = undefined,
}: {
  node: ComponentTreeNode;
  unboundValues?: ExperienceUnboundValues;
  dataSource?: ExperienceDataSource;
  usedComponents?: ExperienceUsedComponents;
}): ExperienceEntry => {
  return {
    sys: {
      id: 'test-id',
      type: 'Entry',
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
      usedComponents: [
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: patternNode.definitionId,
          },
        },
      ],
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [patternEntry as Entry],
      referencedAssets: [],
    });

    const styles = detachExperienceStyles(experience);

    const patternTreeNode = experienceEntry.fields.componentTree.children[0];
    const queue = [...patternTreeNode.children];

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

    expect(styles).toBe(
      '.cf-97f2833807e6cabf092b7ab942c1f972{margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:calc(100% - Auto - Auto);max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;font-style:normal;text-decoration:none;box-sizing:border-box;}.cf-cd01b8f29d14c77082e72aba8f93df9d{padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;font-style:normal;text-decoration:none;box-sizing:border-box;}.cf-0667ccfe39782f7b095158c091fe11b1{padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;font-style:normal;text-decoration:none;box-sizing:border-box;}@media(max-width:992px){.cf-d2d0bfefe7032e1bd983bdc3c4c8b762{font-style:normal;text-decoration:none;box-sizing:border-box;}}@media(max-width:576px){.cf-d2d0bfefe7032e1bd983bdc3c4c8b762{font-style:normal;text-decoration:none;box-sizing:border-box;}}',
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
      usedComponents: [
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: patternNode.definitionId,
          },
        },
      ],
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

    expect(styles).toBe(
      '.cf-8d9315122c4406b0460e809b90cc9ef0{margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:calc(100% - Auto - Auto);max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;background-image:url(https://www.contentful.com/image-asset.jpg);background-repeat:no-repeat;font-style:normal;text-decoration:none;box-sizing:border-box;}.cf-cd01b8f29d14c77082e72aba8f93df9d{padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;font-style:normal;text-decoration:none;box-sizing:border-box;}.cf-0667ccfe39782f7b095158c091fe11b1{padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;font-style:normal;text-decoration:none;box-sizing:border-box;}@media(max-width:992px){.cf-d2d0bfefe7032e1bd983bdc3c4c8b762{font-style:normal;text-decoration:none;box-sizing:border-box;}}@media(max-width:576px){.cf-d2d0bfefe7032e1bd983bdc3c4c8b762{font-style:normal;text-decoration:none;box-sizing:border-box;}}',
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
      usedComponents: [
        {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: patternNode.definitionId,
          },
        },
      ],
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

    expect(styles).toBe(
      '.cf-8d9315122c4406b0460e809b90cc9ef0{margin:0 Auto 0 Auto;padding:10px 10px 10px 10px;background-color:rgba(255, 255, 255, 0);width:calc(100% - Auto - Auto);max-width:1192px;border:0px outside rgba(255, 255, 255, 0);gap:10px 10px;background-image:url(https://www.contentful.com/image-asset.jpg);background-repeat:no-repeat;font-style:normal;text-decoration:none;box-sizing:border-box;}.cf-cd01b8f29d14c77082e72aba8f93df9d{padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:start;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;font-style:normal;text-decoration:none;box-sizing:border-box;}.cf-0667ccfe39782f7b095158c091fe11b1{padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);grid-column:span 6;border:0px outside rgba(255, 255, 255, 0);gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;font-style:normal;text-decoration:none;box-sizing:border-box;}@media(max-width:992px){.cf-d2d0bfefe7032e1bd983bdc3c4c8b762{font-style:normal;text-decoration:none;box-sizing:border-box;}}@media(max-width:576px){.cf-d2d0bfefe7032e1bd983bdc3c4c8b762{font-style:normal;text-decoration:none;box-sizing:border-box;}}',
    );
    expect(styles).toContain(`background-image:url(${referencedAsset.fields.file?.url})`);
  });
});
