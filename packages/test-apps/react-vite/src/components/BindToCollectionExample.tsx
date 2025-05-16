import React from 'react';
import type { Asset, Entry } from 'contentful';
import { type ComponentDefinition } from '@contentful/experiences-sdk-react';
import { stringifyCompact } from '../utils/debugging';

// In SDK pre v2 SDK, for Array and Link type variables, they will be automatically resolved to L3.
// In Preview+Delivery mode this works as expected.
// In EDITOR mode this works only with the new PR https://github.com/contentful/user_interface/pull/26604
// without this PR you will see that in EDITOR mode L3 is not resolved (but L2 is).
type Item = Entry | Asset;

type BindToCollectionExampleComponentProps = {
  items: Item[];
  singleItem: Item;
};

// eslint-disable-next-line react-refresh/only-export-components
export const BindToCollectionExampleComponentDefinition: ComponentDefinition = {
  id: 'collection-example-component',
  name: 'Collection Example',
  category: 'Examples',
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

export const BindToCollectionExampleComponent: React.FC<BindToCollectionExampleComponentProps> = (
  props: BindToCollectionExampleComponentProps,
) => {
  return (
    <div>
      <h2>Collection of items</h2>
      <div>
        <pre style={{ fontSize: '9px' }}>{stringifyCompact(props.items)}</pre>
      </div>
      <h2>Single item</h2>
      <div>
        <pre style={{ fontSize: '9px' }}>{stringifyCompact(props.singleItem)}</pre>
      </div>
    </div>
  );
};

export default BindToCollectionExampleComponent;
