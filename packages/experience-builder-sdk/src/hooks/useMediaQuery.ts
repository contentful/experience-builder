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
  wrapperClassName?: string;
  breakpointCondition: string;
  css: string;
  wrapperCss?: string;
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

  const isAnyVisibilityValueHidden = Object.values(designPropertiesByBreakpoint).some(
    (designProperties) => designProperties.cfVisibility === false,
  );

  const result: Array<{
    className: string;
    wrapperClassName?: string;
    breakpointCondition: string;
    css: string;
    wrapperCss?: string;
  }> = [];

  for (const breakpoint of breakpoints) {
    let wrapperClassName: string | undefined;
    let wrapperCss: string | undefined;
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
    if (isAnyVisibilityValueHidden) {
      // If the node has a visibility property, we need to create a wrapper className
      // to apply the visibility styles.
      if ((designPropertiesWithResolvedDesignTokens.cfVisibility as unknown) === false) {
        wrapperCss = 'display:none;';
      } else {
        wrapperCss = 'display:contents;';
      }
      const styleHash = patternRootNodeIdsChain
        ? md5(`${patternRootNodeIdsChain}-${node.id}}-${wrapperCss}-${breakpoint.id}`)
        : md5(`${node.id}-${wrapperCss}-${breakpoint.id}`);
      wrapperClassName = `cfwrapper-${styleHash}`;
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
      wrapperClassName,
      breakpointCondition: breakpoint.query,
      css: breakpointCss,
      wrapperCss,
    });
  }

  return result;
};

/**
 * Takes the CSS code for each breakpoint and merges them into a single CSS string.
 * It will wrap each breakpoint's CSS code in a media query (exception: default breakpoint with '*').
 *
 * **Example Input:**
 * ```
 * [
 *  { className: 'cfstyles-123', breakpointCondition: '*', css: 'color:red;' },
 *  { className: 'cfstyles-456', breakpointCondition: '<768px', css: 'color:blue;' },
 * ]
 * ```
 *
 * **Example Output:**
 * ```
 * '.cfstyles-123{color:red;}@media(max-width:768px){.cfstyles-456{color:blue;}}'
 * ```
 */
export const convertResolvedDesignValuesToMediaQuery = (stylesheetData: ResolvedStylesheetData) => {
  const stylesheet = stylesheetData.reduce(
    (acc, { breakpointCondition, className, wrapperClassName, css, wrapperCss }) => {
      const wrapperMediaQueryCss =
        wrapperClassName && wrapperCss
          ? toMediaQuery({
              condition: breakpointCondition,
              cssByClassName: { [wrapperClassName]: wrapperCss },
            })
          : '';
      const wrapperClassNames = wrapperMediaQueryCss
        ? [...acc.wrapperClassNames, wrapperClassName!]
        : acc.wrapperClassNames;

      if (acc.classNames.includes(className)) {
        return {
          classNames: acc.classNames,
          wrapperClassNames,
          css: `${acc.css}${wrapperMediaQueryCss}`,
        };
      }

      const mediaQueryCss = toMediaQuery({
        condition: breakpointCondition,
        cssByClassName: { [className]: css },
      });
      return {
        classNames: [...acc.classNames, className],
        wrapperClassNames,
        css: `${acc.css}${mediaQueryCss}${wrapperMediaQueryCss}`,
      };
    },
    {
      classNames: [] as string[],
      wrapperClassNames: [] as string[],
      css: '',
    },
  );

  return {
    css: stylesheet.css,
    className: stylesheet.classNames.join(' '),
    wrapperClassName: stylesheet.wrapperClassNames.join(' '),
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
