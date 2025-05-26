// --- UsingMaybeResolve.tsx ---
import React from 'react';
import type { Asset, UnresolvedLink } from 'contentful';
import { inMemoryEntities } from '@contentful/experiences-sdk-react';
import styles from './styles.module.css';

type ItemWithUnresolvedReference = {
  sys: { id: string };
  fields: {
    title?: string;
    description?: string;
    image?: UnresolvedLink<'Asset'>;
  };
};

// @ts-expect-error example for the documentation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sampleOfItemWithUnresolvedReference: ItemWithUnresolvedReference = {
  fields: {
    title: 'title',
    description: 'description',
    image: {
      sys: {
        type: 'Link',
        linkType: 'Asset',
        id: 'image123',
      },
    },
  },
};

type ItemResolved = Omit<ItemWithUnresolvedReference, 'fields'> & {
  fields: Omit<ItemWithUnresolvedReference['fields'], 'image'> & {
    image?: Asset;
  };
};

type StudioItemProps = {
  item: ItemResolved;
};

type StudioCollectionProps = {
  items: ItemWithUnresolvedReference[];
};

export const StudioCollection: React.FC<StudioCollectionProps> = ({ items }) => {
  if (items === undefined) {
    return <div className={styles.studioCollectionEmpty}>No items available</div>;
  }

  // At this point items[0] is a "shallow" item, with with shape of ItemWithUnresolvedReference
  // In this shape the field `.fields.image` does NOT contain the actual Asset shape, but merely a link to the asset.
  // The asset must be acquired and substituted into `fields.image` field as shown below.

  // Let's look at the algorithm to resolve the links into real assets/entries:
  // To do this we need to make a copy of the itemWithUnresolvedReference, and replace
  // all of it's link fields with the actual objects representing assets/entries. 
  // In this case, we only have a single field `.fields.image` which we need to set to the actual asset.
  // We can acquire the asset by link form the SDK memory by calling `inMemoryEntities.maybeResolveLink(item.fields.image)`.

  // REMEMBER: It is important to always make a copy of the original itemWithUnresolvedReference
  //       as the JS object representing the item is frozen with Object.freeze() and cannot be mutated.
  //       The items in SDK's memory are immutable, so that on multiple renders/queries their contents is consistent.
  //       Here I am making copy by recreating the object, but you can use structuredClone(item) as well.

  const itemsResolved = items.map((itemWithUnresolvedReference) => {
    const resolvedItem: ItemResolved = {
      sys: {
        id: itemWithUnresolvedReference.sys.id,
      },
      fields: {
        title: itemWithUnresolvedReference.fields.title,
        description: itemWithUnresolvedReference.fields.description,
        image: inMemoryEntities.maybeResolveLink(itemWithUnresolvedReference.fields.image),
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
  // Defensive programming: during Editing, user fields of any entities may be undefined.
  // Contentful platform can only guarantee presence of user's entities marked as required in the Content Model,
  // when entity is published. During editing in Studio, draft entities may be passed to the react component and
  // need to be handled accordingly.
  const title = item.fields.title || 'No title';
  const description = item.fields.description || 'No description';
  const image_url: string = item.fields.image?.fields?.file?.url as string || 'https://placehold.co/300x300';

  return (
    <div className={styles.studioItem}>
      <img
        src={image_url}
        alt={title}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{description}</p>
        <button className={styles.button}>Explore</button>
      </div>
    </div>
  );
};
