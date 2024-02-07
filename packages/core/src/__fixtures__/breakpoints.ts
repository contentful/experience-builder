import { Breakpoint } from '@/types';

export const createBreakpoints = (): Breakpoint[] => [
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
