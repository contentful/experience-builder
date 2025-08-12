import { describe, it, expect } from 'vitest';
import { validateBreakpointsDefinition } from '../validateBreakpointDefinitions';

describe(validateBreakpointsDefinition, () => {
  it('should validate that first breakpoint has a wild card query', () => {
    const breakpoints = [
      {
        id: 'test-desktop',
        query: '<1000px',
        displayName: 'All Sizes',
        previewSize: '100%',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe(
      'The first breakpoint should include the following attributes: { "query": "*" }',
    );
  });

  it('should validate that breakpoints have unique ids', () => {
    const breakpoints = [
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
        id: 'test-tablet',
        query: '<800px',
        displayName: 'Tablet',
        previewSize: '820px',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe('Breakpoint IDs must be unique');
  });

  it('should validate that fields in breakpoint object', () => {
    const breakpoints = [
      {
        id: 'test-desktop',
        query: '*',
        displayName: 'All Sizes',
        previewSize: '100%',
        displayIcon: 'desktop',
      },
      {
        id: 'test-tablet',
        query: '<982px',
        displayName: 'Tablet',
        previewSize: '820px',
        displayIcon: 'tablet',
        wrongFieldAdded: 'test',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe('The property "wrongFieldAdded" is not expected');
  });

  it('only allows the first breakpoint to use a wildcard query', () => {
    const breakpoints = [
      {
        id: 'test-mobile',
        query: '*',
        displayName: 'Mobile',
        previewSize: '375px',
      },
      {
        id: 'test-tablet',
        query: '*',
        displayName: 'Tablet',
        previewSize: '820px',
      },
    ];
    const result = validateBreakpointsDefinition(breakpoints);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    const error = result.errors?.[0];

    expect(error?.details).toBe(
      "You may only use a mobile-first or desktop-first strategy for breakpoints using '<' or '>' queries",
    );
  });

  describe('when using a mobile-first strategy', () => {
    const mobileBreakpoint = {
      id: 'test-mobile',
      query: '*',
      displayName: 'Mobile',
      previewSize: '375px',
    };

    const tabletBreakpoint = {
      id: 'test-tablet',
      query: '>768px',
      displayName: 'Tablet',
      previewSize: '820px',
    };

    const desktopBreakpoint = {
      id: 'test-desktop',
      query: '>1024px',
      displayName: 'Desktop',
      previewSize: '1280px',
    };

    it('should accept that all breakpoints have a ">" query after the first one', () => {
      const breakpoints = [mobileBreakpoint, tabletBreakpoint, desktopBreakpoint];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(true);
    });

    it('should deny breakpoints with "<" query', () => {
      const breakpoints = [
        mobileBreakpoint,
        tabletBreakpoint,
        { ...desktopBreakpoint, query: '<1024px' },
      ];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      const error = result.errors?.[0];

      expect(error?.details).toBe(
        'Breakpoint queries must be in the format ">[size]px" for mobile-first strategy',
      );
    });

    it('only allows the first breakpoint to use a wildcard query', () => {
      const breakpoints = [
        mobileBreakpoint,
        tabletBreakpoint,
        { ...desktopBreakpoint, query: '*' },
      ];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      const error = result.errors?.[0];

      expect(error?.details).toBe(
        'Breakpoint queries must be in the format ">[size]px" for mobile-first strategy',
      );
    });

    it('should deny breakpoint queries not being ordered from smallest to largest', () => {
      const breakpoints = [mobileBreakpoint, desktopBreakpoint, tabletBreakpoint];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      const error = result.errors?.[0];

      expect(error?.details).toBe(
        'When using a mobile-first strategy, all breakpoints must have strictly increasing pixel values',
      );
    });
  });

  describe('when using a desktop-first strategy', () => {
    const desktopBreakpoint = {
      id: 'test-desktop',
      query: '*',
      displayName: 'Desktop',
      previewSize: '1280px',
    };

    const tabletBreakpoint = {
      id: 'test-tablet',
      query: '<1024px',
      displayName: 'Tablet',
      previewSize: '820px',
    };

    const mobileBreakpoint = {
      id: 'test-mobile',
      query: '<768px',
      displayName: 'Mobile',
      previewSize: '375px',
    };

    it('should accept that all breakpoints have a "<" query after the first one', () => {
      const breakpoints = [desktopBreakpoint, tabletBreakpoint, mobileBreakpoint];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(true);
    });

    it('should deny breakpoints with ">" query', () => {
      const breakpoints = [
        desktopBreakpoint,
        tabletBreakpoint,
        { ...mobileBreakpoint, query: '>1024px' },
      ];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      const error = result.errors?.[0];

      expect(error?.details).toBe(
        'Breakpoint queries must be in the format "<[size]px" for desktop-first strategy',
      );
    });

    it('only allows the first breakpoint to use a wildcard query', () => {
      const breakpoints = [
        desktopBreakpoint,
        tabletBreakpoint,
        { ...mobileBreakpoint, query: '*' },
      ];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      const error = result.errors?.[0];

      expect(error?.details).toBe(
        'Breakpoint queries must be in the format "<[size]px" for desktop-first strategy',
      );
    });

    it('should deny breakpoint queries not being ordered from largest to smallest', () => {
      const breakpoints = [desktopBreakpoint, mobileBreakpoint, tabletBreakpoint];
      const result = validateBreakpointsDefinition(breakpoints);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      const error = result.errors?.[0];

      expect(error?.details).toBe(
        'When using a desktop-first strategy, all breakpoints must have strictly decreasing pixel values',
      );
    });
  });
});
