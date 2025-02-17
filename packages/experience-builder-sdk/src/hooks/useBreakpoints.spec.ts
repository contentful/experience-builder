import { Breakpoint } from '@contentful/experiences-core/types';
import { useBreakpoints } from './useBreakpoints';
import { renderHook } from '@testing-library/react';
import { mediaQueryMatcher as mockMediaQueryMatcher } from '@contentful/experiences-core';

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

jest.mock('@contentful/experiences-core', () => {
  const actualModule = jest.requireActual('@contentful/experiences-core');

  return {
    ...actualModule,
    mediaQueryMatcher: jest.fn(),
  };
});

describe('useBreakpoints', () => {
  let addEventListenerMock: jest.Mock;
  let removeEventListenerMock: jest.Mock;

  beforeEach(() => {
    addEventListenerMock = jest.fn();
    removeEventListenerMock = jest.fn();

    // Mock media query matchers
    (mockMediaQueryMatcher as jest.Mock).mockReturnValue([
      [
        {
          id: 'tablet',
          signal: {
            matches: false,
            addEventListener: addEventListenerMock,
            removeEventListener: removeEventListenerMock,
          },
        },
        {
          id: 'mobile',
          signal: {
            matches: false,
            addEventListener: addEventListenerMock,
            removeEventListener: removeEventListenerMock,
          },
        },
      ],
      { tablet: false, mobile: false }, // Initial media query matches
    ]);
  });

  it('should initialize media query matches correctly', () => {
    const { result } = renderHook(() => useBreakpoints(breakpoints));

    expect(result.current.resolveDesignValue).toBeDefined();
    expect(addEventListenerMock).toHaveBeenCalledTimes(2);
  });

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useBreakpoints(breakpoints));

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledTimes(2);
  });

  it('should return resolved design value', () => {
    const { result } = renderHook(() => useBreakpoints(breakpoints));

    const resolvedValue = result.current.resolveDesignValue(
      { desktop: 'value1', tablet: 'value2', mobile: 'value3' },
      'someVariable',
    );

    expect(resolvedValue).toBe('value1');
  });

  describe('when we have a mobile breakpoint', () => {
    beforeEach(() => {
      (mockMediaQueryMatcher as jest.Mock).mockReturnValue([
        [
          {
            id: 'tablet',
            signal: {
              matches: true,
              addEventListener: addEventListenerMock,
              removeEventListener: removeEventListenerMock,
            },
          },
          {
            id: 'mobile',
            signal: {
              matches: true,
              addEventListener: addEventListenerMock,
              removeEventListener: removeEventListenerMock,
            },
          },
        ],
        { tablet: true, mobile: true }, // Initial media query matches
      ]);
    });

    it('update mediaQueryMatches correctly on rerender', () => {
      const emptyBreakpoints: Breakpoint[] = [];
      const { result, rerender } = renderHook(
        (breakpoints: Breakpoint[]) => useBreakpoints(breakpoints),
        { initialProps: emptyBreakpoints },
      );

      expect(result.current.resolveDesignValue).toBeDefined();

      expect(
        result.current.resolveDesignValue(
          { desktop: 'value1', tablet: 'value2', mobile: 'value3' },
          'someVariable',
        ),
      ).toBe(undefined);

      rerender(breakpoints);

      expect(
        result.current.resolveDesignValue(
          { desktop: 'value1', tablet: 'value2', mobile: 'value3' },
          'someVariable',
        ),
      ).toBe('value3');
    });
  });
});
