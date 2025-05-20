import React from 'react';
import type { Asset } from 'contentful';

type Item = {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    image: Asset;
  };
};

type StudioItemProps = {
  item: Item;
};

type StudioCollectionProps = {
  items: Item[];
};

const StudioItem: React.FC<StudioItemProps> = ({ item }) => {
  return (
    <div className="studio-item" style={studioItemStyle}>
      <img
        src={item.fields.image?.fields?.file?.url as string}
        alt={item.fields.title}
        style={imageStyle}
      />
      <div style={contentStyle}>
        <h3>{item.fields.title}</h3>
        <p>{item.fields.description}</p>
        <button style={buttonStyle}>Explore</button>
      </div>
    </div>
  );
};

const StudioCollection: React.FC<StudioCollectionProps> = ({ items }) => {
  if (items === undefined) {
    return <div className="studio-collection-empty">No items available</div>;
  }
  return (
    <div className="studio-collection" style={studioCollectionStyle}>
      {items.map((item) => (
        <StudioItem key={item.sys.id} item={item} />
      ))}
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
