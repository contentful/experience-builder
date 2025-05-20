import React from 'react';
import { resolveEntityReferences, isAsset } from './resolutionUtils';
import type { Asset, Entry, EntrySkeletonType } from 'contentful';

type ItemFields = {
  title: string;
  description: string;
  image: Asset;
};

type ItemSkeleton = EntrySkeletonType<ItemFields, 'myContentTypeId'>;
type Item = Entry<ItemSkeleton>;

type StudioItemProps = {
  item: Item;
};

type StudioCollectionProps = {
  items: Item[];
};

const StudioCollection: React.FC<StudioCollectionProps> = ({ items }) => {
  if (items === undefined) {
    return <div className="studio-collection-empty">No items available</div>;
  }

  const itemsResolved: Array<Item> = items
    .map((item) => resolveEntityReferences(item))
    .filter(Boolean) as Array<Item>; // remove items which resolution (there should not be any)

  return (
    <div className="studio-collection" style={studioCollectionStyle}>
      {itemsResolved.map((resolvedItem) => (
        <StudioItem key={resolvedItem!.sys.id} item={resolvedItem} />
      ))}
    </div>
  );
};

const StudioItem: React.FC<StudioItemProps> = ({ item }) => {
  // some type juggling to make TypeScript happy
  const image = isAsset(item.fields.image)
    ? item.fields.image
    : createPlaceholderAsset({ url: 'https://via.placeholder.com/150' });
  const itemFields: ItemFields = item.fields as ItemFields;

  return (
    <div className="studio-item" style={studioItemStyle}>
      <img src={image?.fields?.file?.url as string} alt={itemFields.title} style={imageStyle} />
      <div style={contentStyle}>
        <h3>{itemFields.title}</h3>
        <p>{itemFields.description}</p>
        <button style={buttonStyle}>Explore</button>
      </div>
    </div>
  );
};

const studioItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #ccc',
  borderRadius: '8px',
  overflow: 'hidden',
  width: '200px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const imageStyle: React.CSSProperties = {
  height: '60%',
  objectFit: 'cover',
  width: '100%',
};

const contentStyle: React.CSSProperties = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const buttonStyle: React.CSSProperties = {
  marginTop: '8px',
  padding: '8px 16px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const studioCollectionStyle: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
};

export { StudioCollection, StudioItem };

function createPlaceholderAsset({ url }: { url: string }): Asset {
  return {
    sys: {
      id: 'placeholderId',
      type: 'Asset',
    },
    fields: {
      title: 'Placeholder Image',
      file: {
        url,
        details: {
          size: 123,
          image: {
            width: 123,
            height: 123,
          },
        },
        contentType: 'image/jpeg',
      },
    },
  } as unknown as Asset; // this is minimal set of fields to work with asset
}
