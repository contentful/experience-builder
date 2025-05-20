import React from 'react';
import type { Asset, UnresolvedLink } from 'contentful';
import styles from './styles.module.css';

type ItemShallow = {
  sys: { id: string };
  fields: {
    title: string;
    description: string;
    image: UnresolvedLink<'Asset'>;
  };
};

// @ts-expect-error example for the documentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sampleOfItemShallow: ItemShallow = {
  fields: {
    title: 'title',
    description: 'description',
    image: {
      sys: {
        type: 'Link',
        linkType: 'Asset',
        id: 'imageId',
      },
    },
  },
};

type ItemResolved = Omit<ItemShallow, 'fields'> & {
  fields: Omit<ItemShallow['fields'], 'image'> & {
    image: Asset;
  };
};

type StudioItemProps = {
  item: ItemResolved;
};

type StudioCollectionProps = {
  items: ItemShallow[];
};

export const StudioCollection: React.FC<StudioCollectionProps> = ({ items }) => {
  if (items === undefined) {
    return <div className={styles.studioCollectionEmpty}>No items available</div>;
  }

  // WARNING: SHALLOW ITEMS
  // At this point items[0] is a "shallow" item, with with shape of ItemShallow (eg. look sampleOfItemShallow)
  // This shape does NOT have `.fields.image` fields being an actual Asset shape, but merely a link to an asset
  // which needs to be acquired and substituted into `fields.image` field.

  // You may have also noticed that there's a type-error in the code below,
  // as <StudioItem> expects not `ItemShallow` but `ItemResolved` type

  // Before we study the algorithm to resolve the real links into assets/entries, let's
  // first study the shape of the `ItemResolved` type.
  // Below is simplified version of what "resolving" item means.
  // Essentially it simply means making copy of the shallow item, and replacing
  // all of it's link fields with the actual objects representing assets/entries. (only asset in this case).

  const itemsResolved = items.map((entry) => {
    // NOTE: It is important to always make a copy of the original shallowItem
    //       as the shallow item is frozen with Object.freeze() and cannot be modified.
    //       Here I am making copy by recreating the object, but you can use structuredClone(item) as well.
    const resolvedItem: ItemResolved = {
      sys: {
        id: entry.sys.id,
      },
      fields: {
        title: entry.fields.title,
        description: entry.fields.description,
        image: createDummyAssetShape({ fakeUrl: 'https://via.placeholder.com/150' }),
      },
    };
    return resolvedItem;
  });

  return (
    <div className={styles.studioCollection}>
      {itemsResolved.map((resolvedItem) => (
        <StudioItem key={resolvedItem.sys.id} item={resolvedItem} />
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

function createDummyAssetShape({ fakeUrl }: { fakeUrl: string }): Asset {
  return {
    sys: {
      id: 'dummyId123',
      type: 'Asset',
      linkType: 'Asset',
    },
    fields: {
      title: 'Dummy Image',
      file: {
        url: fakeUrl,
        details: {
          size: 12345,
          image: {
            width: 800,
            height: 600,
          },
        },
        contentType: 'image/jpeg',
      },
    },
  } as unknown as Asset; // this is minimal set of fields to work with asset
}
