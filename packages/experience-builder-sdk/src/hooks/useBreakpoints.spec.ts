import type { Breakpoint } from '@contentful/experience-builder-core/types';
import { getValueForBreakpoint } from '@contentful/experience-builder-core';

const breakpoints: Breakpoint[] = [
  {
    id: 'desktop',
    query: '*',
    displayName: 'All sizes',
    previewSize: '993px',
  },
  {
    id: 'tablet',
    query: '<992px',
    displayName: 'Tablet',
    previewSize: '820px',
  },
  {
    id: 'mobile',
    query: '<576px',
    displayName: 'Mobile',
    previewSize: '390px',
  },
];

describe('useBreakpoints', () => {
  describe('getValueForBreakpoint', () => {
    it('returns the value for the current breakpoint', () => {
      const valuesByBreakpoint = {
        [breakpoints[0].id]: 'red',
        [breakpoints[1].id]: 'blue',
        [breakpoints[2].id]: 'green',
      };
      const value = getValueForBreakpoint(valuesByBreakpoint, breakpoints, 1);
      expect(value).toBe('blue');
    });

    it('falls back to the default breakpoint value', () => {
      const valuesByBreakpoint = {
        [breakpoints[0].id]: 'red',
        [breakpoints[1].id]: 'blue',
        [breakpoints[2].id]: 'green',
      };
      const value = getValueForBreakpoint(valuesByBreakpoint, breakpoints, -1);
      expect(value).toBe('red');
    });

    it('cascades through the breakpoint values', () => {
      const valuesByBreakpoint = {
        [breakpoints[0].id]: 'red',
        [breakpoints[1].id]: 'blue',
      };
      // We ask for the mobile value but it's not defined.
      // Thus, we expect to get the tablet value.
      const value = getValueForBreakpoint(valuesByBreakpoint, breakpoints, 2);
      expect(value).toBe('blue');
    });
  });
});
