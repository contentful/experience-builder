import React from 'react';
import type { Asset, Entry } from 'contentful';
import { type ComponentDefinition } from '@contentful/experiences-sdk-react';
import { stringifyCompact } from '../../utils/debugging';
import { copyAndResolveEntityToLevel3 } from '../../resolutionUtilities';

type Item = Entry | Asset;

type ResolveManuallyProps = {
  items?: (Item | null)[]; // TODO: in theory this could be arrays of nulls (as currently items not in entity store eg. archived will not be resolved).
  singleItem?: Item | null; // TODO: could this be null? eg. when binding link points to a archived entry?
};

// eslint-disable-next-line react-refresh/only-export-components
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

  // could be undefined...
  const items = (shallowItems || []).map((shallowItem) =>
    copyAndResolveEntityToLevel3(shallowItem || undefined),
  ); // forcing null to undefined
  const singleItem = shallowSingleItem
    ? copyAndResolveEntityToLevel3(shallowSingleItem)
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
