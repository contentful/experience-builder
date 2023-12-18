import { Breakpoint, ValuesByBreakpoint } from '@/types';

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

const getFallbackBreakpointIndex = (breakpoints: Breakpoint[]) => {
  // We assume that there will be a single breakpoint which uses the wildcard query.
  // If there is none, we just take the first one in the list.
  return Math.max(
    breakpoints.findIndex(({ query }) => query === '*'),
    0
  );
};
