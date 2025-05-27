/**
 * FIXME: Drop snapshot tests (i.e. hard comparing the full string including hash)
 * Instead we should test specific atomic functionality. So the test doesn't fail on every
 * single code change but only when the code change would actually break a specific functionality.
 */
import { createExperience, detachExperienceStyles } from '../../index';
import { DesignValue, ExperienceEntry } from '../../types';
import { Entry } from 'contentful';

const experienceEntry: ExperienceEntry = {
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
      children: [
        {
          definitionId: 'custom-component-id',
          variables: {
            title: { type: 'UnboundValue', key: 'LbgUfow4SJIqWCrkZ1fvi' },
            quote: { type: 'UnboundValue', key: 'FPbWCrkZgUfow4SJIq31d' },
            cfBackgroundColor: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'black', tablet: 'grey', mobile: 'ashgrey' },
            },
            cfImageOptions: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: { width: '500px', height: '100%', targetSize: '1200px' },
                tablet: { width: '400px', height: '75%', targetSize: '1000px' },
                mobile: { width: '300px', height: '50%', targetSize: '750px' },
              },
            },
            cfBackgroundImageOptions: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: { width: '500px', height: '100%', targetSize: '1200px' },
                tablet: { width: '400px', height: '75%', targetSize: '1000px' },
                mobile: { width: '300px', height: '50%', targetSize: '750px' },
              },
            },
            cfBorder: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '1px solid red',
                tablet: '1px solid green',
                mobile: '1px solid blue',
              },
            },
            cfBorderRadius: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '0px', tablet: '2px', mobile: '5px' },
            },
            cfColumnSpan: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '1', tablet: '2', mobile: '3' },
            },
            cfColumnSpanLock: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'true', tablet: 'false', mobile: 'true' },
            },
            cfColumns: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '1', tablet: '2', mobile: '12' },
            },
            cfFlexDirection: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'row', tablet: 'column', mobile: 'row' },
            },
            cfFlexWrap: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'wrap', tablet: 'nowrap', mobile: 'wrap' },
            },
            cfFontSize: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '16px', tablet: '14px', mobile: '12px' },
            },
            cfFontWeight: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'bold', tablet: 'normal', mobile: 'light' },
            },
            cfGap: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '10px 10px',
                tablet: '5px 5px',
                mobile: '2px 2px',
              },
            },
            cfHeight: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '100%', tablet: '50%', mobile: '25%' },
            },
            cfHorizontalAlignment: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'center', tablet: 'left', mobile: 'right' },
            },
            cfLetterSpacing: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '1px', tablet: '0.5px', mobile: '0px' },
            },
            cfLineHeight: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '1.5', tablet: '1.25', mobile: '1' },
            },
            cfMargin: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '0 0 0 0',
                tablet: '1rem 1rem 1rem 1rem',
                mobile: '1.5rem 1.5rem 1.5rem 1.5rem',
              },
            },
            cfMaxWidth: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'none', tablet: '500px', mobile: '300px' },
            },
            cfPadding: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: '0 0 0 0',
                tablet: '1rem 1rem 1rem 1rem',
                mobile: '1.5rem 1.5rem 1.5rem 1.5rem',
              },
            },
            cfTextAlign: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'center', tablet: 'left', mobile: 'right' },
            },
            cfTextBold: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'bold', tablet: 'normal', mobile: 'light' },
            },
            cfTextColor: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'white', tablet: 'black', mobile: 'grey' },
            },
            cfTextItalic: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'italic', tablet: 'normal', mobile: 'normal' },
            },
            cfTextTransform: {
              type: 'DesignValue',
              valuesByBreakpoint: {
                desktop: 'uppercase',
                tablet: 'capitalize',
                mobile: 'lowercase',
              },
            },
            cfTextUnderline: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'underline', tablet: 'none', mobile: 'none' },
            },
            cfVerticalAlignment: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'center', tablet: 'top', mobile: 'bottom' },
            },
            cfWidth: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '100%', tablet: '50%', mobile: '25%' },
            },
            cfWrapColumns: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: 'wrap', tablet: 'nowrap', mobile: 'wrap' },
            },
            cfWrapColumnsCount: {
              type: 'DesignValue',
              valuesByBreakpoint: { desktop: '2', tablet: '3', mobile: '4' },
            },
            cfBackgroundImageUrl: {
              key: 'QiTUaZhbBwpPXCrtjereK',
              type: 'UnboundValue',
            },
            cfImageAsset: {
              key: 'wpPXCrtjereKQiTUaZhbB',
              type: 'UnboundValue',
            },
          },
          children: [],
        },
      ],
    },
    dataSource: {},
    unboundValues: {
      LbgUfow4SJIqWCrkZ1fvi: {
        value: 'GlaDOS',
      },
      FPbWCrkZgUfow4SJIq31d: {
        value: 'You Will Be Baked, And Then There Will Be Cake',
      },
      QiTUaZhbBwpPXCrtjereK: {
        value: 'https://www.contentful.com/bg-image.jpg',
      },
      wpPXCrtjereKQiTUaZhbB: {
        value: 'https://www.contentful.com/asset-image.jpg',
      },
    },
  },
  metadata: {
    tags: [],
  },
};

describe('custom component with builtInStyles', () => {
  it('should extract builtInStyles as media query css', () => {
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
    ).toMatchInlineSnapshot(
      `"cf-81d588afbeab8fbff854ba1bec4d09b7 cf-0a40f77be1a935aa4aba5ce5fc90eadb cf-9f914dfafd46feee5f4b4f274745ff6b"`,
    );
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
    ).not.toBeDefined();
    expect(
      (customComponent.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
    ).not.toBeDefined();

    expect(styles).toMatchInlineSnapshot(
      `".cf-81d588afbeab8fbff854ba1bec4d09b7{box-sizing:border-box;margin:0 0 0 0;padding:0 0 0 0;background-color:black;width:100%;height:100%;max-width:none;grid-column:span 1;border:1px solid red;border-radius:0px;gap:10px 10px;align-items:center;justify-content:safe center;flex-direction:row;flex-wrap:wrap;background-image:url(https://www.contentful.com/bg-image.jpg);background-repeat:no-repeat;font-size:16px;font-weight:bold;font-style:italic;text-decoration:underline;line-height:1.5;letter-spacing:1px;color:white;text-align:center;text-transform:uppercase;}@media(max-width:992px){.cf-0a40f77be1a935aa4aba5ce5fc90eadb{box-sizing:border-box;margin:1rem 1rem 1rem 1rem;padding:1rem 1rem 1rem 1rem;background-color:grey;width:50%;height:50%;max-width:500px;grid-column:span 2;border:1px solid green;border-radius:2px;gap:5px 5px;align-items:top;justify-content:left;flex-direction:column;flex-wrap:nowrap;font-size:14px;font-weight:bold;font-style:italic;text-decoration:underline;line-height:1.25;letter-spacing:0.5px;color:black;text-align:left;text-transform:capitalize;}}@media(max-width:576px){.cf-9f914dfafd46feee5f4b4f274745ff6b{box-sizing:border-box;margin:1.5rem 1.5rem 1.5rem 1.5rem;padding:1.5rem 1.5rem 1.5rem 1.5rem;background-color:ashgrey;width:25%;height:25%;max-width:300px;grid-column:span 3;border:1px solid blue;border-radius:5px;gap:2px 2px;align-items:right;justify-content:bottom;flex-direction:row;flex-wrap:wrap;font-size:12px;font-weight:bold;font-style:italic;text-decoration:underline;line-height:1;letter-spacing:0px;color:grey;text-align:right;text-transform:lowercase;}}"`,
    );
  });
});
