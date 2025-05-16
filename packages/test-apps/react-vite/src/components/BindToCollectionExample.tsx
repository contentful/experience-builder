import React from 'react';
import { Entry } from 'contentful';
import { type ComponentDefinition } from '@contentful/experiences-sdk-react';

// In SDK pre v2 SDK, for Array and Link type variables, they will be automatically resolved to L3.
// In Preview+Delivery mode this works as expected.
// In EDITOR mode this works only with the new PR https://github.com/contentful/user_interface/pull/26604
// without this PR you will see that in EDITOR mode L3 is not resolved (but L2 is).
type EntryResolvedToLevel3 = Entry;

type BindToCollectionExampleComponentProps = {
  items: EntryResolvedToLevel3[];
  singleItem: EntryResolvedToLevel3;
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

const stringifyCompact = (obj: unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const omitSysAndMetadataToRemoveNoise = (key: string, value: any) => {
    if (key === 'sys' && (value as { type?: string })?.type === 'Link') {
      // return value;
      return `➡️${value.linkType?.toLowerCase()}://${value.id}`;
    }
    if (key === 'sys' || key === 'metadata') {
      return undefined;
    }
    return value;
  };

  if (typeof obj === 'string') {
    return obj;
  }
  if (undefined === obj) {
    return 'undefined';
  }
  if (obj === null) {
    return 'null';
  }
  return JSON.stringify(obj, omitSysAndMetadataToRemoveNoise, 2);
};

export const BindToCollectionExampleComponent: React.FC<BindToCollectionExampleComponentProps> = (
  props: BindToCollectionExampleComponentProps,
) => {
  return (
    <div>
      <h2>
        Collection of items <small>(omitting `sys` and `metadata` fields)</small>
      </h2>
      <div>
        <pre style={{ fontSize: '9px' }}>{stringifyCompact(props.items)}</pre>
      </div>
      <h2>
        Single item <small>(omitting `sys` and `metadata` fields)</small>
      </h2>
      <div>
        <pre style={{ fontSize: '9px' }}>{stringifyCompact(props.singleItem)}</pre>
      </div>
    </div>
  );
};

export default BindToCollectionExampleComponent;
