/**
 * FIXME: Drop snapshot tests (i.e. hard comparing the full string including hash)
 * Instead we should test specific atomic functionality. So the test doesn't fail on every
 * single code change but only when the code change would actually break a specific functionality.
 */
import { designTokensFixture } from '../../__fixtures__/designTokens';
import { createExperience, defineDesignTokens, detachExperienceStyles } from '../../index';
import { DesignValue, ExperienceEntry } from '../../types';
import { Entry } from 'contentful';

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
    defineDesignTokens(designTokensFixture);
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
      'cf-ae92b9eb2c20a262573a8085db3dbd67 cf-1fe22311d2b832dd529a9ce5e8d77281 cf-63009ce9ca644a23e001721d6358e491',
    );
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
    ).not.toBeDefined();
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
    ).not.toBeDefined();

    expect(styles).toBe(
      '.cf-ae92b9eb2c20a262573a8085db3dbd67{box-sizing:border-box;margin:2rem;padding:2rem;background-color:white;width:50%;height:25%;border:1px solid black;gap:2rem 2rem;font-size:1rem;color:black;}@media(max-width:992px){.cf-1fe22311d2b832dd529a9ce5e8d77281{box-sizing:border-box;margin:1.5rem;padding:1.5rem;background-color:black;width:75%;height:50%;border:3px solid black;gap:1.5rem 1.5rem;font-size:0.75rem;color:green;}}@media(max-width:576px){.cf-63009ce9ca644a23e001721d6358e491{box-sizing:border-box;margin:1rem;padding:1rem;background-color:red;width:100%;height:100%;border:0px solid transparent;gap:1rem 1rem;font-size:1.5rem;color:orange;}}',
    );
  });
});
