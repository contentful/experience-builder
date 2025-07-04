import { Asset, Entry, UnresolvedLink } from 'contentful';
import { isLink } from '../utils/isLink';
import { inMemoryEntitiesStore } from './InMemoryEntitiesStore';

function maybeResolveLink(maybeLink: UnresolvedLink<'Entry'>): Entry | undefined;
function maybeResolveLink(maybeLink: UnresolvedLink<'Asset'>): Asset | undefined;
function maybeResolveLink(maybeLink: UnresolvedLink<'Asset' | 'Entry'>): Asset | Entry | undefined;
function maybeResolveLink(maybeLink: unknown): Entry | Asset | undefined;
function maybeResolveLink(maybeLink: unknown): Entry | Asset | undefined {
  if (!isLink(maybeLink)) {
    console.warn(
      'maybeResolveLink function must receive Link shape. Provided argument does not match the Link shape: ',
      maybeLink,
    );
    return undefined;
  }
  return inMemoryEntitiesStore.getState().resolveEntity(maybeLink);
}

function maybeResolveByAssetId(assetId: string): Asset | undefined {
  return inMemoryEntitiesStore.getState().resolveAssetById(assetId);
}

function maybeResolveByEntryId(entryId: string): Entry | undefined {
  return inMemoryEntitiesStore.getState().resolveEntryById(entryId);
}

function hasEntry(entryId: string): boolean {
  return Boolean(maybeResolveByEntryId(entryId));
}

function hasAsset(assetId: string): boolean {
  return Boolean(maybeResolveByAssetId(assetId));
}

function addEntities(entities: Array<Entry>): void;
function addEntities(entities: Array<Asset>): void;
function addEntities(entities: Array<Entry | Asset>): void;
function addEntities(entities: Array<Entry> | Array<Asset> | Array<Entry | Asset>): void {
  if (!Array.isArray(entities) || entities.length === 0) {
    return;
  }

  const { entityStore } = inMemoryEntitiesStore.getState();
  const definedEntities = entities.filter(Boolean);

  for (const entity of definedEntities) {
    entityStore.updateEntity(entity);
  }
}

const inMemoryEntities = {
  maybeResolveLink,
  maybeResolveByAssetId,
  maybeResolveByEntryId,
  hasEntry,
  hasAsset,
  addEntities,
};

export type InMemoryEntitiesPublicApi = typeof inMemoryEntities;

const useInMemoryEntities = () => {
  return inMemoryEntities;
};

export { inMemoryEntities, useInMemoryEntities };
