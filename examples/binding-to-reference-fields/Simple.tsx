import React from 'react';
import type { Asset } from 'contentful';
import styles from './styles.module.css';

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

export const StudioCollection: React.FC<StudioCollectionProps> = ({ items }) => {
  if (items === undefined) {
    return <div className={styles.studioCollectionEmpty}>No items available</div>;
  }
  return (
    <div className={styles.studioCollection}>
      {items.map((item) => (
        <StudioItem key={item.sys.id} item={item} />
      ))}
    </div>
  );
};

const StudioItem: React.FC<StudioItemProps> = ({ item }) => {
  return (
    <div className={styles.studioItem}>
      <img
        src={item.fields.image?.fields?.file?.url as string}
        alt={item.fields.title}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3>{item.fields.title}</h3>
        <p>{item.fields.description}</p>
        <button className={styles.button}>Explore</button>
      </div>
    </div>
  );
};
