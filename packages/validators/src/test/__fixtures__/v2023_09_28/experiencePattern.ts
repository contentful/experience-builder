export const experiencePattern = {
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
    id: '78fFlL15JIgletz7KbIR3V',
    type: 'Entry',
    createdAt: '2024-02-07T08:59:55.737Z',
    updatedAt: '2024-02-07T08:59:55.737Z',
    environment: {
      sys: {
        id: 'master',
        type: 'Link',
        linkType: 'Environment',
      },
    },
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
    publishedCounter: 0,
    version: 1,
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
      'en-US': 'Sofia test component',
    },
    slug: {
      'en-US': 'sofia-test-component-OoQfpIDspP8IL1xQ3KMcx',
    },
    componentTree: {
      'en-US': {
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
            definitionId: 'contentful-container',
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
                  desktop: 'rgba(184, 47, 47, 1)',
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
                  desktop: '6px',
                },
              },
              cfGap: {
                type: 'DesignValue',
                valuesByBreakpoint: {
                  desktop: '0px 0px',
                },
              },
              cfBackgroundImageUrl: {
                key: 'cfBackgroundImageUrl_AtBrirchNbwfpkWlSfTD6',
                type: 'ComponentValue',
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
                key: 'cfHyperlink_AtBrirchNbwfpkWlSfTD6',
                type: 'ComponentValue',
              },
              cfOpenInNewTab: {
                key: 'cfOpenInNewTab_AtBrirchNbwfpkWlSfTD6',
                type: 'ComponentValue',
              },
            },
            children: [
              {
                definitionId: 'heading',
                variables: {
                  text: {
                    key: 'text_1_IVYl8rYJEzWW8xPfmT-',
                    type: 'ComponentValue',
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
                variables: {
                  label: {
                    key: 'label_dQwNIIxgatsaAa5NKwH_d',
                    type: 'ComponentValue',
                  },
                  targetUrl: {
                    key: 'targetUrl_dQwNIIxgatsaAa5NKwH_d',
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
        ],
      },
    },
    dataSource: {
      'en-US': {},
    },
    unboundValues: {
      'en-US': {
        '36j5IQjr3FKEQ4Yvyd034': {
          value: '',
        },
        'raxHlcBnR-MgVXZ0BNdVz': {
          value: '',
        },
        sdlRPKx1mQc3C7Ky_R9B9: {
          value: false,
        },
        h2jAEzi8gIn1WXC9eBIPF: {
          value: 'Lorem ipsum',
        },
        '5J8rtZN_nOJUx5YGdFuF0': {
          value: 'Lorem ipsum',
        },
        'vTMOm5aAq2U4zsomzJLx-': {
          value: '/',
        },
      },
    },
    componentSettings: {
      'en-US': {
        variableDefinitions: {
          cfBackgroundImageUrl_AtBrirchNbwfpkWlSfTD6: {
            displayName: 'Background image',
            type: 'Text',
            defaultValue: {
              key: '36j5IQjr3FKEQ4Yvyd034',
              type: 'UnboundValue',
            },
            description: 'Background image for section or container',
          },
          cfHyperlink_AtBrirchNbwfpkWlSfTD6: {
            displayName: 'Hyperlink',
            type: 'Text',
            defaultValue: {
              key: 'raxHlcBnR-MgVXZ0BNdVz',
              type: 'UnboundValue',
            },
            validations: {
              format: 'URL',
            },
            description: 'hyperlink for section or container',
          },
          cfOpenInNewTab_AtBrirchNbwfpkWlSfTD6: {
            displayName: 'Hyperlink behaviour',
            type: 'Boolean',
            defaultValue: {
              key: 'sdlRPKx1mQc3C7Ky_R9B9',
              type: 'UnboundValue',
            },
            description: 'To open hyperlink in new Tab or not',
          },
          'text_1_IVYl8rYJEzWW8xPfmT-': {
            displayName: 'Text',
            defaultValue: {
              key: 'h2jAEzi8gIn1WXC9eBIPF',
              type: 'UnboundValue',
            },
            type: 'Text',
            group: 'content',
          },
          label_dQwNIIxgatsaAa5NKwH_d: {
            displayName: 'Label',
            type: 'Text',
            defaultValue: {
              key: '5J8rtZN_nOJUx5YGdFuF0',
              type: 'UnboundValue',
            },
            group: 'content',
          },
          targetUrl_dQwNIIxgatsaAa5NKwH_d: {
            displayName: 'Target URL',
            type: 'Text',
            defaultValue: {
              key: 'vTMOm5aAq2U4zsomzJLx-',
              type: 'UnboundValue',
            },
            group: 'content',
          },
        },
      },
    },
  },
};
