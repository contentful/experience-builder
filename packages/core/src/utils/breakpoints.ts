import { getDesignTokenRegistration } from '@/registries';
import { Breakpoint, ValuesByBreakpoint } from '@/types';

export const MEDIA_QUERY_REGEXP = /(<|>)(\d{1,})(px|cm|mm|in|pt|pc)$/;

const toCSSMediaQuery = ({ query }: Breakpoint): string | undefined => {
  if (query === '*') return undefined;
  const match = query.match(MEDIA_QUERY_REGEXP);
  if (!match) return undefined;
  const [, operator, value, unit] = match;
  if (operator === '<') {
    const maxScreenWidth = Number(value) - 1;
    return `(max-width: ${maxScreenWidth}${unit})`;
  } else if (operator === '>') {
    const minScreenWidth = Number(value) + 1;
    return `(min-width: ${minScreenWidth}${unit})`;
  }
  return undefined;
};

// Remove this helper when upgrading to TypeScript 5.0 - https://github.com/microsoft/TypeScript/issues/48829
const findLast = <T>(
  array: Array<T>,
  predicate: Parameters<Array<T>['find']>[0]
): T | undefined => {
  return array.reverse().find(predicate);
};

// Initialise media query matchers. This won't include the always matching fallback breakpoint.
export const mediaQueryMatcher = (breakpoints: Breakpoint[]) => {
  const mediaQueryMatches: Record<string, boolean> = {};

  const mediaQueryMatchers = breakpoints
    .map((breakpoint) => {
      const cssMediaQuery = toCSSMediaQuery(breakpoint);
      if (!cssMediaQuery) return undefined;
      if (typeof window === 'undefined') return undefined;
      const mediaQueryMatcher = window.matchMedia(cssMediaQuery);

      mediaQueryMatches[breakpoint.id] = mediaQueryMatcher.matches;
      return { id: breakpoint.id, signal: mediaQueryMatcher };
    })
    .filter((matcher): matcher is { id: string; signal: MediaQueryList } => !!matcher);

  return [mediaQueryMatchers, mediaQueryMatches] as [
    typeof mediaQueryMatchers,
    typeof mediaQueryMatches
  ];
};

export const getActiveBreakpointIndex = (
  breakpoints: Breakpoint[],
  mediaQueryMatches: Record<string, boolean>,
  fallbackBreakpointIndex: number
) => {
  // The breakpoints are ordered (desktop-first: descending by screen width)
  const breakpointsWithMatches = breakpoints.map(({ id }, index) => ({
    id,
    index,
    // The fallback breakpoint with wildcard query will always match
    isMatch: mediaQueryMatches[id] ?? true,
  }));

  // Find the last breakpoint in the list that matches (desktop-first: the narrowest one)
  const mostSpecificIndex = findLast(breakpointsWithMatches, ({ isMatch }) => isMatch)?.index;
  return mostSpecificIndex ?? fallbackBreakpointIndex;
};

export const getFallbackBreakpointIndex = (breakpoints: Breakpoint[]) => {
  // We assume that there will be a single breakpoint which uses the wildcard query.
  // If there is none, we just take the first one in the list.
  return Math.max(
    breakpoints.findIndex(({ query }) => query === '*'),
    0
  );
};

const builtInStylesWithDesignTokens = [
  'cfMargin',
  'cfPadding',
  'cfGap',
  'cfWidth',
  'cfHeight',
  'cfBackgroundColor',
  'cfFontSize',
  'cfLineHeight',
  'cfLetterSpacing',
];

export const getValueForBreakpoint = (
  valuesByBreakpoint: ValuesByBreakpoint,
  breakpoints: Breakpoint[],
  activeBreakpointIndex: number,
  variableName: string
) => {
  const fallbackBreakpointIndex = getFallbackBreakpointIndex(breakpoints);
  const fallbackBreakpointId = breakpoints[fallbackBreakpointIndex].id;
  if (valuesByBreakpoint instanceof Object) {
    // Assume that the values are sorted by media query to apply the cascading CSS logic
    for (let index = activeBreakpointIndex; index >= 0; index--) {
      const breakpointId = breakpoints[index].id;
      if (builtInStylesWithDesignTokens.includes(variableName)) {
        const breakpointValue =
          valuesByBreakpoint[breakpointId] || valuesByBreakpoint[fallbackBreakpointId];

        return getDesignTokenRegistration(breakpointValue, variableName);
      }
      if (valuesByBreakpoint[breakpointId]) {
        // If the value is defined, we use it and stop the breakpoints cascade
        return valuesByBreakpoint[breakpointId];
      }
    }
    return valuesByBreakpoint[fallbackBreakpointId];
  } else {
    return valuesByBreakpoint;
  }
};
