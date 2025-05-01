'use client';
import { Asset, Entry, UnresolvedLink } from 'contentful';
import React, { useEffect, useState } from 'react';
import { inMemoryEntities } from '@contentful/experiences-core';
import { useFetchReference } from '@/app/hooks/useFetchReference';

type ShallowEntry = Entry;
type NeatPotionShelfProps = {
  potions: ShallowEntry[]; // with unresolved links
  linkProp1: ShallowEntry;
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
    primaryImage: UnresolvedLink<'Asset'>;
  };
};

export const NeatPotionShelf: React.FC<NeatPotionShelfProps> = (props: NeatPotionShelfProps) => {
  const [flag, setFlag] = useState(false);
  const shallowPotions = (props.potions || []).filter(Boolean) as unknown as ShallowEntry[]; // guard against undefined values which appear for a moment right after user clicking on binding
  // const { entityStore } = props.services;

  // const potions = shallowPotions.map((p) => resolveLinksUpToLevel3(p));
  const potions = shallowPotions;

  const { fetchLink } = useFetchReference();

  const renderPotionComponent = (potion: PotionL2, index: number) => {
    const { title, image, ingredientPrimary } = potion.fields;

    const resolvedImage = inMemoryEntities.maybeResolveLink(image);

    if (!resolvedImage) {
      console.error('Image not resolved', image);
      const resolvedImage = inMemoryEntities.maybeResolveLink(image);
      return null;
    }

    const resolvedPrimaryIngredient = inMemoryEntities.maybeResolveLink(ingredientPrimary);

    if (!resolvedPrimaryIngredient) {
      console.error('Primary ingredient not resolved', ingredientPrimary);
      const resolvedPrimaryIngredient = inMemoryEntities.maybeResolveLink(ingredientPrimary);
      return null;
    }

    const src = (resolvedImage as Asset).fields?.file?.url as string;

    const primaryIngredientsImageLink = (resolvedPrimaryIngredient as any as Ingredient).fields
      ?.primaryImage;

    useEffect(() => {
      if (primaryIngredientsImageLink?.sys.type === 'Link') {
        fetchLink(primaryIngredientsImageLink).then((resolvedPrimaryIngredientsImage) => {
          inMemoryEntities.addEntities([resolvedPrimaryIngredientsImage!]);
          console.log('Fetched primary ingredient image', resolvedPrimaryIngredientsImage);
          setFlag((flag) => !flag);
        });
      }
    }, [primaryIngredientsImageLink, fetchLink]);

    const primaryIngredientsImage = inMemoryEntities.maybeResolveLink(primaryIngredientsImageLink);

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
            <img
              src={primaryIngredientsImage?.fields.file?.url as string}
              alt="Primary Ingredient"
            />
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
