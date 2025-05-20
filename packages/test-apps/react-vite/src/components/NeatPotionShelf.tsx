import React from 'react';
import { Asset, Entry } from 'contentful';
import {
  resolveEntityReferences,
  isEntry,
  isLink,
} from '../binding-to-reference-fields/resolutionUtils';

type ShallowEntry = Entry;
type NeatPotionShelfProps = {
  potions: ShallowEntry[]; // with unresolved links
  lotions: ShallowEntry[]; // with unresolved links
  linkProp1: ShallowEntry;
  singlePotion: ShallowEntry;
};

// DK.TODO: it seems that all of the fields can be optional, even scalar, as only upon publishing validation
//          happens for the entries. Which means that in DRAFT mode (which is what Studio EDITOR displays)
//          any of the fields can be undefined. (even 'title' probably)
type PotionL2 = {
  fields: {
    title: string; // TODO: should `title` be optional?
    image?: Asset;
    ingredientPrimary?: Ingredient;
    ingredients?: Array<Ingredient>;
  };
};

type Ingredient = {
  fields: {
    title: string;
  };
};

export const NeatPotionShelf: React.FC<NeatPotionShelfProps> = (props: NeatPotionShelfProps) => {
  // potions: Array
  console.log(`;;; passed potions (as is, maybe undefined): `, props.potions);
  const shallowPotions = (props.potions || []).filter(Boolean) as unknown as ShallowEntry[]; // guard against undefined values which appear for a moment right after user clicking on binding
  props.potions && console.log(`;;; shallow potions: `, shallowPotions);
  const potions = shallowPotions.map((p) => resolveEntityReferences(p));
  props.potions && console.log(`;;; resolved potions: `, potions);

  // singlePotion
  console.log(`,,, passed singlePotion (as is, maybe undefined): `, props.singlePotion);
  const singlePotion = resolveEntityReferences(props.singlePotion);
  console.log(`,,, resolved singlePotion: `, singlePotion);

  const renderPotionComponent = (potion: PotionL2, index: number) => {
    if (!potion) {
      return <div key={index}>Logic error: Potion at index [${index}] is undefined</div>;
    }
    const { title, image, ingredientPrimary, ingredients } = potion.fields;
    // const src = image.fields?.file?.url as string; // image may be optional on the field
    const src = image?.fields?.file?.url as string;

    return (
      <article key={index} style={{ display: 'flex', flexDirection: 'row' }}>
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
        <div style={{ border: '1px solid black', padding: '10px' }}>
          <p>
            <b>{title}</b> (L2)
          </p>
          <p>
            primary ingredient (L3): <b>{ingredientPrimary?.fields?.title}</b>
          </p>
        </div>
        <div style={{ border: '1px solid black', padding: '10px' }}>
          Ingredients (L3 Array):
          <ul>
            {ingredients?.map((ingredient, index) => (
              <li key={index}>
                {!ingredient ? (
                  <div>Ingredient at index [{index}] not set</div>
                ) : (
                  <b>{ingredient.fields?.title}</b>
                )}
              </li>
            ))}
          </ul>
        </div>
      </article>
    );
  };

  const renderPotions = () => {
    const noPotions = potions.length === 0;
    // const potionsAreLinksAndNotShallowEntries = potions.some((p) => isLink(p));
    const potionsAreShallowEntries = potions.some((p) => isEntry(p));

    if (noPotions) {
      return (
        <div>
          <h2>Potions</h2>
          <div>No potions were bound</div>
        </div>
      );
    }

    if (!potionsAreShallowEntries) {
      return (
        <div>
          <h2>Potions</h2>
          <div>Potions should be shallow entries, but they seem to be links</div>
          <pre style={{ fontSize: '9px' }}>{JSON.stringify(shallowPotions, null, 2)}</pre>
        </div>
      );
    }

    return (
      <div>
        <h2>Potions</h2>
        <div>
          {potions.map((potion, index) =>
            renderPotionComponent(potion as unknown as PotionL2, index),
          )}
        </div>
      </div>
    );
  };

  const renderSinglePotion = () => {
    const noSinglePotion = singlePotion === undefined;
    const singlePotionIsLink = isLink(singlePotion);
    const singlePotionIsShallowEntry = isEntry(singlePotion);

    if (noSinglePotion) {
      return (
        <div>
          <h2>Single Potion</h2>
          <div>No single potion was bound</div>
        </div>
      );
    }

    if (singlePotionIsLink) {
      return (
        <div>
          <h2>Single Potion</h2>
          <div>Single potion should be shallow entry, but it seems to be a link</div>
          <pre style={{ fontSize: '9px' }}>{JSON.stringify(singlePotion, null, 2)}</pre>
        </div>
      );
    }

    if (!singlePotionIsShallowEntry) {
      return (
        <div>
          <h2>Single Potion</h2>
          <div>
            Single potion should be shallow entry, but it seems to be something else (eg. Asset or
            Experience)
          </div>
          <pre style={{ fontSize: '9px' }}>{JSON.stringify(singlePotion, null, 2)}</pre>
        </div>
      );
    }

    return (
      <div>
        <h2>Single Potion</h2>
        {renderPotionComponent(singlePotion as unknown as PotionL2, 0)}
      </div>
    );
  };
  return (
    <div>
      <h1>Neat Potion Shelf</h1>
      {renderPotions()}
      {renderSinglePotion()}
    </div>
  );
};
