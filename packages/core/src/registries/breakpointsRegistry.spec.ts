import * as registry from './breakpointsRegistry';
import { describe, afterEach, it, expect } from 'vitest';
describe('defineBreakpoints', () => {
  afterEach(() => {
    registry.resetBreakpointsRegistry();
  });

  it('should register breakpoints in breakpoint registry', () => {
    registry.defineBreakpoints([
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
      {
        id: 'test-mobile',
        query: '<576px',
        displayName: 'Mobile',
        previewSize: '390px',
      },
    ]);

    const breakpointRegistration = registry.getBreakpointRegistration('test-tablet');
    expect(breakpointRegistration).toBeDefined();
  });
});

describe('runBreakpointsValidation', () => {
  afterEach(() => {
    registry.resetBreakpointsRegistry();
  });
  it('throws an error if breakpoints definition is invalid', () => {
    registry.defineBreakpoints([
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
      {
        id: 'test-mobile',
        query: '<1000px',
        displayName: 'Mobile',
        previewSize: '390px',
      },
    ]);

    const errors = [
      {
        details: 'Breakpoints should be ordered from largest to smallest pixel value',
        name: 'custom',
        path: [],
      },
    ];
    const error = new Error(
      `Invalid breakpoints definition. Failed with errors: \n${JSON.stringify(errors, null, 2)}`,
    );
    expect(() => registry.runBreakpointsValidation()).toThrow(error);
  });

  it('does not throw an error if no breakpoint definition is invalid', () => {
    registry.defineBreakpoints([
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
      {
        id: 'test-mobile',
        query: '<576px',
        displayName: 'Mobile',
        previewSize: '390px',
      },
    ]);

    expect(() => registry.runBreakpointsValidation()).not.toThrow();
  });
});
