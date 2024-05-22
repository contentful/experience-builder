import { Breakpoint, validateBreakpointsDefinition } from '@contentful/experiences-validators';

// export const breakpointsRegistry = new Map<string, Breakpoint>();
export let breakpointsRegistry: Breakpoint[] = [];

/**
 * Register custom breakpoints
 * @param breakpoints - [{[key:string]: string}]
 * @returns void
 */
export const defineBreakpoints = (breakpoints: Breakpoint[]) => {
  Object.assign(breakpointsRegistry, breakpoints);
};

export const runBreakpointsValidation = () => {
  const validation = validateBreakpointsDefinition(breakpointsRegistry);
  if (!validation.success) {
    throw new Error(
      `Invalid breakpoints definition. Failed with errors: \n${JSON.stringify(validation.errors, null, 2)}`,
    );
  }
};

export const resetComponentRegistry = () => {
  breakpointsRegistry = [];
};
