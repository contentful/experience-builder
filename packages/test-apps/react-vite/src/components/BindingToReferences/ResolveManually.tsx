/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { Asset, Entry } from 'contentful';
import {
  type ComponentDefinition,
  inMemoryEntities,
  isAsset,
  isEntry,
  isArrayOfLinks,
  isLinkToAsset,
  isLinkToEntry,
} from '@contentful/experiences-sdk-react';
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
    resolveEntityLinksRecursively(shallowItem || undefined, 3),
  );
  const singleItem = shallowSingleItem
    ? resolveEntityLinksRecursively(shallowSingleItem, 3)
    : undefined;
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

/**
 * When
 *  depth = 0, we don't touch references, just clone the entity
 *  depth = 1, we touch references of the entity passed as argument, but don't touch next level
 *  depth = 2, we touch references of the entity passed as argument, AND also references of the referent
 * @param roEntity normally this would be readOnly entity, received via from inMemoryEntities.maybeResolveLink().
 *                 It's read-only because all objects received from inMemoryEntities.maybeResolveLink() are Object.freeze()'d
 * @param depth
 * @returns copy of the entity, with resolved refrences (which are also copied), meaning not frozen and can be mutated at will.
 */
function resolveEntityLinksRecursively(
  roEntity: Entry | Asset | undefined,
  depth: number,
): Entry | Asset | undefined {
  if (depth <= 0) {
    return structuredClone(roEntity);
  }
  if (roEntity === undefined) {
    return undefined;
  }
  if (isAsset(roEntity)) {
    return structuredClone(roEntity);
  }
  if (isEntry(roEntity)) {
    const e = structuredClone(roEntity);
    for (const [fname, value] of Object.entries(e.fields)) {
      if (isLinkToEntry(value)) {
        const roEntity = inMemoryEntities.maybeResolveLink(value);
        if (roEntity) {
          // you can skip check and overwrite unresolved links with undefined.
          const resolvedEntity = resolveEntityLinksRecursively(roEntity, depth - 1);
          e.fields[fname] = resolvedEntity;
        }
      } else if (isArrayOfLinks(value)) {
        const arrayOfRoEntities = value
          .map((link) => inMemoryEntities.maybeResolveLink(link))
          .filter(Boolean) as (Entry | Asset)[]; // filter out undefined values for links that are not in memory (not loaded or archived);
        const arrayOfResolvedEntities = arrayOfRoEntities.map((roEntity) => {
          return resolveEntityLinksRecursively(roEntity, depth - 1);
        });
        if (arrayOfResolvedEntities.length) {
          // you can skip check and overwrite array of links, even if none of them resolved successfully.
          e.fields[fname] = arrayOfResolvedEntities;
        }
      } else if (isLinkToAsset(value)) {
        const roAsset = inMemoryEntities.maybeResolveLink(value);
        if (roAsset) {
          // you can skip check and overwrite unresolved asset links with undefined
          e.fields[fname] = structuredClone(roAsset); // we just pass through the asset, no need to resolve further
        }
      } else {
        // NOOP, this else statement, is equivalent to keeping the value as is
        // e.fields[fname] = value;
      }
    }
    return e;
  }
  // Typescript thinks this is 'never' case, but we want failsafe fallback for runtime.
  return structuredClone(roEntity);
}
