import type { Link } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isLinkToAsset = (variable: any): variable is Link<'Asset'> => {
  if (!variable) return false;
  if (typeof variable !== 'object') return false;

  return (
    variable.sys?.linkType === 'Asset' &&
    typeof variable.sys?.id === 'string' &&
    !!variable.sys?.id &&
    variable.sys?.type === 'Link'
  );
};
