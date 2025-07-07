import type { Link } from '@/types';

export const isLinkToEntry = (variable: unknown): variable is Link<'Entry'> => {
  if (variable === null || typeof variable !== 'object') return false;

  // The `'prop' in` pattern is informing TypeScript of the object shape, no need to cast `as`.
  if (!('sys' in variable)) return false;
  if (variable.sys === null || typeof variable.sys !== 'object') return false;

  if (!('linkType' in variable.sys)) return false;
  if (!('id' in variable.sys)) return false;
  if (!('type' in variable.sys)) return false;

  return (
    variable.sys?.linkType === 'Entry' &&
    typeof variable.sys?.id === 'string' &&
    !!variable.sys?.id &&
    variable.sys?.type === 'Link'
  );
};
