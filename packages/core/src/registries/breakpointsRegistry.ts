import { Breakpoint, validateBreakpointsDefinition } from '@contentful/experiences-validators';

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
  if (!breakpointsRegistry.length) return;

  const validation = validateBreakpointsDefinition(breakpointsRegistry);
  if (!validation.success) {
    throw new Error(
      `Invalid breakpoints definition. Failed with errors: \n${JSON.stringify(validation.errors, null, 2)}`,
    );
  }
};

// Used in the tests to get a breakpoint registration
export const getBreakpointRegistration = (id: string) =>
  breakpointsRegistry.find((breakpoint) => breakpoint.id === id);

// Used in the tests to reset the registry
export const resetBreakpointsRegistry = () => {
  breakpointsRegistry = [];
};
