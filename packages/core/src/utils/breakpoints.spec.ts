import { createBreakpoints } from '@/__fixtures__/breakpoints';
import { getActiveBreakpointIndex, getValueForBreakpoint, mediaQueryMatcher } from './breakpoints';
import { describe, it, expect } from 'vitest';

describe('getValueForBreakpoint', () => {
  const breakpoints = createBreakpoints();
  const variableName = 'cfBackgroundColor';
  const [desktopIndex, tabletIndex, mobileIndex] = [0, 1, 2];
  const [desktopValue, tabletValue, mobileValue] = ['red', 'orange', 'green'];
  const valuesByBreakpoint = {
    desktop: desktopValue,
    tablet: tabletValue,
    mobile: mobileValue,
  };
  const valuesByBreakpointWithoutMobile = {
    desktop: desktopValue,
    tablet: tabletValue,
  };
  const valuesByBreakpointWithoutTabletAndMobile = {
    desktop: desktopValue,
  };

  describe('when rendering a desktop view', () => {
    it('renders the desktop-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpoint,
        breakpoints,
        desktopIndex,
        variableName,
      );
      expect(value).toEqual(desktopValue);
    });
  });

  describe('when rendering a tablet view', () => {
    it('renders the tablet-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpoint,
        breakpoints,
        tabletIndex,
        variableName,
      );
      expect(value).toEqual(tabletValue);
    });
    it('falls back to the desktop-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpointWithoutTabletAndMobile,
        breakpoints,
        tabletIndex,
        variableName,
      );
      expect(value).toEqual(desktopValue);
    });
  });

  describe('when rendering a mobile view', () => {
    it('renders the mobile-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpoint,
        breakpoints,
        mobileIndex,
        variableName,
      );
      expect(value).toEqual(mobileValue);
    });
    it('falls back to the tablet-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpointWithoutMobile,
        breakpoints,
        mobileIndex,
        variableName,
      );
      expect(value).toEqual(tabletValue);
    });
    it('falls back to the desktop-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpointWithoutTabletAndMobile,
        breakpoints,
        mobileIndex,
        variableName,
      );
      expect(value).toEqual(desktopValue);
    });
  });

  describe('when rendering a view without a matching breakpoint', () => {
    it('falls back to the desktop-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpointWithoutTabletAndMobile,
        breakpoints,
        3,
        variableName,
      );
      expect(value).toEqual(desktopValue);
    });
  });
});

describe('getActiveBreakpointIndex', () => {
  const breakpoints = createBreakpoints();
  const mediaQueryMatches = {
    desktop: false,
    tablet: true,
    mobile: false,
  };
  const fallbackBreakpointIndex = 0;

  it('returns the index of the active breakpoint', () => {
    const activeBreakpointIndex = getActiveBreakpointIndex(
      breakpoints,
      mediaQueryMatches,
      fallbackBreakpointIndex,
    );
    expect(activeBreakpointIndex).toEqual(1);
  });

  it('returns the fallback breakpoint index if no breakpoint is active', () => {
    const activeBreakpointIndex = getActiveBreakpointIndex(
      breakpoints,
      { desktop: false, tablet: false, mobile: false },
      fallbackBreakpointIndex,
    );
    expect(activeBreakpointIndex).toEqual(fallbackBreakpointIndex);
  });
});

describe('mediaQueryMatcher', () => {
  const breakpoints = createBreakpoints();

  it('should match the media query', () => {
    const [matchers, initialMatches] = mediaQueryMatcher(breakpoints);

    expect(matchers[0].signal.matches).toBe(false);
    expect(matchers[1].signal.matches).toBe(false);
    expect(initialMatches).toEqual({ tablet: false, mobile: false });
  });
});
