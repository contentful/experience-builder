import React from 'react';
import { UnresolvedLink } from 'contentful';

interface CustomJsonObjectProps {
  jsonObject?: object;
  booleanValue?: boolean;
  listText?: string[];
  entryReference?: UnresolvedLink<'Entry'>;
  imageReference?: UnresolvedLink<'Entry'>;
  listReference?: UnresolvedLink<'Entry'>[];
  text?: string;
}

const KitchenSink: React.FC<CustomJsonObjectProps> = ({
  booleanValue,
  entryReference,
  imageReference,
  jsonObject,
  listText,
  listReference,
  text,
}) => {
  return (
    <div>
      <h1>Kitchen Sink</h1>

      {text && (
        <div>
          <h3>Text</h3>
          <div>{text}</div>
          <hr />
        </div>
      )}

      <div>
        <h3>Boolean</h3>
        <div>
          {typeof booleanValue === 'undefined' ? 'undefined' : JSON.stringify(booleanValue)}
          <aside>Currently if the value is 'false', it comes in as undefined</aside>
        </div>
        <hr />
      </div>

      {jsonObject && (
        <div>
          <h3>Json Object</h3>
          <pre>{JSON.stringify(jsonObject, undefined, 2)}</pre>
          <hr />
        </div>
      )}

      {listText && (
        <div>
          <h3>List Text</h3>
          <ul>
            {listText.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
          <hr />
        </div>
      )}
      {entryReference && (
        <div>
          <h3>Entry Reference</h3>
          <pre>{JSON.stringify(entryReference, undefined, 2)}</pre>
          <hr />
        </div>
      )}
      {imageReference && (
        <div>
          <h3>Image Reference</h3>
          <pre>{JSON.stringify(imageReference, undefined, 2)}</pre>
          <hr />
        </div>
      )}
      {listReference && (
        <div>
          <h3>List Entry Reference</h3>
          <ul>
            {listReference.map((entry, index) => (
              <li key={index}>
                <pre>{JSON.stringify(entry, undefined, 2)}</pre>
              </li>
            ))}
          </ul>
          <hr />
        </div>
      )}
    </div>
  );
};

export default KitchenSink;
