import { toMediaQuery } from '@contentful/experiences-core';
import { createBreakpoints } from '../../test/__fixtures__/breakpoints';
import { createComponentTreeNode } from '../../test/__fixtures__/componentTreeNode';
import { renderHook } from '@testing-library/react';
import {
  createStylesheetsForBuiltInStyles,
  convertResolvedDesignValuesToMediaQuery,
  useMediaQuery,
} from './useMediaQuery';

const designPropertiesByBreakpoint = {
  desktop: { cfMargin: '7px' },
  tablet: { cfMargin: '42px', cfPadding: '11px' },
};
const breakpoints = createBreakpoints();
const node = createComponentTreeNode();

describe('createStylesheetsForBuiltInStyles', () => {
  it('returns one style sheet entry for each used breakpoint', () => {
    const stylesheetData = createStylesheetsForBuiltInStyles({
      designPropertiesByBreakpoint,
      breakpoints,
      node,
    });

    expect(stylesheetData).toHaveLength(2);
    const desktop = stylesheetData[0];
    const tablet = stylesheetData[1];

    expect(desktop).toEqual({
      breakpointCondition: breakpoints[0].query,
      className: expect.stringMatching(/^cfstyles-\w{32}$/),
      css: 'box-sizing:border-box;margin:7px;',
    });

    expect(tablet).toEqual({
      breakpointCondition: breakpoints[1].query,
      className: expect.stringMatching(/^cfstyles-\w{32}$/),
      css: 'box-sizing:border-box;margin:42px;padding:11px;',
    });
  });
});

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
});

describe('useMediaQuery', () => {
  it('returns the generated className and css for given design properties', () => {
    const { result } = renderHook(() =>
      useMediaQuery({
        designPropertiesByBreakpoint,
        breakpoints,
        node,
      }),
    );

    const stylesheetData = createStylesheetsForBuiltInStyles({
      designPropertiesByBreakpoint,
      breakpoints,
      node,
    });
    const expectedResult = convertResolvedDesignValuesToMediaQuery(stylesheetData);
    expect(result.current).toEqual(expectedResult);
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
        `@media (max-width:992px) and (not (max-width:576px)){.${tablet.className}{display:none !important;}}`,
      );
    });
  });
});
