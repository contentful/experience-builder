import { toMediaQuery } from '@contentful/experiences-core';
import { createBreakpoints } from '../../../test/__fixtures__/breakpoints';
import { createComponentTreeNode } from '../../../test/__fixtures__/componentTreeNode';
import { createStylesheetsForBuiltInStyles } from './createStylesheetsForBuiltInStyles';
import { convertResolvedDesignValuesToMediaQuery } from './convertResolvedDesignValuesToMediaQuery';

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
});
