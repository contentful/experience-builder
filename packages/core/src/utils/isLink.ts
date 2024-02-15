import { Asset, Entry, UnresolvedLink } from 'contentful';

export const isLink = (
  entity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset | string
): entity is UnresolvedLink<'Entry' | 'Asset'> => {
  if (typeof entity === 'string') {
    return false;
  }
  return entity?.sys?.type === 'Link';
};
