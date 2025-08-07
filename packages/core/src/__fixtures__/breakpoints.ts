import { Breakpoint } from '@/types';

export const createBreakpoints = (
  strategy: 'desktop-first' | 'mobile-first' = 'desktop-first',
): Breakpoint[] => {
  if (strategy === 'desktop-first') {
    return createDesktopFirstBreakpoints();
  }
  return createMobileFirstBreakpoints();
};

export const createDesktopFirstBreakpoints = (): Breakpoint[] => [
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

export const createMobileFirstBreakpoints = (): Breakpoint[] => [
  {
    id: 'mobile',
    query: '*',
    displayName: 'All sizes',
    previewSize: '390px',
  },
  {
    id: 'tablet',
    query: '>576px',
    displayName: 'Tablet',
    previewSize: '820px',
  },
  {
    id: 'desktop',
    query: '>992px',
    displayName: 'Desktop',
    previewSize: '993px',
  },
];
