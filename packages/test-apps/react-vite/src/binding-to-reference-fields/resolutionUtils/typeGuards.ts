import type { Asset, Entry, UnresolvedLink } from 'contentful';

export const isLink = (
  value: unknown,
): value is UnresolvedLink<'Asset'> | UnresolvedLink<'Entry'> => {
  return (
    null !== value &&
    typeof value === 'object' &&
    'sys' in value &&
    (value as UnresolvedLink<'Asset'> | UnresolvedLink<'Entry'>).sys?.type === 'Link'
  );
};

export const isEntry = (value: unknown): value is Entry => {
  return (
    null !== value &&
    typeof value === 'object' &&
    'sys' in value &&
    (value as Entry).sys?.type === 'Entry'
  );
};

export const isAsset = (value: unknown): value is Asset => {
  return (
    null !== value &&
    typeof value === 'object' &&
    'sys' in value &&
    (value as Asset).sys?.type === 'Asset'
  );
};

// TODO: how does it classify empty arrays?
export const isArrayOfLinks = (
  value: unknown,
): value is Array<UnresolvedLink<'Asset'> | UnresolvedLink<'Entry'>> => {
  return Array.isArray(value) && value.every((item) => isLink(item));
};
