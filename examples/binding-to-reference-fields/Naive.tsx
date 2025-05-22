import React from 'react';
import styles from './styles.module.css';

type Item = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
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
        <StudioItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const StudioItem: React.FC<StudioItemProps> = ({ item }) => {
  return (
    <div className={styles.studioItem}>
      <img src={item.imageUrl} alt={item.title} className={styles.image} />
      <div className={styles.content}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <button className={styles.button}>Explore</button>
      </div>
    </div>
  );
};
