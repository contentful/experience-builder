import { useEffect, useRef } from 'react'

/**
 * Returns the value of the argument from the previous render
 * @param {T} value
 * @returns {T | undefined} previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
