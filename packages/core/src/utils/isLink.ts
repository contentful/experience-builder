import { Asset, Entry, UnresolvedLink } from 'contentful';

export const isLink = (
  maybeLink: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset | string | unknown
): maybeLink is UnresolvedLink<'Entry' | 'Asset'> => {
  if (maybeLink === null) return false;
  if (typeof maybeLink !== 'object') return false;

  const link = maybeLink as {
    sys?: {
      id?: string;
      type?: string;
    };
  };

  return Boolean(link.sys?.id) && link.sys?.type === 'Link';
};
