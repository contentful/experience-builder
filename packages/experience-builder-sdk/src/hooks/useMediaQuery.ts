import {
  addMinHeightForEmptyStructures,
  designTokensRegistry,
  flattenDesignTokenRegistry,
  maybePopulateDesignTokenValue,
  stringifyCssProperties,
  toMediaQuery,
  buildCfStyles,
} from '@contentful/experiences-core';
import { Breakpoint, ComponentTreeNode, PrimitiveValue } from '@contentful/experiences-core/types';
import md5 from 'md5';
import { useMemo } from 'react';

type ResolvedStylesheetData = Array<{
  className: string;
  breakpointCondition: string;
  css: string;
  visibilityCss?: string;
}>;

/**
 * For each provided breakpoint, create the CSS code and a unique class name.
 *
 * **Example Output:**
 * ```
 * [
 *   { className: 'cfstyles-123', breakpointCondition: '*', css: 'margin:42px;' },
 *   { className: 'cfstyles-456', breakpointCondition: '<768px', css: 'margin:13px;' },
 * ]
 * ```
 */
export const createStylesheetsForBuiltInStyles = ({
  designPropertiesByBreakpoint,
  breakpoints,
  node,
  patternRootNodeIdsChain,
}: {
  designPropertiesByBreakpoint: Record<string, Record<string, PrimitiveValue>>;
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
  patternRootNodeIdsChain?: string;
}): ResolvedStylesheetData => {
  const flattenedDesignTokens = flattenDesignTokenRegistry(designTokensRegistry);

  // When the node is hidden  for any breakpoint, we need to handle this separately with a disjunct media query.
  const isAnyVisibilityValueHidden = Object.values(designPropertiesByBreakpoint).some(
    (designProperties) => designProperties.cfVisibility === false,
  );
  // We always need an explicit value when using disjunct media queries
  // Example: desktop uses "false" and tablet is undefined -> we need to set `display: none` for tablet as well.
  let previousVisibilityValue: boolean | undefined;

  const result: Array<{
    className: string;
    breakpointCondition: string;
    css: string;
    visibilityCss?: string;
  }> = [];

  for (const breakpoint of breakpoints) {
    let visibilityCss: string | undefined;
    const designProperties = designPropertiesByBreakpoint[breakpoint.id];
    if (!designProperties) {
      continue;
    }

    const designPropertiesWithResolvedDesignTokens = Object.entries(designProperties).reduce(
      (acc, [propertyName, value]) => ({
        ...acc,
        [propertyName]: maybePopulateDesignTokenValue(
          propertyName,
          value,
          flattenedDesignTokens,
        ) as string,
      }),
      {} as Record<string, PrimitiveValue>,
    );
    /* [Data Format] `designPropertiesWithResolvedDesignTokens` is a map of property name to plain design value:
     * designPropertiesWithResolvedDesignTokens = {
     *   cfMargin: '42px',
     *   cfBackgroundColor: 'rgba(246, 246, 246, 1)',
     * }
     */

    // Special case for visibility to override any custom `display` values but only for a specific breakpoint.
    if (isAnyVisibilityValueHidden) {
      const visibilityValue =
        (designPropertiesWithResolvedDesignTokens.cfVisibility as boolean | undefined) ??
        previousVisibilityValue;
      previousVisibilityValue = visibilityValue;
      if (visibilityValue === false) {
        visibilityCss = 'display:none !important;';
      } else {
        visibilityCss = '';
      }
    }

    // Convert CF-specific property names to CSS variables, e.g. `cfMargin` -> `margin`
    const cfStyles = addMinHeightForEmptyStructures(
      buildCfStyles(designPropertiesWithResolvedDesignTokens),
      node,
    );
    /* [Data Format] `cfStyles` follows the shape of CSSProperties (camelCased CSS property names):
     * cfStyles = {
     *   margin: '42px',
     *   backgroundColor: 'rgba(246, 246, 246, 1)',
     * }
     */

    // Translate the map of CSSProperties into the final shape of CSS code for this specific breakpoint
    const breakpointCss = stringifyCssProperties(cfStyles);
    /* [Data Format] `breakpointCss`:
     * breakpointCss = "margin:42px;background-color:rgba(246, 246, 246, 1);"
     */

    // Create a hash ensuring stability across nodes (and breakpoints between nodes)
    const styleHash = patternRootNodeIdsChain
      ? md5(`${patternRootNodeIdsChain}-${node.id}}-${breakpointCss}`)
      : md5(`${node.id}-${breakpointCss}`);

    // Create a CSS className with internal prefix to make sure the value can be processed
    const className = `cfstyles-${styleHash}`;

    result.push({
      className,
      breakpointCondition: breakpoint.query,
      css: breakpointCss,
      visibilityCss,
    });
  }

  return result;
};

/**
 * Turns a condition like `<768px` or `>1024px` into a media query rule.
 * For example, `<768px` becomes `max-width:768px` and `>1024px` becomes `min-width:1024px`.
 */
const toMediaQueryRule = (condition: string) => {
  const [evaluation, pixelValue] = [condition[0], condition.substring(1)];
  const mediaQueryRule = evaluation === '<' ? 'max-width' : 'min-width';
  return `(${mediaQueryRule}:${pixelValue})`;
};

const toDisjunctMediaQuery = ({
  className,
  condition,
  nextCondition,
  css,
}: {
  className: string;
  condition: string;
  nextCondition?: string;
  css?: string;
}) => {
  if (!css) {
    return '';
  }
  if (!nextCondition) {
    return toMediaQuery({
      condition,
      cssByClassName: { [className]: css },
    });
  }
  const nextRule = toMediaQueryRule(nextCondition);
  if (condition === '*') {
    return `@media not ${nextRule}{.${className}{${css}}}`;
  }

  const currentRule = toMediaQueryRule(condition);
  return `@media ${currentRule} and (not ${nextRule}){.${className}{${css}}}`;
};

/**
 * Takes the CSS code for each breakpoint and merges them into a single CSS string.
 * It will wrap each breakpoint's CSS code in a media query (exception: default breakpoint with '*').
 *
 * **Example Input:**
 * ```
 * [
 *  { className: 'cfstyles-123', breakpointCondition: '*', css: 'color:red;', visibilityCss: 'display:none !important;' },
 *  { className: 'cfstyles-456', breakpointCondition: '<768px', css: 'color:blue;' },
 * ]
 * ```
 *
 * **Example Output:**
 * ```
 * '.cfstyles-123{color:red;}@media not (max-width:768px){.cfstyles-123{display:none !important;}}@media(max-width:768px){.cfstyles-456{color:blue;}}'
 * ```
 */
export const convertResolvedDesignValuesToMediaQuery = (stylesheetData: ResolvedStylesheetData) => {
  const stylesheet = stylesheetData.reduce(
    (acc, { breakpointCondition, className, css, visibilityCss }, index) => {
      const wrapperMediaQueryCss = toDisjunctMediaQuery({
        condition: breakpointCondition,
        className,
        css: visibilityCss,
        // Validation ensures that it starts with the '*' breakpoint
        nextCondition: stylesheetData[index + 1]?.breakpointCondition,
      });

      if (acc.classNames.includes(className)) {
        return {
          classNames: acc.classNames,
          css: `${acc.css}${wrapperMediaQueryCss}`,
        };
      }

      const mediaQueryCss = toMediaQuery({
        condition: breakpointCondition,
        cssByClassName: { [className]: css },
      });
      return {
        classNames: [...acc.classNames, className],
        css: `${acc.css}${mediaQueryCss}${wrapperMediaQueryCss}`,
      };
    },
    {
      classNames: [] as string[],
      css: '',
    },
  );

  return {
    css: stylesheet.css,
    className: stylesheet.classNames.join(' '),
  };
};

export const useMediaQuery = ({
  designPropertiesByBreakpoint,
  breakpoints,
  node,
  patternRootNodeIdsChain,
}: {
  designPropertiesByBreakpoint: Record<string, Record<string, any>>;
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
  patternRootNodeIdsChain?: string;
}) => {
  return useMemo(() => {
    const stylesheetData = createStylesheetsForBuiltInStyles({
      designPropertiesByBreakpoint,
      breakpoints,
      node,
      patternRootNodeIdsChain,
    });

    return convertResolvedDesignValuesToMediaQuery(stylesheetData);
  }, [designPropertiesByBreakpoint, breakpoints, node, patternRootNodeIdsChain]);
};
