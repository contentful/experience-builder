import { parseComponentProps } from './parseComponentProps';
import { getValueForBreakpoint } from '@contentful/experiences-core';
import { createBreakpoints } from '../../test/__fixtures__/breakpoints';
import { createComponentDefinition } from '../../test/__fixtures__/componentDefinition';
import { createComponentTreeNode } from '../../test/__fixtures__/componentTreeNode';
import { PrimitiveValue } from '@contentful/experiences-validators';

describe('parseComponentProps', () => {
  const breakpoints = createBreakpoints();
  const activeBreakpointIndex = 2;
  const mainBreakpoint = breakpoints[0];
  const componentDefinition = createComponentDefinition();
  const node = createComponentTreeNode();
  const resolveDesignValue = ({
    propertyName,
    valuesByBreakpoint,
  }: {
    propertyName: string;
    valuesByBreakpoint: Record<string, PrimitiveValue>;
  }) =>
    getValueForBreakpoint(valuesByBreakpoint, breakpoints, activeBreakpointIndex, 0, propertyName);

  const resolveBoundValue = () => 'resolvedBoundValue';
  const resolveHyperlinkValue = () => 'resolvedHyperlinkValue';
  const resolveUnboundValue = () => 'resolvedUnboundValue';

  const defaultArguments = {
    mainBreakpoint,
    breakpoints,
    componentDefinition,
    node,
    resolveCustomDesignValue: resolveDesignValue,
    resolveBoundValue,
    resolveHyperlinkValue,
    resolveUnboundValue,
  };

  it('returns CSS code including media query', () => {
    const result = parseComponentProps(defaultArguments);
    expect(result.mediaQuery).toEqual({
      // One CSS class per breakpoint
      className: expect.stringMatching(/^cfstyles-\w{32} cfstyles-\w{32}$/),
      css: expect.stringMatching(
        /\.cfstyles-\w{32}{box-sizing:border-box;background-color:rgba\(255, 0, 0, 1\);}@media\(max-width:992px\){\.cfstyles-\w{32}{box-sizing:border-box;background-color:rgba\(0, 255, 0, 1\);}}/,
      ),
    });
  });

  it('returns the resolved design property values', () => {
    const result = parseComponentProps(defaultArguments);
    expect(result.styleProps).toEqual({
      cfBackgroundColor: { desktop: 'rgba(255, 0, 0, 1)', tablet: 'rgba(0, 255, 0, 1)' },
    });
  });

  it('returns the resolved custom design property values', () => {
    const result = parseComponentProps(defaultArguments);
    expect(result.customDesignProps).toEqual({
      customFontColor: 'rgba(0, 255, 255, 1)',
    });
  });

  it('returns the resolved content values', () => {
    const result = parseComponentProps(defaultArguments);
    expect(result.contentProps).toEqual({
      text: 'resolvedBoundValue',
    });
  });
});
