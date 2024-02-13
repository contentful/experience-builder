import { createBreakpoints } from '@/__fixtures__/breakpoints';
import { getValueForBreakpoint } from './breakpoints';
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
        variableName
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
        variableName
      );
      expect(value).toEqual(tabletValue);
    });
    it('falls back to the desktop-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpointWithoutTabletAndMobile,
        breakpoints,
        tabletIndex,
        variableName
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
        variableName
      );
      expect(value).toEqual(mobileValue);
    });
    it('falls back to the tablet-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpointWithoutMobile,
        breakpoints,
        mobileIndex,
        variableName
      );
      expect(value).toEqual(tabletValue);
    });
    it('falls back to the desktop-specific value', () => {
      const value = getValueForBreakpoint(
        valuesByBreakpointWithoutTabletAndMobile,
        breakpoints,
        mobileIndex,
        variableName
      );
      expect(value).toEqual(desktopValue);
    });
  });
});
