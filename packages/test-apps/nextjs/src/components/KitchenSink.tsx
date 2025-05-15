import React from 'react';
import { UnresolvedLink } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { RichText } from '@contentful/experiences-components-react';

interface KitchenSinkProps {
  jsonObject?: object;
  booleanValue?: boolean;
  listText?: string[];
  entryReference?: UnresolvedLink<'Entry'>;
  imageReference?: UnresolvedLink<'Asset'>;
  imageListReference?: UnresolvedLink<'Asset'>[];
  listReference?: UnresolvedLink<'Entry'>[];
  text?: string;
  date?: string;
  location?: string;
  media?: string;
  hyperlink?: string;
  richText?: Document;
}

const KitchenSink: React.FC<KitchenSinkProps> = ({
  booleanValue,
  entryReference,
  imageReference,
  jsonObject,
  listText,
  listReference,
  text,
  date,
  location,
  media,
  hyperlink,
  richText,
  ...props
}) => {
  return (
    <div {...props}>
      <h1>Kitchen Sink</h1>

      {text && (
        <div>
          <h3>Text</h3>
          <div>{text}</div>
          <hr />
        </div>
      )}

      {date && (
        <div>
          <h3>Date</h3>
          <h4>type: {typeof date}</h4>
          <div>{date}</div>
          <hr />
        </div>
      )}

      {location && (
        <div>
          <h3>Location</h3>
          <h4>type: {typeof location}</h4>
          <div>{JSON.stringify(location, null, 2)}</div>
          <hr />
        </div>
      )}

      {richText && (
        <div>
          <h3>Rich Text</h3>
          <h4>type: {typeof richText}</h4>
          <pre>{JSON.stringify(richText, null, 2)}</pre>
          <div>
            <RichText value={richText} />
          </div>
          <hr />
        </div>
      )}

      {hyperlink && (
        <div>
          <h3>Hyperlink</h3>
          <h4>type: {typeof hyperlink}</h4>
          <div>{hyperlink}</div>
          <hr />
        </div>
      )}

      {media && (
        <div>
          <h3>Media</h3>
          <h4>type: {typeof media}</h4>
          <div>{JSON.stringify(media, null, 2)}</div>
          <hr />
        </div>
      )}

      <div>
        <h3>Boolean</h3>
        <div>
          {typeof booleanValue === 'undefined' ? 'undefined' : JSON.stringify(booleanValue)}
          <aside>Currently if the value is &apos;false&apos;, it comes in as undefined</aside>
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
