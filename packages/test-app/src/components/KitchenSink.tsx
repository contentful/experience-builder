import React from 'react';

interface CustomJsonObjectProps {
  jsonObject?: object;
  booleanValue?: boolean;
  listText?: string[];
}

const KitchenSink: React.FC<CustomJsonObjectProps> = ({ booleanValue, jsonObject, listText }) => {
  return (
    <div>
      <h1>Kitchen Sink</h1>

      <div>
        <h3>Boolean</h3>
        <div>
          {typeof booleanValue === 'undefined' ? 'undefined' : JSON.stringify(booleanValue)}
          <aside>Currently if the value is 'false', it comes in as undefined</aside>
        </div>
      </div>

      {jsonObject && (
        <div>
          <h3>Json Object</h3>
          <pre>{JSON.stringify(jsonObject, undefined, 2)}</pre>
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
        </div>
      )}
    </div>
  );
};

export default KitchenSink;
