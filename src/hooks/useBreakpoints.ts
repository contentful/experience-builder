import { useCallback, useEffect, useMemo, useState } from 'react'
import { Breakpoint, CompositionVariableValueType } from '../types'

export const MEDIA_QUERY_REGEXP = /(<|>)(\d{1,})(px|cm|mm|in|pt|pc)$/

export type valueByBreakpoint =
  | Record<string, CompositionVariableValueType>
  | CompositionVariableValueType

export type ResolveDesignValueType = (
  valueByBreakpoint: valueByBreakpoint
) => CompositionVariableValueType

const toCSSMediaQuery = ({ query }: Breakpoint): string | undefined => {
  if (query === '*') return undefined
  const match = query.match(MEDIA_QUERY_REGEXP)
  if (!match) return undefined
  const [, operator, value, unit] = match
  if (operator === '<') {
    const maxScreenWidth = Number(value) - 1
    return `(max-width: ${maxScreenWidth}${unit})`
  } else if (operator === '>') {
    const minScreenWidth = Number(value) + 1
    return `(min-width: ${minScreenWidth}${unit})`
  }
  return undefined
}

export const getValueForBreakpoint = (
  valueByBreakpoint: valueByBreakpoint,
  breakpoints: Breakpoint[],
  activeBreakpointIndex: number
) => {
  const fallbackBreakpointIndex = breakpoints.findIndex(({ query }) => query === '*') ?? 0
  const fallbackBreakpointId = breakpoints[fallbackBreakpointIndex].id
  if (valueByBreakpoint instanceof Object) {
    // Assume that the values are sorted by media query to apply the cascading CSS logic
    for (let index = activeBreakpointIndex; index >= 0; index--) {
      const breakpointId = breakpoints[index].id
      if (valueByBreakpoint[breakpointId]) {
        // If the value is defined, we use it and stop the breakpoints cascade
        return valueByBreakpoint[breakpointId]
      }
    }
    return valueByBreakpoint[fallbackBreakpointId]
  } else {
    console.warn('Facing a non-object value for a design value', valueByBreakpoint)
    return valueByBreakpoint
  }
}

// TODO: In order to support integrations without React, we should extract this heavy logic into simple
// functions that we can reuse in other frameworks.
/*
 * Registers media query change listeners for each breakpoint (except for "*").
 * It will always assume the last matching media query in the list. It therefore,
 * assumes that the breakpoints are sorted beginning with the default value (query: "*")
 * and then decending by screen width. For mobile-first designs, the order would be ascending
 */
export const useBreakpoints = (breakpoints: Breakpoint[]) => {
  const [mediaQueryMatches, setMediaQueryMatches] = useState<Record<string, boolean>>({})

  const fallbackBreakpointIndex = breakpoints.findIndex(({ query }) => query === '*') ?? 0
  const fallbackBreakpointId = breakpoints[fallbackBreakpointIndex].id

  // Initialise media query matchers
  const mediaQueryMatchers = useMemo(
    () =>
      breakpoints
        .map((breakpoint) => {
          const cssMediaQuery = toCSSMediaQuery(breakpoint)
          if (!cssMediaQuery) return undefined
          const mediaQueryMatcher = window.matchMedia(cssMediaQuery)
          // Initialise state with current match value
          setMediaQueryMatches((prev) => ({
            ...prev,
            [breakpoint.id]: mediaQueryMatcher.matches,
          }))
          return { id: breakpoint.id, signal: mediaQueryMatcher }
        })
        .filter((matcher): matcher is { id: string; signal: MediaQueryList } => !!matcher),
    [breakpoints]
  )

  // Register event listeners to update the media query states
  useEffect(() => {
    const eventListeners = mediaQueryMatchers.map(({ id, signal }) => {
      const onChange = () =>
        setMediaQueryMatches((prev) => ({
          ...prev,
          [id]: signal.matches,
        }))
      signal.addEventListener('change', onChange)
      return onChange
    })

    return () => {
      eventListeners.forEach((eventListener, index) => {
        mediaQueryMatchers[index].signal.removeEventListener('change', eventListener)
      })
    }
  }, [mediaQueryMatchers])

  const activeBreakpointIndex = useMemo(() => {
    // The breakpoints are ordered (desktop-first: descending by screen width) and
    const breakpointsWithMatches = breakpoints.map(({ id }, index) => ({
      id,
      index,
      isMatch: id === fallbackBreakpointId ? true : mediaQueryMatches[id],
    }))

    // If all are matching, we take the last one (desktop-first: the narrowest one)
    const isEveryBreakpointMatching = breakpointsWithMatches.every((match) => match.isMatch)
    if (isEveryBreakpointMatching) {
      return breakpointsWithMatches.length - 1
    }

    // Find the last breakpoint in the list that matches (desktop-first: the narrowest one)
    const mostSpecificIndex = breakpointsWithMatches.findLast(({ isMatch }) => isMatch)?.index
    return mostSpecificIndex ?? fallbackBreakpointIndex
  }, [breakpoints, mediaQueryMatches, fallbackBreakpointIndex])

  const resolveDesignValue: ResolveDesignValueType = useCallback(
    (valueByBreakpoint: valueByBreakpoint): CompositionVariableValueType => {
      return getValueForBreakpoint(valueByBreakpoint, breakpoints, activeBreakpointIndex)
    },
    [activeBreakpointIndex, fallbackBreakpointId]
  )

  return { resolveDesignValue }
}
