import {
  maybeAdjustStructureComponentHeight,
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
}>;

export const createStylesheetsForBuiltInStyles = ({
  designPropertiesByBreakpoint,
  breakpoints,
  node,
}: {
  designPropertiesByBreakpoint: Record<string, Record<string, PrimitiveValue>>;
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
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

    // Convert CF-specific property names to CSS variables, e.g. `cfMargin` -> `margin`
    const cfStyles = maybeAdjustStructureComponentHeight(
      buildCfStyles(designPropertiesWithResolvedDesignTokens),
      node,
    );
    const cssRules = stringifyCssProperties(cfStyles);

    // Create a hash ensuring stability across nodes (and breakpoints between nodes)
    const styleHash = md5(`${node.id}}-${cssRules}`);

    // Create a CSS className with internal prefix to make sure the value can be processed
    const className = `cfstyles-${styleHash}`;

    result.push({
      className,
      breakpointCondition: breakpoint.query,
      css: cssRules,
    });
  }

  return result;
};

export const convertResolvedDesignValuesToMediaQuery = (stylesheetData: ResolvedStylesheetData) => {
  const stylesheet = stylesheetData.reduce(
    (acc, { breakpointCondition, className, css }) => {
      if (acc.classNames.includes(className)) {
        return acc;
      }

      const mediaQueryCss = toMediaQuery({
        condition: breakpointCondition,
        cssByClassName: { [className]: css },
      });
      return {
        classNames: [...acc.classNames, className],
        css: `${acc.css}${mediaQueryCss}`,
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
}: {
  designPropertiesByBreakpoint: Record<string, Record<string, any>>;
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
}) => {
  return useMemo(() => {
    const stylesheetData = createStylesheetsForBuiltInStyles({
      designPropertiesByBreakpoint,
      breakpoints,
      node,
    });

    return convertResolvedDesignValuesToMediaQuery(stylesheetData);
  }, [designPropertiesByBreakpoint, breakpoints, node]);
};
