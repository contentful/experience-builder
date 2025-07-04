import { describe, it, expect, vi } from 'vitest';
import { Asset, Entry } from 'contentful';
import { inMemoryEntities, useInMemoryEntities } from './InMemoryEntitiesPublicApi';

const _resolveEntity = vi.fn();
const _resolveAssetById = vi.fn();
const _resolveEntryById = vi.fn();
const _updateEntity = vi.fn();

vi.mock('./InMemoryEntitiesStore', () => {
  return {
    inMemoryEntitiesStore: {
      getState: vi.fn(() => {
        return {
          resolveEntity: _resolveEntity,
          resolveAssetById: _resolveAssetById,
          resolveEntryById: _resolveEntryById,
          entityStore: {
            updateEntity: _updateEntity,
          },
        };
      }),
    },
  };
});

describe('InMemoryEntitiesPublicApi', () => {
  describe('inMemoryEntities', () => {
    it('should expose maybeResolveLink function', () => {
      expect(inMemoryEntities.maybeResolveLink).toBeDefined();
      expect(typeof inMemoryEntities.maybeResolveLink).toBe('function');
    });

    it('should expose maybeResolveByAssetId function', () => {
      expect(inMemoryEntities.maybeResolveByAssetId).toBeDefined();
      expect(typeof inMemoryEntities.maybeResolveByAssetId).toBe('function');
    });

    it('should expose maybeResolveByEntryId function', () => {
      expect(inMemoryEntities.maybeResolveByEntryId).toBeDefined();
      expect(typeof inMemoryEntities.maybeResolveByEntryId).toBe('function');
    });

    it('should expose hasEntry function', () => {
      expect(inMemoryEntities.hasEntry).toBeDefined();
      expect(typeof inMemoryEntities.hasEntry).toBe('function');
    });

    it('should expose hasAsset function', () => {
      expect(inMemoryEntities.hasAsset).toBeDefined();
      expect(typeof inMemoryEntities.hasAsset).toBe('function');
    });

    it('should expose addEntities function', () => {
      expect(inMemoryEntities.addEntities).toBeDefined();
      expect(typeof inMemoryEntities.addEntities).toBe('function');
    });
  });

  describe('useInMemoryEntities', () => {
    it('should return inMemoryEntities object', () => {
      const result = useInMemoryEntities();
      expect(result).toBe(inMemoryEntities);
    });
  });
});

describe('useInMemoryEntities', () => {
  it('should return an object with all required methods', () => {
    const resultingInMemoryEntities = useInMemoryEntities();
    expect(resultingInMemoryEntities).toEqual(
      expect.objectContaining({
        maybeResolveLink: expect.any(Function),
        maybeResolveByAssetId: expect.any(Function),
        maybeResolveByEntryId: expect.any(Function),
        hasEntry: expect.any(Function),
        hasAsset: expect.any(Function),
        addEntities: expect.any(Function),
      }),
    );
  });
});

describe('inMemoryEntities.maybeResolveLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should call resolveEntity when passed a valid link', () => {
    const validLink = {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: 'test-id',
      },
    };

    inMemoryEntities.maybeResolveLink(validLink);

    expect(_resolveEntity).toHaveBeenCalledWith(validLink);
  });

  it('should return undefined and log warning when passed invalid link', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    const invalidLink = { foo: 'bar' };

    const result = inMemoryEntities.maybeResolveLink(invalidLink);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    expect(_resolveEntity).not.toHaveBeenCalled();
  });
});

describe('inMemoryEntities.maybeResolveByAssetId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call resolveAssetById with provided asset id', () => {
    const assetId = 'test-asset-id';

    inMemoryEntities.maybeResolveByAssetId(assetId);

    expect(_resolveAssetById).toHaveBeenCalledWith(assetId);
  });

  it('should return the resolved asset from store', () => {
    const assetId = 'test-asset-id';
    const mockAsset = { sys: { id: assetId, type: 'Asset' } };
    _resolveAssetById.mockReturnValue(mockAsset);

    const result = inMemoryEntities.maybeResolveByAssetId(assetId);

    expect(result).toBe(mockAsset);
  });
});

describe('inMemoryEntities.maybeResolveByEntryId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call resolveEntryById with provided entry id', () => {
    const entryId = 'test-entry-id';

    inMemoryEntities.maybeResolveByEntryId(entryId);

    expect(_resolveEntryById).toHaveBeenCalledWith(entryId);
  });

  it('should return the resolved entry from store', () => {
    const entryId = 'test-entry-id';
    const mockEntry = { sys: { id: entryId, type: 'Entry' } };
    _resolveEntryById.mockReturnValue(mockEntry);

    const result = inMemoryEntities.maybeResolveByEntryId(entryId);

    expect(result).toBe(mockEntry);
  });
});

describe('inMemoryEntities.hasEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when entry exists', () => {
    const entryId = 'test-entry-id';
    const mockEntry = { sys: { id: entryId, type: 'Entry' } };
    _resolveEntryById.mockReturnValue(mockEntry);

    const result = inMemoryEntities.hasEntry(entryId);

    expect(result).toBe(true);
    expect(_resolveEntryById).toHaveBeenCalledWith(entryId);
  });

  it('should return false when entry does not exist', () => {
    const entryId = 'non-existent-entry';
    _resolveEntryById.mockReturnValue(undefined);

    const result = inMemoryEntities.hasEntry(entryId);

    expect(result).toBe(false);
    expect(_resolveEntryById).toHaveBeenCalledWith(entryId);
  });
});

describe('inMemoryEntities.hasAsset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when asset exists', () => {
    const assetId = 'test-asset-id';
    const mockAsset = { sys: { id: assetId, type: 'Asset' } };
    _resolveAssetById.mockReturnValue(mockAsset);

    const result = inMemoryEntities.hasAsset(assetId);

    expect(result).toBe(true);
    expect(_resolveAssetById).toHaveBeenCalledWith(assetId);
  });

  it('should return false when asset does not exist', () => {
    const assetId = 'non-existent-asset';
    _resolveAssetById.mockReturnValue(undefined);

    const result = inMemoryEntities.hasAsset(assetId);

    expect(result).toBe(false);
    expect(_resolveAssetById).toHaveBeenCalledWith(assetId);
  });
});

describe('inMemoryEntities.addEntities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do nothing when empty array is provided', () => {
    inMemoryEntities.addEntities([]);

    expect(_updateEntity).not.toHaveBeenCalled();
  });

  it('should do nothing when argument is not an array', () => {
    // @ts-expect-error testing invalid input
    inMemoryEntities.addEntities('not an array');

    expect(_updateEntity).not.toHaveBeenCalled();
  });

  it('should update store for each valid entry', () => {
    const mockEntries = [
      { sys: { type: 'Entry', id: '1' } } as Entry, // entry 1
      { sys: { type: 'Entry', id: '2' } } as Entry, // entry 2
    ];

    inMemoryEntities.addEntities(mockEntries);

    expect(_updateEntity).toHaveBeenCalledTimes(2);
    expect(_updateEntity).toHaveBeenCalledWith(mockEntries[0]);
    expect(_updateEntity).toHaveBeenCalledWith(mockEntries[1]);
  });

  it('should update store for each valid asset', () => {
    const mockAssets = [
      { sys: { type: 'Asset', id: '1' } } as Asset,
      { sys: { type: 'Asset', id: '2' } } as Asset,
    ];

    inMemoryEntities.addEntities(mockAssets);

    expect(_updateEntity).toHaveBeenCalledTimes(2);
    expect(_updateEntity).toHaveBeenCalledWith(mockAssets[0]);
    expect(_updateEntity).toHaveBeenCalledWith(mockAssets[1]);
  });

  it('should handle mixed array of entries and assets', () => {
    const mockEntities = [
      { sys: { type: 'Asset', id: '1' } } as Asset,
      { sys: { type: 'Entry', id: '2' } } as Entry,
    ];

    inMemoryEntities.addEntities(mockEntities);

    expect(_updateEntity).toHaveBeenCalledTimes(2);
    expect(_updateEntity).toHaveBeenCalledWith(mockEntities[0]);
    expect(_updateEntity).toHaveBeenCalledWith(mockEntities[1]);
  });

  it('should filter out null/undefined values', () => {
    const mockEntities = [
      { sys: { type: 'Asset', id: '1' } } as Asset,
      null,
      undefined,
      { sys: { type: 'Entry', id: '2' } } as Entry,
    ];

    // @ts-expect-error testing with invalid values
    inMemoryEntities.addEntities(mockEntities);

    expect(_updateEntity).toHaveBeenCalledTimes(2);
    expect(_updateEntity).toHaveBeenCalledWith(mockEntities[0]);
    expect(_updateEntity).toHaveBeenCalledWith(mockEntities[3]);
  });
});
