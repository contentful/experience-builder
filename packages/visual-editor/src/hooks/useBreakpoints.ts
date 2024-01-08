import type {
  ValuesByBreakpoint,
  Breakpoint,
  CompositionVariableValueType,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import {
  mediaQueryMatcher,
  getFallbackBreakpointIndex,
  getActiveBreakpointIndex,
  getValueForBreakpoint,
} from '@contentful/experience-builder-core';
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
  const [mediaQueryMatchers, initialMediaQueryMatches] = mediaQueryMatcher(breakpoints);

  const [mediaQueryMatches, setMediaQueryMatches] =
    useState<Record<string, boolean>>(initialMediaQueryMatches);

  const fallbackBreakpointIndex = getFallbackBreakpointIndex(breakpoints);

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

  const activeBreakpointIndex = getActiveBreakpointIndex(
    breakpoints,
    mediaQueryMatches,
    fallbackBreakpointIndex
  );

  const resolveDesignValue: ResolveDesignValueType = useCallback(
    (
      valuesByBreakpoint: ValuesByBreakpoint,
      variableName: string
    ): CompositionVariableValueType => {
      return getValueForBreakpoint(
        valuesByBreakpoint,
        breakpoints,
        activeBreakpointIndex,
        variableName
      );
    },
    [activeBreakpointIndex, breakpoints]
  );

  return { resolveDesignValue };
};
