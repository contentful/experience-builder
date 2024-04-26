export const experience = {
  metadata: {
    tags: [],
  },
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'tofsejyzyo24',
      },
    },
    id: '64AN4WV1fN0myahCWSOUhq',
    type: 'Entry',
    createdAt: '2024-02-06T15:05:23.137Z',
    updatedAt: '2024-02-06T15:09:54.939Z',
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    publishedVersion: 5,
    publishedAt: '2024-02-06T15:09:19.540Z',
    firstPublishedAt: '2024-02-06T15:09:19.540Z',
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '01pqG1mJhkXPX0GhF6jgGX',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '01pqG1mJhkXPX0GhF6jgGX',
      },
    },
    publishedCounter: 1,
    version: 7,
    publishedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '01pqG1mJhkXPX0GhF6jgGX',
      },
    },
    automationTags: [],
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'hostedLayout',
      },
    },
  },
  fields: {
    title: {
      'en-US': 'Sofia test',
    },
    slug: {
      'en-US': 'sofia-test',
    },
    componentTree: {
      'en-US': {
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
        children: [
          {
            definitionId: 'contentful-container',
            displayName: 'Container 1',
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
              cfMargin: {
                type: 'DesignValue',
                valuesByBreakpoint: {
                  desktop: '0 auto 0 auto',
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
                  desktop: '${color.Orange}',
                },
              },
              cfWidth: {
                type: 'DesignValue',
                valuesByBreakpoint: {
                  desktop: 'fill',
                },
              },
              cfHeight: {
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
              cfBorderRadius: {
                type: 'DesignValue',
                valuesByBreakpoint: {
                  desktop: '10px',
                },
              },
              cfGap: {
                type: 'DesignValue',
                valuesByBreakpoint: {
                  desktop: '0px 0px',
                },
              },
              cfBackgroundImageUrl: {
                type: 'UnboundValue',
                key: '36j5IQjr3FKEQ4Yvyd034',
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
              cfHyperlink: {
                type: 'UnboundValue',
                key: 'raxHlcBnR-MgVXZ0BNdVz',
              },
              cfOpenInNewTab: {
                type: 'UnboundValue',
                key: 'sdlRPKx1mQc3C7Ky_R9B9',
              },
            },
            children: [
              {
                definitionId: 'heading',
                displayName: 'Heading 1',
                variables: {
                  text: {
                    type: 'UnboundValue',
                    key: 'h2jAEzi8gIn1WXC9eBIPF',
                  },
                  type: {
                    type: 'DesignValue',
                    valuesByBreakpoint: {
                      desktop: 'h2',
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
                      desktop: 'fit-content',
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
                definitionId: 'button',
                displayName: 'Button 1',
                variables: {
                  label: {
                    path: '/5J8rtZN_nOJUx5YGdFuF0/fields/name/~locale',
                    type: 'BoundValue',
                  },
                  targetUrl: {
                    type: 'UnboundValue',
                    key: 'vTMOm5aAq2U4zsomzJLx-',
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
                      desktop: '${spacing.M} 0 ${spacing.M} 0',
                    },
                  },
                },
                children: [],
              },
            ],
          },
        ],
      },
    },
    dataSource: {
      'en-US': {
        '5J8rtZN_nOJUx5YGdFuF0': {
          sys: {
            id: '2xzFkze5QuXhlgdGuuKvpY',
            type: 'Link',
            linkType: 'Entry',
          },
        },
      },
    },
    unboundValues: {
      'en-US': {
        '36j5IQjr3FKEQ4Yvyd034': {
          value: '',
        },
        h2jAEzi8gIn1WXC9eBIPF: {
          value: 'Lorem ipsum',
        },
        'raxHlcBnR-MgVXZ0BNdVz': {
          value: '',
        },
        sdlRPKx1mQc3C7Ky_R9B9: {
          value: false,
        },
        'vTMOm5aAq2U4zsomzJLx-': {
          value: '/',
        },
      },
    },
  },
};
