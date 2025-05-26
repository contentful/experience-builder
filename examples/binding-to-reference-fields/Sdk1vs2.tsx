// --- Sdk1vs2.tsx ---
import type { Asset, UnresolvedLink } from 'contentful';
import { inMemoryEntities } from '@contentful/experiences-sdk-react';

type ItemWithResolvedReferences = {
  sys: {
    id: string;
  };
  fields: {
    title?: string;
    description?: string;
    image?: Asset; // resolved asset, as opposed to unresolved link
  };
};

type ItemWithUnresolvedReferences = {
  sys: {
    id: string;
  };
  fields: {
    title?: string;
    description?: string;
    image?: UnresolvedLink<'Asset'>; // unresolved link to an asset
  };
};

type ItemWithManuallyResolvedReferences = Omit<ItemWithUnresolvedReferences, 'fields'> & {
  fields: Omit<ItemWithUnresolvedReferences['fields'], 'image'> & {
    image?: Asset; // manually resolved asset
  };
};

type PropsV1 = {
  item: ItemWithResolvedReferences;
};

type PropsV2 = {
  item: ItemWithUnresolvedReferences;
};

// In SDK v1 the component receives an item, which is an Entry with resolved references.
// Thus the image field is already an asset, not link to an asset, and thus can be used immediately without resolution.
export const ComponentUsingSdkV1: React.FC<PropsV1> = ({ item }) => {
  return (
    <div>
      <img src={item?.fields.image?.fields.file?.url} alt={item?.fields.title} />
      <div>
        <h3>{item?.fields.title}</h3>
        <p>{item?.fields.description}</p>
        <button> Explore </button>
      </div>
    </div>
  );
};

// In SDK v2 the component receives an item, which is an Entry with unresolved references.
// Thus the image field is a link object, which needs to be replaced with the actual asset object.
export const ComponentUsingSdkV2: React.FC<PropsV2> = ({ item }) => {

  // Must make copy! as `item` is marked as immutable by the SDK via Object.freeze().
  const itemResolved: ItemWithManuallyResolvedReferences = structuredClone(item) as ItemWithManuallyResolvedReferences;
  itemResolved.fields.image = inMemoryEntities.maybeResolveLink(item.fields.image);

  return (
    <div>
      <img src={item?.fields.image?.fields.file?.url} alt={item?.fields.title} />
      <div>
        <h3>{item?.fields.title}</h3>
        <p>{item?.fields.description}</p>
        <button> Explore </button>
      </div>
    </div>
  );
};
