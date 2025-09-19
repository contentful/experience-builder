import { Breakpoint, validateBreakpointsDefinition } from '@contentful/experiences-validators';

export const breakpointsRegistry: Breakpoint[] = [];

/**
 * Define custom breakpoints that should be used for all your experiences.
 * A breakpoint consists of:
 * - id: a unique identifier for this breakpoint
 * - query: a media query string that defines when this breakpoint is active
 * - previewSize: an optional fixed preview size to be used in the Studio editor when selecting this breakpoint
 * - displayName: the name to be displayed in the Studio editor for this breakpoint
 * - displayIcon: an optional icon to be displayed in the Studio editor for this breakpoint
 *
 * The first breakpoint must use a wildcard query (`*`) to match all sizes.
 *
 * Every subsequent breakpoint inherits the designs of the previous ones by default.
 *
 * The order of breakpoints must be either:
 * - desktop first: from largest to smallest, using `<` operators
 * - mobile first: from smallest to largest, using `>` operators
 *
 * @note changing breakpoints after you have created experiences may break those experiences
 * @example
 * defineBreakpoints([{
 *    id: 'desktop',
 *    query: '*',
 *    displayName: 'Desktop',
 *    displayIcon: 'desktop',
 * }, {
 *    id: 'tablet',
 *    query: '<992px',
 *    displayName: 'Tablet',
 *    displayIcon: 'tablet',
 * }, {
 *    id: 'mobile',
 *    query: '<576px',
 *    displayName: 'Mobile',
 *    displayIcon: 'mobile',
 * }]);
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
