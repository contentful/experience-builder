import React from 'react';
import { createExperience, defineDesignTokens, detachExperienceStyles } from '../../index';
import { DesignTokensDefinition, DesignValue, ExperienceEntry } from '../../types';
import { Entry } from 'contentful';

const designTokenRegistry: DesignTokensDefinition = {
  color: {
    bg: 'white',
    font: 'black',
    danger: 'red',
    warning: 'orange',
    succcess: 'green',
  },
  spacing: {
    xs: '0.5 rem',
    s: '1rem',
    m: '1.5rem',
    l: '2rem',
  },
  sizing: {
    quarter: '25%',
    half: '50%',
    threeQuarters: '75%',
    full: '100%',
  },
  border: {
    borderless: {
      width: '0px',
      style: 'solid',
      color: 'transparent',
    },
    default: {
      width: '1px',
      style: 'solid',
      color: 'black',
    },
    bold: {
      width: '3px',
      style: 'solid',
      color: 'black',
    },
  },
  fontSize: {
    default: '1rem',
    small: '0.75rem',
    large: '1.5rem',
  },
  lineHeight: {
    default: '1.5',
    small: '1.25',
    large: '2',
  },
  letterSpacing: {
    default: 'normal',
    tight: '0.5px',
    wide: '2px',
  },
  textColor: {
    default: 'black',
    muted: 'gray',
    accent: 'blue',
  },
};

const experienceEntry: ExperienceEntry = {
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
      children: [
        {
          definitionId: 'custom-component-id',
          variables: {
            title: { type: 'UnboundValue', key: 'LbgUfow4SJIqWCrkZ1fvi' },
            quote: { type: 'UnboundValue', key: 'FPbWCrkZgUfow4SJIq31d' },
            cfBackgroundColor: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${color.bg}',
                tablet: '${color.font}',
                mobile: '${color.danger}',
              },
            },
            cfBorder: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${border.default}',
                tablet: '${border.bold}',
                mobile: '${border.borderless}',
              },
            },
            cfFontSize: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${fontSize.default}',
                tablet: '${fontSize.small}',
                mobile: '${fontSize.large}',
              },
            },
            cfGap: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${spacing.l} ${spacing.l}',
                tablet: '${spacing.m} ${spacing.m}',
                mobile: '${spacing.s} ${spacing.s}',
              },
            },
            cfHeight: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${sizing.quarter}',
                tablet: '${sizing.half}',
                mobile: '${sizing.full}',
              },
            },
            cfMargin: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${spacing.l}',
                tablet: '${spacing.m}',
                mobile: '${spacing.s}',
              },
            },
            cfPadding: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${spacing.l}',
                tablet: '${spacing.m}',
                mobile: '${spacing.s}',
              },
            },
            cfTextColor: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${color.font}',
                tablet: '${color.success}',
                mobile: '${color.warning}',
              },
            },
            cfWidth: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '${sizing.half}',
                tablet: '${sizing.threeQuarters}',
                mobile: '${sizing.full}',
              },
            },
          },
          children: [],
        },
      ],
    },
    dataSource: {},
    unboundValues: {
      LbgUfow4SJIqWCrkZ1fvi: { value: 'GlaDOS' },
      FPbWCrkZgUfow4SJIq31d: { value: 'You Will Be Baked, And Then There Will Be Cake' },
    },
  },
  metadata: {
    tags: [],
  },
};

describe('custom component with builtInStyles which are supporting design tokens', () => {
  beforeEach(() => {
    defineDesignTokens(designTokenRegistry);
  });

  it('should populate values with design tokens and extract the css', () => {
    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [],
      referencedAssets: [],
    });

    const styles = detachExperienceStyles(experience);

    const customComponent = experienceEntry.fields.componentTree.children[0];
    expect(customComponent.variables.cfSsrClassName).toBeDefined();
    expect(customComponent.variables.cfSsrClassName.type).toBe('DesignValue');
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop,
    ).toBeDefined();
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint
        .desktop as string,
    ).toEqual(
      'cf-c9e1b7c280ecf05fda4ab04e16644807 cf-2c4e00b479e8209382b0814b0ba1f706 cf-bd9d9646c4500dc3f4a3a7d9974d0e40',
    );
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
    ).not.toBeDefined();
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
    ).not.toBeDefined();

    expect(styles).toBe(
      '.cf-c9e1b7c280ecf05fda4ab04e16644807{margin:2rem;padding:2rem;background-color:white;width:50%;height:25%;border:1px solid black;gap:2rem 2rem;font-size:1rem;font-style:normal;color:black;text-decoration:none;box-sizing:border-box;}@media(max-width:992px){.cf-2c4e00b479e8209382b0814b0ba1f706{margin:1.5rem;padding:1.5rem;background-color:black;width:75%;height:50%;border:3px solid black;gap:1.5rem 1.5rem;font-size:0.75rem;font-style:normal;color:rgba(0, 0, 0, 1);text-decoration:none;box-sizing:border-box;}}@media(max-width:576px){.cf-bd9d9646c4500dc3f4a3a7d9974d0e40{margin:1rem;padding:1rem;background-color:red;width:100%;height:100%;border:0px solid transparent;gap:1rem 1rem;font-size:1.5rem;font-style:normal;color:orange;text-decoration:none;box-sizing:border-box;}}',
    );
  });
});
