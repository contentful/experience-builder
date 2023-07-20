import { useCallback, useEffect, useMemo, useState } from 'react'
import { Breakpoint, CompositionVariableValueType } from '../types'

const toCSSMediaQuery = ({ query }: Breakpoint): string | undefined => {
  if (query === '*') return undefined
  const maxScreenWidth = query.match(/<(\w+)/)?.[1]
  if (maxScreenWidth) return `(max-width: ${maxScreenWidth})`
  const minScreenWidth = query.match(/>(\w+)/)?.[1]
  if (minScreenWidth) return `(min-width: ${minScreenWidth})`
  return undefined
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
          return [breakpoint.id, mediaQueryMatcher] as const
        })
        .filter((query): query is [string, MediaQueryList] => !!query),
    [breakpoints]
  )

  // Register event listeners to update the media query states
  useEffect(() => {
    const eventListeners = mediaQueryMatchers.map(([breakpointId, signal]) => {
      const onChange = () =>
        setMediaQueryMatches((prev) => ({
          ...prev,
          [breakpointId]: signal.matches,
        }))
      signal.addEventListener('change', onChange)
      return onChange
    })

    return () => {
      eventListeners.forEach((eventListener, index) => {
        mediaQueryMatchers[index][1].removeEventListener('change', eventListener)
      })
    }
  }, [mediaQueryMatchers])

  const activeBreakpointId = useMemo(() => {
    if (Object.values(breakpointMatches).length === 0) return fallbackBreakpointIndex
    // Find the first breakpoint in the list that is not active
    const firstNotMatchingIndex = mediaQueryMatchers.findIndex(
      ([breakpointId]) => breakpointMatches[breakpointId] !== true
    )
    // If all are applying, we take the last one (desktop-first: the smallest one)
    if (firstNotMatchingIndex === -1) return breakpoints[breakpoints.length - 1].id
    // If no media query is matching, we take the fallback breakpoint (desktop-first: desktop)
    if (firstNotMatchingIndex === 0) return breakpoints[fallbackBreakpointIndex].id
    // The last active one is the one before the first not matching one
    return mediaQueryMatchers[firstNotMatchingIndex - 1][0]
  }, [breakpointMatches, fallbackBreakpointIndex])

  const resolveDesignValue = useCallback(
    (
      valuesPerBreakpoint:
        | Record<string, CompositionVariableValueType>
        | CompositionVariableValueType
    ): CompositionVariableValueType => {
      if (valuesPerBreakpoint instanceof Object) {
        return (
          valuesPerBreakpoint[activeBreakpointId] ??
          valuesPerBreakpoint[fallbackBreakpointId] ??
          valuesPerBreakpoint
        )
      } else {
        console.warn('Facing a non-object value for a design value', valuesPerBreakpoint)
        return valuesPerBreakpoint
      }
    },
    [activeBreakpointId, fallbackBreakpointId]
  )

  return { resolveDesignValue }
}
