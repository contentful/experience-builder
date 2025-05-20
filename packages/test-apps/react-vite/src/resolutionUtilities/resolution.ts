import type { Entry, Asset, UnresolvedLink } from 'contentful';
import { inMemoryEntities } from '@contentful/experiences-sdk-react';
import { isLink, isArrayOfLinks, isAsset, isEntry } from './typeGuards';
// TODO: maybe we can return some kind of calculation, as to - how many links failed to resolve?
export const resolveEntityReferences = (
  entity: Entry | Asset | undefined,
): Entry | Asset | undefined => {
  if (entity === undefined) {
    return undefined;
  }
  if (isAsset(entity)) {
    return structuredClone(entity);
  }
  if (isEntry(entity)) {
    const e = structuredClone(entity) as Entry;
    for (const [fname, value] of Object.entries(e.fields)) {
      // @ts-expect-error casting unkonwn
      e.fields[fname] = resolveLinkOrArrayOrPassthrough(value); // default behaviour when link is not resolved is to return undefined
    }
    return e;
  }

  // everything else just pass through, but copy
  return structuredClone(entity);
};

export const resolveLinkOrArrayOrPassthrough = (
  fieldValue: unknown | UnresolvedLink<'Asset'> | UnresolvedLink<'Entry'>,
) => {
  if (isLink(fieldValue)) {
    return inMemoryEntities.maybeResolveLink(
      fieldValue as unknown as UnresolvedLink<'Asset'> | UnresolvedLink<'Entry'>,
    );
  }

  if (isArrayOfLinks(fieldValue)) {
    return fieldValue.map((link) => inMemoryEntities.maybeResolveLink(link));
  }

  // we just pass through the value
  return fieldValue;
};
