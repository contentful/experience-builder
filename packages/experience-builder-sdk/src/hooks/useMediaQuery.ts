import {
  buildCfStyles,
  designTokensRegistry,
  flattenDesignTokenRegistry,
  isStructureWithRelativeHeight,
  maybePopulateDesignTokenValue,
  toCSSAttribute,
  toCSSString,
  toMediaQuery,
} from '@contentful/experiences-core';
import { EMPTY_CONTAINER_HEIGHT } from '@contentful/experiences-core/constants';
import { Breakpoint, ComponentTreeNode } from '@contentful/experiences-core/types';
import md5 from 'md5';
import { useMemo } from 'react';

type ResolvedStylesheetData = Array<{
  className: string;
  breakpointCondition: string;
  css: string;
}>;

export const resolveClassNamesFromBuiltInStyles = ({
  designPropsByBreakpointId,
  breakpoints,
  node,
}: {
  designPropsByBreakpointId: Record<string, Record<string, any>>;
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
}): ResolvedStylesheetData => {
  const mapOfDesignVariableKeys = flattenDesignTokenRegistry(designTokensRegistry);
  const currentNodeClassNames: string[] = [];

  const result: Array<{
    className: string;
    breakpointCondition: string;
    css: string;
  }> = [];

  // then for each breakpoint
  for (const breakpoint of breakpoints) {
    const designProps = designPropsByBreakpointId[breakpoint.id];
    if (!designProps) {
      continue;
    }

    const propsByBreakpointWithResolvedDesignTokens = Object.entries(designProps).reduce(
      (acc, [propName, propValue]) => {
        return {
          ...acc,
          [propName]: maybePopulateDesignTokenValue(propName, propValue, mapOfDesignVariableKeys),
        };
      },
      {},
    );

    // We convert cryptic prop keys to css variables
    // Eg: cfMargin to margin
    const stylesForBreakpoint = buildCfStyles(propsByBreakpointWithResolvedDesignTokens);

    if (
      !node.children.length &&
      isStructureWithRelativeHeight(node.definitionId, stylesForBreakpoint.height)
    ) {
      stylesForBreakpoint.minHeight = EMPTY_CONTAINER_HEIGHT;
    }

    const stylesForBreakpointWithoutUndefined: Record<string, string> = Object.fromEntries(
      Object.entries(stylesForBreakpoint)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [toCSSAttribute(key), value]),
    );

    /**
         * stylesForBreakpoint {
            margin: '0 0 0 0',
            padding: '0 0 0 0',
            'background-color': 'rgba(246, 246, 246, 1)',
            width: '100%',
            height: 'fit-content',
            'max-width': 'none',
            border: '0px solid rgba(0, 0, 0, 0)',
            'border-radius': '0px',
            gap: '0px 0px',
            'align-items': 'center',
            'justify-content': 'safe center',
            'flex-direction': 'column',
            'flex-wrap': 'nowrap',
            'font-style': 'normal',
            'text-decoration': 'none',
            'box-sizing': 'border-box'
          }
        */
    // I create a hash of the object above because that would ensure hash stability
    const styleHash = md5(JSON.stringify(stylesForBreakpointWithoutUndefined));

    // and prefix the className to make sure the value can be processed
    const className = `cfstyles-${styleHash}`;

    // I save the generated hashes into an array to later save it in the tree node
    // as cfSsrClassName prop
    // making sure to avoid the duplicates in case styles for > 1 breakpoints are the same
    if (!currentNodeClassNames.includes(className)) {
      currentNodeClassNames.push(className);
    }

    // otherwise, save it to the stylesheet
    result.push({
      className,
      breakpointCondition: breakpoint.query,
      css: toCSSString(stylesForBreakpointWithoutUndefined),
    });
  }

  return result;
};

export const convertResolvedDesignValuesToMediaQuery = (styleSheetData: ResolvedStylesheetData) => {
  /**
   * {
   *  className: ['cfstyles-123', 'cfstyles-456'],
   *  styleSheet: `
   *    @media (max-width: 1024px) {
   *      .cfstyles-123 { color: red; }
   *    }
   *    @media (max-width: 768px) {
   *      .cfstyles-456 { color: blue; }
   *    }
   *  `
   * }
   */
  const styleSheet = styleSheetData.reduce<{ className: Array<string>; css: string }>(
    (acc, { breakpointCondition, className, css }) => {
      if (acc.className.includes(className)) {
        return acc;
      }

      const mediaQuery = toMediaQuery({
        condition: breakpointCondition,
        cssByClassName: { [className]: css },
      });
      return {
        className: [...acc.className, className],
        css: `${acc.css}${mediaQuery}`,
      };
    },
    {
      className: [],
      css: '',
    },
  );

  const className = styleSheet.className.join(' ');

  return {
    css: styleSheet.css,
    hash: `cf-${md5(className)}`,
    className,
  };
};

export const useMediaQuery = ({
  designPropsByBreakpointId,
  breakpoints,
  node,
}: {
  designPropsByBreakpointId: Record<string, Record<string, any>>;
  breakpoints: Breakpoint[];
  node: ComponentTreeNode;
}) => {
  return useMemo(() => {
    const styleSheetData = resolveClassNamesFromBuiltInStyles({
      designPropsByBreakpointId,
      breakpoints,
      node,
    });

    return convertResolvedDesignValuesToMediaQuery(styleSheetData);
  }, [designPropsByBreakpointId, breakpoints, node]);
};
