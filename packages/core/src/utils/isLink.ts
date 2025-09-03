import { Asset, Entry, UnresolvedLink } from 'contentful';

export function isLink(
  maybeLink: UnresolvedLink<'Entry'> | Entry | undefined,
): maybeLink is UnresolvedLink<'Entry'>;
export function isLink(
  maybeLink: UnresolvedLink<'Asset'> | Asset | undefined,
): maybeLink is UnresolvedLink<'Asset'>;
export function isLink(maybeLink: unknown): maybeLink is UnresolvedLink<'Entry' | 'Asset'>;
export function isLink(maybeLink: unknown): maybeLink is UnresolvedLink<'Entry' | 'Asset'> {
  if (maybeLink === null) return false;
  if (typeof maybeLink !== 'object') return false;

  const link = maybeLink as {
    sys?: {
      id?: string;
      type?: string;
      linkType?: string;
    };
  };

  return Boolean(link.sys?.id) && link.sys?.type === 'Link' && Boolean(link.sys?.linkType);
}
