import { Asset, Entry, Link } from 'contentful';
import React from 'react';
type ShallowEntry = Entry;
type PotionShelfProps = {
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
    image: Asset;
    ingredientPrimary: Ingredient;
  };
};

type Ingredient = {
  fields: {
    title: string;
  };
};

export const PotionShelf: React.FC<PotionShelfProps> = (props: PotionShelfProps) => {
  const shallowPotions = (props.potions || []).filter(Boolean) as unknown as ShallowEntry[]; // guard against undefined values which appear for a moment right after user clicking on binding
  // const { resolveLinksUpToLevel3 } = props.services;

  // const potions = shallowPotions.map((p) => resolveLinksUpToLevel3(p));
  const potions = shallowPotions;

  const renderPotionComponent = (potion: PotionL2, index: number) => {
    const { title, image, ingredientPrimary } = potion.fields;
    console.log(`;; potion.fields: `, { fields: potion.fields });
    const src = image.fields?.file?.url as string;

    return (
      <li key={index}>
        <img src={src} alt={title} />
        <h5>
          {title} and primary ingredient = {ingredientPrimary?.fields?.title}
        </h5>
        <pre>
          {(potion as unknown as Link<'Asset' | 'Entry'>).linkType
            ? JSON.stringify(potion, null, 2)
            : JSON.stringify({ fields: potion.fields }, null, 2)}
        </pre>
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
