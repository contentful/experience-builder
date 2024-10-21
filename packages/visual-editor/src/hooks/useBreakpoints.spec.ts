import { getValueForBreakpoint } from '@contentful/experiences-core';
import { describe, it, expect } from 'vitest';
import { createBreakpoints } from '@/__fixtures__/breakpoints';

const breakpoints = createBreakpoints();
const [desktop, tablet, mobile] = [breakpoints[0], breakpoints[1], breakpoints[2]];

describe('useBreakpoints', () => {
  describe('getValueForBreakpoint', () => {
    it('returns the value for the current breakpoint', () => {
      const valuesByBreakpoint = {
        [desktop.id]: 'red',
        [tablet.id]: 'blue',
        [mobile.id]: 'green',
      };
      const value = getValueForBreakpoint(valuesByBreakpoint, breakpoints, 1, 'cfColor');
      expect(value).toBe('blue');
    });

    it('falls back to the default breakpoint value', () => {
      const valuesByBreakpoint = {
        [desktop.id]: 'red',
        [tablet.id]: 'blue',
        [mobile.id]: 'green',
      };
      const value = getValueForBreakpoint(valuesByBreakpoint, breakpoints, -1, 'cfColor');
      expect(value).toBe('red');
    });

    it('cascades through the breakpoint values', () => {
      const valuesByBreakpoint = {
        [desktop.id]: 'red',
        [tablet.id]: 'blue',
      };
      // We ask for the mobile value but it's not defined.
      // Thus, we expect to get the tablet value.
      const value = getValueForBreakpoint(valuesByBreakpoint, breakpoints, 2, 'cfColor');
      expect(value).toBe('blue');
    });
  });
});
