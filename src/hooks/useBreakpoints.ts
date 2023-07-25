import { useCallback, useEffect, useMemo, useState } from 'react'
import { Breakpoint, CompositionVariableValueType } from '../types'

export const MEDIA_QUERY_REGEXP = /(<|>)(\d{1,})(px|cm|mm|in|pt|pc)$/

export type ValuesPerBreakpoint =
  | Record<string, CompositionVariableValueType>
  | CompositionVariableValueType

export type ResolveDesignValueType = (
  valuesPerBreakpoint: ValuesPerBreakpoint
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
  valuesPerBreakpoint: ValuesPerBreakpoint,
  breakpoints: Breakpoint[],
  activeBreakpointIndex: number
) => {
  const fallbackBreakpointIndex = breakpoints.findIndex(({ query }) => query === '*') ?? 0
  const fallbackBreakpointId = breakpoints[fallbackBreakpointIndex].id
  if (valuesPerBreakpoint instanceof Object) {
    // Assume that the values are sorted by media query to apply the cascading CSS logic
    for (let index = activeBreakpointIndex; index >= 0; index--) {
      const breakpointId = breakpoints[index].id
      if (valuesPerBreakpoint[breakpointId]) {
        // If the value is defined, we use it and stop the breakpoints cascade
        return valuesPerBreakpoint[breakpointId]
      }
    }
    return valuesPerBreakpoint[fallbackBreakpointId]
  } else {
    console.warn('Facing a non-object value for a design value', valuesPerBreakpoint)
    return valuesPerBreakpoint
  }
}

/*
 * Registers media query change listeners for each breakpoint (except for "*").
 * It will always assume the last matching media query in the list. It therefore,
 * assumes that the breakpoints are sorted beginning with the default value (query: "*")
 * and then decending by screen width. For mobile-first designs, the order would be ascending
 */
export const useBreakpoints = (breakpoints: Breakpoint[]) => {
  const [breakpointMatches, setMediaQueryMatches] = useState<Record<string, boolean>>({})

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
    if (Object.values(breakpointMatches).length === 0) return fallbackBreakpointIndex
    // Find the first breakpoint in the list that is not active
    const firstNotMatchingIndex = mediaQueryMatchers.findIndex(
      ({ id }) => breakpointMatches[id] !== true
    )
    // If all are applying, we take the last one (desktop-first: the smallest one)
    if (firstNotMatchingIndex === -1) return breakpoints.length - 1
    // If no media query is matching, we take the fallback breakpoint (desktop-first: desktop)
    if (firstNotMatchingIndex === 0) return fallbackBreakpointIndex
    // The last active one is the one before the first not matching one
    const { id: activeBreakpointId } = mediaQueryMatchers[firstNotMatchingIndex - 1]
    return breakpoints.findIndex(({ id }) => id === activeBreakpointId)
  }, [breakpoints, breakpointMatches, fallbackBreakpointIndex])

  const resolveDesignValue: ResolveDesignValueType = useCallback(
    (valuesPerBreakpoint: ValuesPerBreakpoint): CompositionVariableValueType => {
      return getValueForBreakpoint(valuesPerBreakpoint, breakpoints, activeBreakpointIndex)
    },
    [activeBreakpointIndex, fallbackBreakpointId]
  )

  return { resolveDesignValue }
}
