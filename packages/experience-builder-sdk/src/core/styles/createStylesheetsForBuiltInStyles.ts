import {
  addMinHeightForEmptyStructures,
  designTokensRegistry,
  flattenDesignTokenRegistry,
  maybePopulateDesignTokenValue,
  stringifyCssProperties,
  buildCfStyles,
} from '@contentful/experiences-core';
import { Breakpoint, ComponentTreeNode, PrimitiveValue } from '@contentful/experiences-core/types';
import md5 from 'md5';

export type ResolvedStylesheetData = Array<{
  className: string;
  breakpointCondition: string;
  css: string;
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

  const result: Array<{
    className: string;
    breakpointCondition: string;
    css: string;
  }> = [];

  for (const breakpoint of breakpoints) {
    const designProperties = designPropertiesByBreakpoint[breakpoint.id];
    if (!designProperties) {
      continue;
    }

    const designPropertiesWithResolvedDesignTokens = Object.entries(designProperties).reduce(
      (acc, [propertyName, value]) => ({
        ...acc,
        [propertyName]: maybePopulateDesignTokenValue(propertyName, value, flattenedDesignTokens),
      }),
      {},
    );
    /* [Data Format] `designPropertiesWithResolvedDesignTokens` is a map of property name to plain design value:
     * designPropertiesWithResolvedDesignTokens = {
     *   cfMargin: '42px',
     *   cfBackgroundColor: 'rgba(246, 246, 246, 1)',
     * }
     */

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
    });
  }

  return result;
};
