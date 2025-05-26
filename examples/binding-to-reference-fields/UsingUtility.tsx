// --- UsingUtility.tsx ---
import React from 'react';
import { resolveEntityReferences, isAsset } from './resolutionUtils';
import type { Asset, Entry, EntrySkeletonType } from 'contentful';
import styles from './styles.module.css';

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

export const StudioCollection: React.FC<StudioCollectionProps> = ({ items }) => {
  if (items === undefined) {
    return <div className={styles.studioCollectionEmpty}>No items available</div>;
  }

  const itemsResolved: Array<Item> = items
    .map((item) => resolveEntityReferences(item))
    .filter(Boolean) as Array<Item>; // remove items which resolution (there should not be any)

  return (
    <div className={styles.studioCollection}>
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
    <div className={styles.studioItem}>
      <img
        src={image?.fields?.file?.url as string}
        alt={itemFields.title}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3>{itemFields.title}</h3>
        <p>{itemFields.description}</p>
        <button className={styles.button}>Explore</button>
      </div>
    </div>
  );
};

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
