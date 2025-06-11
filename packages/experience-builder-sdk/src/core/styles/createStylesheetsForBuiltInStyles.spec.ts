import { createBreakpoints } from '../../../test/__fixtures__/breakpoints';
import { createComponentTreeNode } from '../../../test/__fixtures__/componentTreeNode';
import { createStylesheetsForBuiltInStyles } from './createStylesheetsForBuiltInStyles';

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
