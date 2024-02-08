import { Asset, Entry, UnresolvedLink } from 'contentful';

export const isLink = (
  entity: UnresolvedLink<'Entry' | 'Asset'> | Entry | Asset
): entity is UnresolvedLink<'Entry' | 'Asset'> => entity?.sys?.type === 'Link';
