import { toMediaQuery } from '@contentful/experiences-core';
import { Breakpoint } from '@contentful/experiences-core/types';
import { createBreakpoints } from '../../../test/__fixtures__/breakpoints';
import { createComponentTreeNode } from '../../../test/__fixtures__/componentTreeNode';
import { createStylesheetsForBuiltInStyles } from './createStylesheetsForBuiltInStyles';
import { convertResolvedDesignValuesToMediaQuery } from './convertResolvedDesignValuesToMediaQuery';

// ES-291: Custom breakpoints (5 instead of standard 3) with non-standard IDs
const customBreakpoints: Breakpoint[] = [
  { id: 'bp-xl', query: '*', displayName: 'Extra Large', previewSize: '1440px' },
  { id: 'bp-lg', query: '<1280px', displayName: 'Large', previewSize: '1024px' },
  { id: 'bp-md', query: '<1024px', displayName: 'Medium', previewSize: '768px' },
  { id: 'bp-sm', query: '<768px', displayName: 'Small', previewSize: '480px' },
  { id: 'bp-xs', query: '<480px', displayName: 'Extra Small', previewSize: '320px' },
];

const designPropertiesByBreakpoint = {
  desktop: { cfMargin: '7px' },
  tablet: { cfMargin: '42px', cfPadding: '11px' },
};
const breakpoints = createBreakpoints();
const node = createComponentTreeNode();

describe('convertResolvedDesignValuesToMediaQuery', () => {
  it('converts style sheet data into the final CSS code', () => {
    const stylesheetData = createStylesheetsForBuiltInStyles({
      designPropertiesByBreakpoint,
      breakpoints,
      node,
    });

    const result = convertResolvedDesignValuesToMediaQuery(stylesheetData);

    const desktop = stylesheetData[0];
    const tablet = stylesheetData[1];
    const expectedDesktopCss = toMediaQuery({
      condition: desktop.breakpointCondition,
      cssByClassName: { [desktop.className]: desktop.css },
    });
    const expectedTabletCss = toMediaQuery({
      condition: tablet.breakpointCondition,
      cssByClassName: { [tablet.className]: tablet.css },
    });
    expect(result).toEqual({
      className: expect.stringMatching(/^cfstyles-\w{32} cfstyles-\w{32}$/),
      css: `${expectedDesktopCss}${expectedTabletCss}`,
    });
  });

  describe('when using visibility styles', () => {
    const designPropertiesByBreakpoint = {
      desktop: { cfMargin: '7px', cfVisibility: false },
      tablet: { cfMargin: '42px' },
      mobile: { cfVisibility: true },
    };

    it("doesn't add them to the regular CSS code", () => {
      const [desktop, tablet, mobile] = createStylesheetsForBuiltInStyles({
        designPropertiesByBreakpoint,
        breakpoints,
        node,
      });
      expect(desktop.css).not.toContain('display:');
      expect(tablet.css).not.toContain('display:');
      expect(mobile.css).not.toContain('display:');
    });

    it('creates explicit visibility styles for each breakpoint', () => {
      const [desktop, tablet, mobile] = createStylesheetsForBuiltInStyles({
        designPropertiesByBreakpoint,
        breakpoints,
        node,
      });
      expect(desktop.visibilityCss).toEqual('display:none !important;');
      expect(tablet.visibilityCss).toEqual('display:none !important;');
      expect(mobile.visibilityCss).toEqual('');
    });

    it('creates disjunct media queries for each breakpoint', () => {
      const stylesheetData = createStylesheetsForBuiltInStyles({
        designPropertiesByBreakpoint,
        breakpoints,
        node,
      });
      const [desktop, tablet] = stylesheetData;
      const expectedResult = convertResolvedDesignValuesToMediaQuery(stylesheetData);
      expect(expectedResult.css).toContain(
        `@media not (max-width:992px){.${desktop.className}{display:none !important;}}`,
      );
      expect(expectedResult.css).toContain(
        `@media(max-width:992px) and (not (max-width:576px)){.${tablet.className}{display:none !important;}}`,
      );
    });
  });

  describe('when visibility is only set on the default breakpoint', () => {
    // Regression: tablet/mobile had no design properties at all, so the visibility cascade was
    // skipped for those breakpoints and hidden content became visible after publishing.
    const designPropertiesByBreakpoint = {
      desktop: { cfVisibility: false },
    };

    it('cascades hide to all narrower breakpoints', () => {
      const stylesheetData = createStylesheetsForBuiltInStyles({
        designPropertiesByBreakpoint,
        breakpoints,
        node,
      });
      expect(stylesheetData).toHaveLength(3);
      const [desktop, tablet, mobile] = stylesheetData;
      expect(desktop.visibilityCss).toEqual('display:none !important;');
      expect(tablet.visibilityCss).toEqual('display:none !important;');
      expect(mobile.visibilityCss).toEqual('display:none !important;');
    });

    it('emits disjunct media queries that hide content at all breakpoints', () => {
      const stylesheetData = createStylesheetsForBuiltInStyles({
        designPropertiesByBreakpoint,
        breakpoints,
        node,
      });
      const [desktop, tablet, mobile] = stylesheetData;
      const { css } = convertResolvedDesignValuesToMediaQuery(stylesheetData);
      expect(css).toContain(
        `@media not (max-width:992px){.${desktop.className}{display:none !important;}}`,
      );
      expect(css).toContain(
        `@media(max-width:992px) and (not (max-width:576px)){.${tablet.className}{display:none !important;}}`,
      );
      expect(css).toContain(
        `@media(max-width:576px){.${mobile.className}{display:none !important;}}`,
      );
    });
  });

  // ES-291: Regression — custom breakpoints (5 breakpoints, non-standard IDs).
  // When cfVisibility:false is set only on the default breakpoint, the cascade must apply
  // display:none to all narrower breakpoints in the emitted CSS.
  describe('when using 5 custom breakpoints and visibility is set only on the default breakpoint (ES-291)', () => {
    const designPropertiesByBreakpoint = {
      'bp-xl': { cfVisibility: false },
    };

    it('cascades hide to all 4 narrower custom breakpoints', () => {
      const stylesheetData = createStylesheetsForBuiltInStyles({
        designPropertiesByBreakpoint,
        breakpoints: customBreakpoints,
        node,
      });
      expect(stylesheetData).toHaveLength(5);
      for (const entry of stylesheetData) {
        expect(entry.visibilityCss).toEqual('display:none !important;');
      }
    });

    it('emits disjunct media queries that hide content at all 5 custom breakpoints', () => {
      const stylesheetData = createStylesheetsForBuiltInStyles({
        designPropertiesByBreakpoint,
        breakpoints: customBreakpoints,
        node,
      });
      const [xl, lg, md, sm, xs] = stylesheetData;
      const { css } = convertResolvedDesignValuesToMediaQuery(stylesheetData);

      // Default breakpoint: "not tablet" (not <1280px)
      expect(css).toContain(
        `@media not (max-width:1280px){.${xl.className}{display:none !important;}}`,
      );
      // Large: <1280px but not <1024px
      expect(css).toContain(
        `@media(max-width:1280px) and (not (max-width:1024px)){.${lg.className}{display:none !important;}}`,
      );
      // Medium: <1024px but not <768px
      expect(css).toContain(
        `@media(max-width:1024px) and (not (max-width:768px)){.${md.className}{display:none !important;}}`,
      );
      // Small: <768px but not <480px
      expect(css).toContain(
        `@media(max-width:768px) and (not (max-width:480px)){.${sm.className}{display:none !important;}}`,
      );
      // Extra small: <480px (last breakpoint — no next condition)
      expect(css).toContain(`@media(max-width:480px){.${xs.className}{display:none !important;}}`);
    });
  });
});
