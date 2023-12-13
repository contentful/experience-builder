import { Link } from '@contentful/experience-builder-types';

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
