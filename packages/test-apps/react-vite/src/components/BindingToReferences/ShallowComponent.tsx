import React from 'react';
import type { Asset, Entry } from 'contentful';
import { type ComponentDefinition } from '@contentful/experiences-sdk-react';
import { stringifyCompact } from '../../utils/debugging';

// In SDK pre v2 SDK, for Array and Link type variables, they will be automatically resolved to L3.
type Item = Entry | Asset;

type ShallowComponentProps = {
  items: Item[];
  singleItem: Item;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ShallowComponentDefinition: ComponentDefinition = {
  id: 'bind-example-shallow-component',
  name: 'Shallow Component',
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

export const ShallowComponent: React.FC<ShallowComponentProps> = (props: ShallowComponentProps) => {
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

export default ShallowComponent;
