import React, { useEffect } from 'react';
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
  const [messages, setMessages] = React.useState<string[]>([]);

  // @ts-expect-error development only
  window.myItems = window.myItems || [];
  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    return () => console.warn(';;Unmounting ShallowComponent');
  }, []);

  useEffect(() => {
    addMessage(`Props items: ${JSON.stringify(props.items)}`);
    // @ts-expect-error development only
    window.myItems.push(props.items);
    return () => {
      console.warn(
        ';;Change in props.items oldValue=',
        props.items?.map((item) => item.sys.id),
      );
    };
  }, [props.items]);

  return (
    <>
      <pre style={{ fontSize: '9px' }}>{messages.join('\n')}</pre>
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
    </>
  );
};

export default ShallowComponent;
