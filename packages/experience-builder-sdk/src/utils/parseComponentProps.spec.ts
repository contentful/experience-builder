import { parseComponentProps } from './parseComponentProps';
import { getValueForBreakpoint } from '@contentful/experiences-core';
import { createBreakpoints } from '../../test/__fixtures__/breakpoints';
import { createComponentDefinition } from '../../test/__fixtures__/componentDefinition';
import {
  createComponentTreeNode,
  createComponentTreeNodeWithCfBackgroundImageUrl,
} from '../../test/__fixtures__/componentTreeNode';
import { ValuesByBreakpoint } from '@contentful/experiences-validators';

type ParseComponentPropsArg0 = Parameters<typeof parseComponentProps>[0];

describe('parseComponentProps', () => {
  const breakpoints = createBreakpoints();
  const activeBreakpointIndex = 2;
  const mainBreakpoint = breakpoints[0];
  const componentDefinition = createComponentDefinition();
  const node = createComponentTreeNode();
  const resolveDesignValue = (valuesByBreakpoint: ValuesByBreakpoint | undefined) =>
    getValueForBreakpoint(valuesByBreakpoint, breakpoints, activeBreakpointIndex, 0);

  const resolveBoundValue = () => 'resolvedBoundValue';
  const resolveHyperlinkValue = () => 'resolvedHyperlinkValue';
  const resolveUnboundValue = () => 'resolvedUnboundValue';
  const resolvePrebindingValue = () => 'resolvedPrebindingValue';

  const defaultArguments: Parameters<typeof parseComponentProps>[0] = {
    mainBreakpoint,
    breakpoints,
    componentDefinition,
    node,
    resolveDesignValue,
    resolveBoundValue,
    resolveHyperlinkValue,
    resolveUnboundValue,
    resolvePrebindingValue,
  };

  it('returns CSS code including media query', () => {
    const result = parseComponentProps(defaultArguments);
    expect(result.mediaQuery).toEqual({
      // One CSS class per breakpoint
      className: expect.stringMatching(/^cfstyles-\w{32} cfstyles-\w{32}$/),
      css: expect.stringMatching(
        /\.cfstyles-\w{32}{background-color:rgba\(255, 0, 0, 1\);}@media\(max-width:992px\){\.cfstyles-\w{32}{background-color:rgba\(0, 255, 0, 1\);}}/,
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

  describe('to handle special case of "siamese"  cfBackgroundImageUrl and cfBackgroundImageOptions cf-styles', () => {
    describe('we create "fake" ephemeral cfBackgroundImageUrl style prop with all breakpoints', () => {
      it('when cfBackgroundImageUrl is BoundValue', () => {
        jest.resetModules();

        const _createStylesheetsForBuiltInStyles = jest.fn(() => []);
        const _convertResolvedDesignValuesToMediaQuery = jest.fn();

        jest.doMock('../core/styles/createStylesheetsForBuiltInStyles', () => ({
          createStylesheetsForBuiltInStyles: _createStylesheetsForBuiltInStyles,
        }));

        jest.doMock('../core/styles/convertResolvedDesignValuesToMediaQuery', () => ({
          convertResolvedDesignValuesToMediaQuery: _convertResolvedDesignValuesToMediaQuery,
        }));

        const newArguments: ParseComponentPropsArg0 = {
          mainBreakpoint,
          breakpoints,
          componentDefinition,
          node: createComponentTreeNodeWithCfBackgroundImageUrl(),
          resolveDesignValue,
          resolveBoundValue,
          resolveHyperlinkValue,
          resolveUnboundValue,
          resolvePrebindingValue,
        };

        // Re-import after mocking
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { parseComponentProps } = require('./parseComponentProps');
        const result = parseComponentProps(newArguments);
        expect(_createStylesheetsForBuiltInStyles).toHaveBeenCalledTimes(1);
        expect(_convertResolvedDesignValuesToMediaQuery).toHaveBeenCalledTimes(1);
        expect(result.styleProps).toEqual(
          expect.objectContaining({
            // ensures that we create "fake" styleProp with all breakpoints expanded
            cfBackgroundImageUrl: {
              desktop: 'resolvedBoundValue',
              tablet: 'resolvedBoundValue',
              mobile: 'resolvedBoundValue',
            },
          }),
        );
      });
      it('when cfBackgroundImageUrl is UnboundValue', () => {
        jest.resetModules();

        const _createStylesheetsForBuiltInStyles = jest.fn();
        const _convertResolvedDesignValuesToMediaQuery = jest.fn();

        jest.doMock('../core/styles/createStylesheetsForBuiltInStyles', () => ({
          createStylesheetsForBuiltInStyles: _createStylesheetsForBuiltInStyles,
        }));

        jest.doMock('../core/styles/convertResolvedDesignValuesToMediaQuery', () => ({
          convertResolvedDesignValuesToMediaQuery: _convertResolvedDesignValuesToMediaQuery,
        }));

        const newArguments: ParseComponentPropsArg0 = {
          mainBreakpoint,
          breakpoints,
          componentDefinition,
          node: createComponentTreeNodeWithCfBackgroundImageUrl(),
          resolveDesignValue,
          resolveBoundValue,
          resolveHyperlinkValue,
          resolveUnboundValue,
          resolvePrebindingValue,
        };

        newArguments.node.variables.cfBackgroundImageUrl = {
          type: 'UnboundValue',
          key: 'uv123',
        };

        // Re-import after mocking
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { parseComponentProps } = require('./parseComponentProps');
        const result = parseComponentProps(newArguments);
        expect(_createStylesheetsForBuiltInStyles).toHaveBeenCalledTimes(1);
        expect(_convertResolvedDesignValuesToMediaQuery).toHaveBeenCalledTimes(1);
        expect(result.styleProps).toEqual(
          expect.objectContaining({
            // ensures that we create "fake" styleProp with all breakpoints expanded
            cfBackgroundImageUrl: {
              desktop: 'resolvedUnboundValue',
              tablet: 'resolvedUnboundValue',
              mobile: 'resolvedUnboundValue',
            },
          }),
        );
      });
      it('when cfBackgroundImageUrl is ComponentValue', () => {
        jest.resetModules();

        const _createStylesheetsForBuiltInStyles = jest.fn();
        const _convertResolvedDesignValuesToMediaQuery = jest.fn();

        jest.doMock('../core/styles/createStylesheetsForBuiltInStyles', () => ({
          createStylesheetsForBuiltInStyles: _createStylesheetsForBuiltInStyles,
        }));

        jest.doMock('../core/styles/convertResolvedDesignValuesToMediaQuery', () => ({
          convertResolvedDesignValuesToMediaQuery: _convertResolvedDesignValuesToMediaQuery,
        }));

        const newArguments: ParseComponentPropsArg0 = {
          mainBreakpoint,
          breakpoints,
          componentDefinition,
          node: createComponentTreeNodeWithCfBackgroundImageUrl(),
          resolveDesignValue,
          resolveBoundValue,
          resolveHyperlinkValue,
          resolveUnboundValue,
          resolvePrebindingValue,
        };

        newArguments.node.variables.cfBackgroundImageUrl = {
          type: 'ComponentValue',
          key: 'patternVar123',
        };

        // Re-import after mocking
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { parseComponentProps } = require('./parseComponentProps');
        const result = parseComponentProps(newArguments);
        expect(_createStylesheetsForBuiltInStyles).toHaveBeenCalledTimes(1);
        expect(_convertResolvedDesignValuesToMediaQuery).toHaveBeenCalledTimes(1);
        expect(result.styleProps).toEqual(
          expect.objectContaining({
            // ensures that we create "fake" styleProp with all breakpoints expanded
            cfBackgroundImageUrl: {
              desktop: 'resolvedPrebindingValue',
              tablet: 'resolvedPrebindingValue',
              mobile: 'resolvedPrebindingValue',
            },
          }),
        );
      });
    });
  });
});
