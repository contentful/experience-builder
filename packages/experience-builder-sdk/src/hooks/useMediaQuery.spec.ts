import { toMediaQuery } from '@contentful/experiences-core';
import { createBreakpoints } from '../../test/__fixtures__/breakpoints';
import { createComponentTreeNode } from '../../test/__fixtures__/componentTreeNode';
import { renderHook } from '@testing-library/react';
import {
  resolveClassNamesFromBuiltInStyles,
  convertResolvedDesignValuesToMediaQuery,
  useMediaQuery,
} from './useMediaQuery';

const designPropsByBreakpointId = {
  desktop: { cfMargin: '7px' },
  tablet: { cfMargin: '42px', cfPadding: '11px' },
};
const breakpoints = createBreakpoints();
const node = createComponentTreeNode();

describe('resolveClassNamesFromBuiltInStyles', () => {
  it('returns one style sheet entry for each used breakpoint', () => {
    const styleSheetData = resolveClassNamesFromBuiltInStyles({
      designPropsByBreakpointId,
      breakpoints,
      node,
    });

    expect(styleSheetData).toHaveLength(2);
    const desktop = styleSheetData[0];
    const tablet = styleSheetData[1];

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
    const styleSheetData = resolveClassNamesFromBuiltInStyles({
      designPropsByBreakpointId,
      breakpoints,
      node,
    });

    const result = convertResolvedDesignValuesToMediaQuery(styleSheetData);

    const desktop = styleSheetData[0];
    const tablet = styleSheetData[1];
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
        designPropsByBreakpointId,
        breakpoints,
        node,
      }),
    );

    const styleSheetData = resolveClassNamesFromBuiltInStyles({
      designPropsByBreakpointId,
      breakpoints,
      node,
    });
    const expectedResult = convertResolvedDesignValuesToMediaQuery(styleSheetData);
    expect(result.current).toEqual(expectedResult);
  });
});
