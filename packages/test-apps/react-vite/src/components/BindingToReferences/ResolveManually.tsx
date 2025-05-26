/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { Asset, Entry, UnresolvedLink } from 'contentful';
import { type ComponentDefinition, inMemoryEntities } from '@contentful/experiences-sdk-react';
import { isLink, isAsset, isEntry, isArrayOfLinks } from '@contentful/experiences-core';
import { stringifyCompact } from '../../utils/debugging';

type Item = Entry | Asset;

type ResolveManuallyProps = {
  items?: Item[];
  singleItem?: Item;
};

export const ResolveManuallyComponentDefinition: ComponentDefinition = {
  id: 'bind-example-resolve-manually',
  name: 'Resolve Manually',
  category: 'Bind to References',
  builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth'],
  variables: {
    items: {
      type: 'Array',
      displayName: 'Items',
    },
    singleItem: {
      type: 'Link',
      displayName: 'Single Item',
    },
  },
};

export const ResolveManuallyComponent: React.FC<ResolveManuallyProps> = (
  props: ResolveManuallyProps,
) => {
  const { items: shallowItems, singleItem: shallowSingleItem } = props;

  // could be undefined when:
  //  - user didn't bind
  //  - bound to empty reference
  //  - bound to reference to archived entity
  //  - bound to array which only contains references to archived entities
  const items = (shallowItems || []).map((shallowItem) =>
    resolveEntityLinks(shallowItem || undefined),
  );
  const singleItem = shallowSingleItem ? resolveEntityLinks(shallowSingleItem) : undefined;
  return (
    <div>
      <h2>Collection of items</h2>
      <div>
        <pre style={{ fontSize: '9px' }}>{stringifyCompact(items)}</pre>
      </div>
      <h2>Single item</h2>
      <div>
        <pre style={{ fontSize: '9px' }}>{stringifyCompact(singleItem)}</pre>
      </div>
    </div>
  );
};

export default ResolveManuallyComponent;

export const resolveEntityLinks = (
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
