import { Asset, Entry, UnresolvedLink } from 'contentful';
import React from 'react';
import { maybeResolveLink } from '@contentful/experiences-core';

type ShallowEntry = Entry;
type NeatPotionShelfProps = {
  potions: ShallowEntry[]; // with unresolved links
  linkProp1: ShallowEntry;
  services: {
    hello: () => void;
    getEntityStore: () => EntityStore;
    entityStore: EntityStore; // TODO: should we expose it here or just use getter?
    resolveLinksUpToLevel3: (shallowEntry: ShallowEntry) => Entry;
  };
};

type EntityStore = {
  getEntryOrAsset(link: unknown, deepPath: string): undefined | Entry | Asset;
};

type PotionL2 = {
  fields: {
    title: string;
    image: UnresolvedLink<'Asset'>;
    ingredientPrimary: UnresolvedLink<'Entry'>;
  };
};

type Ingredient = {
  fields: {
    title: string;
  };
};

export const NeatPotionShelf: React.FC<NeatPotionShelfProps> = (props: NeatPotionShelfProps) => {
  const shallowPotions = (props.potions || []).filter(Boolean) as unknown as ShallowEntry[]; // guard against undefined values which appear for a moment right after user clicking on binding
  // const { entityStore } = props.services;

  // console.log('~entityStore', entityStore, entityCache.getState().entityStore);

  // const potions = shallowPotions.map((p) => resolveLinksUpToLevel3(p));
  const potions = shallowPotions;

  const renderPotionComponent = (potion: PotionL2, index: number) => {
    const { title, image, ingredientPrimary } = potion.fields;

    const resolvedImage = maybeResolveLink(image);

    if (!resolvedImage) {
      console.error('Image not resolved', image);
      const resolvedImage = maybeResolveLink(image);
      return null;
    }

    const resolvedPrimaryIngredient = maybeResolveLink(ingredientPrimary);

    if (!resolvedPrimaryIngredient) {
      console.error('Primary ingredient not resolved', ingredientPrimary);
      const resolvedPrimaryIngredient = maybeResolveLink(ingredientPrimary);
      return null;
    }

    const src = (resolvedImage as Asset).fields?.file?.url as string;

    return (
      <li key={index}>
        <article style={{ display: 'flex', flexDirection: 'row' }}>
          <section id="image">
            <img
              style={{
                width: '100px',
                height: '100px',
                maxWidth: '100%',
              }}
              src={src}
              alt={title}
            />
          </section>
          <section id="details">
            <h5>
              {title} and primary ingredient ={' '}
              {(resolvedPrimaryIngredient as any as Ingredient).fields?.title}
            </h5>
          </section>
        </article>
      </li>
    );
  };

  return (
    <div>
      <h2>Potions</h2>
      {potions.length > 0 ? (
        <ul>
          {potions.map((potion, index) =>
            renderPotionComponent(potion as unknown as PotionL2, index),
          )}
        </ul>
      ) : (
        <div>No potions found</div>
      )}
    </div>
  );
};
