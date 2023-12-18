import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  Breakpoint,
  CompositionVariableValueType,
} from '@contentful/experience-builder-core/types';

export const MEDIA_QUERY_REGEXP = /(<|>)(\d{1,})(px|cm|mm|in|pt|pc)$/;

export type ValuesByBreakpoint =
  | Record<string, CompositionVariableValueType>
  | CompositionVariableValueType;

export type ResolveDesignValueType = (
  valuesByBreakpoint: ValuesByBreakpoint
) => CompositionVariableValueType;

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

const getFallbackBreakpointIndex = (breakpoints: Breakpoint[]) => {
  // We assume that there will be a single breakpoint which uses the wildcard query.
  // If there is none, we just take the first one in the list.
  return Math.max(
    breakpoints.findIndex(({ query }) => query === '*'),
    0
  );
};

export const getValueForBreakpoint = (
  valuesByBreakpoint: ValuesByBreakpoint,
  breakpoints: Breakpoint[],
  activeBreakpointIndex: number
) => {
  const fallbackBreakpointIndex = getFallbackBreakpointIndex(breakpoints);
  const fallbackBreakpointId = breakpoints[fallbackBreakpointIndex].id;
  if (valuesByBreakpoint instanceof Object) {
    // Assume that the values are sorted by media query to apply the cascading CSS logic
    for (let index = activeBreakpointIndex; index >= 0; index--) {
      const breakpointId = breakpoints[index].id;
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

// TODO: In order to support integrations without React, we should extract this heavy logic into simple
// functions that we can reuse in other frameworks.
/*
 * Registers media query change listeners for each breakpoint (except for "*").
 * It will always assume the last matching media query in the list. It therefore,
 * assumes that the breakpoints are sorted beginning with the default value (query: "*")
 * and then decending by screen width. For mobile-first designs, the order would be ascending
 */
export const useBreakpoints = (breakpoints: Breakpoint[]) => {
  const [mediaQueryMatches, setMediaQueryMatches] = useState<Record<string, boolean>>({});

  const fallbackBreakpointIndex = getFallbackBreakpointIndex(breakpoints);

  // Initialise media query matchers. This won't include the always matching fallback breakpoint.
  const mediaQueryMatchers = useMemo(
    () =>
      breakpoints
        .map((breakpoint) => {
          const cssMediaQuery = toCSSMediaQuery(breakpoint);
          if (!cssMediaQuery) return undefined;
          if (typeof window === 'undefined') return undefined;
          const mediaQueryMatcher = window.matchMedia(cssMediaQuery);
          // Initialise state with current match value
          setMediaQueryMatches((prev) => ({
            ...prev,
            [breakpoint.id]: mediaQueryMatcher.matches,
          }));
          return { id: breakpoint.id, signal: mediaQueryMatcher };
        })
        .filter((matcher): matcher is { id: string; signal: MediaQueryList } => !!matcher),
    [breakpoints]
  );

  // Register event listeners to update the media query states
  useEffect(() => {
    const eventListeners = mediaQueryMatchers.map(({ id, signal }) => {
      const onChange = () =>
        setMediaQueryMatches((prev) => ({
          ...prev,
          [id]: signal.matches,
        }));
      signal.addEventListener('change', onChange);
      return onChange;
    });

    return () => {
      eventListeners.forEach((eventListener, index) => {
        mediaQueryMatchers[index].signal.removeEventListener('change', eventListener);
      });
    };
  }, [mediaQueryMatchers]);

  const activeBreakpointIndex = useMemo(() => {
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
  }, [breakpoints, fallbackBreakpointIndex, mediaQueryMatches]);

  const resolveDesignValue: ResolveDesignValueType = useCallback(
    (valuesByBreakpoint: ValuesByBreakpoint): CompositionVariableValueType => {
      return getValueForBreakpoint(valuesByBreakpoint, breakpoints, activeBreakpointIndex);
    },
    [activeBreakpointIndex, breakpoints]
  );

  return { resolveDesignValue };
};
