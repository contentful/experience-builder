import type { Breakpoint, ResolveDesignValueType } from '@contentful/experiences-core/types';
import {
  mediaQueryMatcher,
  getFallbackBreakpointIndex,
  getActiveBreakpointIndex,
  getValueForBreakpoint,
} from '@contentful/experiences-core';
import { useCallback, useEffect, useState } from 'react';

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

  // Register event listeners to update the media query states
  useEffect(() => {
    const [mediaQueryMatchers, initialMediaQueryMatches] = mediaQueryMatcher(breakpoints);
    console.log('~mediaQueryMatchers', mediaQueryMatchers);

    setMediaQueryMatches(initialMediaQueryMatches);
    console.log('~mediaQueryMatches', initialMediaQueryMatches);

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
  }, [breakpoints]);

  const resolveDesignValue: ResolveDesignValueType = useCallback(
    (valuesByBreakpoint, variableName) => {
      const fallbackBreakpointIndex = getFallbackBreakpointIndex(breakpoints);

      const activeBreakpointIndex = getActiveBreakpointIndex(
        breakpoints,
        mediaQueryMatches,
        fallbackBreakpointIndex,
      );
      if (variableName === 'hide') {
        console.log('~valuesByBreakpoint', valuesByBreakpoint);
        console.log('~breakpoints', breakpoints);
        console.log('~fallbackBreakpointIndex', fallbackBreakpointIndex);
        console.log('~mediaQueryMatches', mediaQueryMatches);
        console.log('~activeBreakpointIndex', activeBreakpointIndex);
      }

      return getValueForBreakpoint(
        valuesByBreakpoint,
        breakpoints,
        activeBreakpointIndex,
        fallbackBreakpointIndex,
        variableName,
      );
    },
    [mediaQueryMatches, breakpoints],
  );

  return { resolveDesignValue };
};
