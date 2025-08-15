import { BoundValue } from '@contentful/experiences-validators';
import {
  getPrebindingPathBySourceEntry,
  isDeepPath,
  isDeepPrebinding,
  lastPathNamedSegmentEq,
  parseDataSourcePathIntoFieldset,
  parseDataSourcePathWithL1DeepBindings,
  PreboundVariable,
} from './pathSchema';
import { vi } from 'vitest';

describe('parseDataSourcePathWithL1DeepBindings', () => {
  it('should parse a path with a single level of deep bindings', () => {
    const result = parseDataSourcePathWithL1DeepBindings(
      '/uuid123/fields/image/~locale/fields/file/~locale',
    );
    expect(result).toEqual({
      key: 'uuid123',
      field: 'image',
      referentField: 'file',
    });
  });

  it('should throw an error if the path is not a deep path', () => {
    expect(() => parseDataSourcePathWithL1DeepBindings('')).toThrow(
      "Cannot parse path '' as deep path",
    );

    expect(() => parseDataSourcePathWithL1DeepBindings('/uuid123/fields')).toThrow(
      "Cannot parse path '/uuid123/fields' as deep path",
    );

    expect(() =>
      parseDataSourcePathWithL1DeepBindings('/uuid123/fields/mainStory/~locale'),
    ).toThrow("Cannot parse path '/uuid123/fields/mainStory/~locale' as deep path");
  });
});

describe('isDeepPath', () => {
  it('should return true if the path is a deep path', () => {
    expect(isDeepPath('/uuid123/fields/image/~locale/fields/file/~locale')).toBe(true);
  });
  it('should return false if the path is not a deep path', () => {
    expect(isDeepPath('/uuid123/fields/mainStory/~locale')).toBe(false);
  });
});

describe('parseDataSourcePathIntoFieldset', () => {
  it('should parse a path into a fieldset', () => {
    const result = parseDataSourcePathIntoFieldset(
      '/uuid123/fields/image/~locale/fields/file/~locale/fields/title/~locale',
    );
    expect(result).toEqual([
      [null, 'image', '~locale'],
      [null, 'file', '~locale'],
      [null, 'title', '~locale'],
    ]);
  });
  it('should throw an error if is not a deep path', () => {
    expect(() => parseDataSourcePathIntoFieldset('/uuid123/fields')).toThrow(
      "Cannot parse path '/uuid123/fields' as deep path",
    );
  });
});

describe('lastPathNamedSegmentEq', () => {
  it('should return true if the last path segment is equal to the given value', () => {
    expect(
      lastPathNamedSegmentEq('/uuid123/fields/image/~locale/fields/file/~locale', 'file'),
    ).toBe(true);
  });
  it('should return false if the last path segment is not equal to the given value', () => {
    expect(
      lastPathNamedSegmentEq('/uuid123/fields/image/~locale/fields/file/~locale', 'image'),
    ).toBe(false);
  });
});

describe('isDeepPrebinding', () => {
  it('should return false if variable type does not match BoudValue schema', () => {
    expect(
      isDeepPrebinding({
        type: 'ComponentValue',
        key: '123',
      } as unknown as BoundValue),
    ).toBe(false);

    expect(
      isDeepPrebinding({
        type: 'BoundValue',
      } as unknown as BoundValue),
    ).toBe(false);

    expect(
      isDeepPrebinding({
        path: '/abc',
      } as unknown as BoundValue),
    ).toBe(false);
  });

  it('should return false if the variable is not prebound', () => {
    expect(
      isDeepPrebinding({
        type: 'BoundValue',
        path: '/abc',
      }),
    ).toBe(false);

    expect(
      isDeepPrebinding({
        type: 'BoundValue',
        path: '/abc',
        isPrebound: true,
      } as unknown as PreboundVariable),
    ).toBe(false);

    expect(
      isDeepPrebinding({
        type: 'BoundValue',
        path: '/abc',
        pathsByContentType: {},
      } as unknown as PreboundVariable),
    ).toBe(false);
  });

  it('returns true if the main path is a deep binding path', () => {
    expect(
      isDeepPrebinding({
        type: 'BoundValue',
        path: '/uuid123/fields/image/~locale/fields/file/~locale',
        isPrebound: true,
        pathsByContentType: {
          contentTypeId1: {
            path: '/uuid123/fields/file/~locale',
          },
        },
      } as PreboundVariable),
    ).toBe(true);
  });

  it('returns true if one of the paths in pathsByContentType is a deep binding path', () => {
    expect(
      isDeepPrebinding({
        type: 'BoundValue',
        path: '/uuid123',
        isPrebound: true,
        pathsByContentType: {
          contentTypeId1: {
            path: '/uuid123/fields/file/~locale',
          },
          contentTypeId2: {
            path: '/uuid123/fields/img/~locale/fields/file/~locale',
          },
        },
      } as PreboundVariable),
    ).toBe(true);
  });
});

describe('getPrebindingPathBySourceEntry', () => {
  it('should return the correct prebinding path inferred from the content type of source entry', () => {
    const getHeadEntityByDataSourceKey = vi.fn().mockReturnValue({
      sys: {
        id: 'entry1',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'contentTypeId1',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
      },
    });

    const result = getPrebindingPathBySourceEntry(
      {
        type: 'BoundValue',
        path: '/uuid123/fields/image/~locale/fields/file/~locale',
        isPrebound: true,
        pathsByContentType: {
          contentTypeId1: {
            path: '/uuid123/fields/file/~locale',
          },
          contentTypeId2: {
            path: '/uuid123/fields/img/~locale/fields/file/~locale',
          },
        },
      } as PreboundVariable,
      getHeadEntityByDataSourceKey,
    );
    expect(result).toEqual('/uuid123/fields/file/~locale');
  });

  it('should return undefined if there is no head entry', () => {
    const getHeadEntityByDataSourceKey = vi.fn().mockReturnValue(undefined);

    const result = getPrebindingPathBySourceEntry(
      {
        type: 'BoundValue',
        path: '/uuid123/fields/image/~locale/fields/file/~locale',
        isPrebound: true,
        pathsByContentType: {
          contentTypeId1: {
            path: '/uuid123/fields/file/~locale',
          },
          contentTypeId2: {
            path: '/uuid123/fields/img/~locale/fields/file/~locale',
          },
        },
      } as PreboundVariable,
      getHeadEntityByDataSourceKey,
    );
    expect(result).toEqual(undefined);
  });

  it('should return undefined if the head entry is not entry', () => {
    const getHeadEntityByDataSourceKey = vi.fn().mockReturnValue({
      sys: {
        id: 'asset1',
        type: 'Asset',
        contentType: {
          sys: {
            id: 'contentTypeId1',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
      },
    });

    const result = getPrebindingPathBySourceEntry(
      {
        type: 'BoundValue',
        path: '/uuid123/fields/image/~locale/fields/file/~locale',
        isPrebound: true,
        pathsByContentType: {
          contentTypeId1: {
            path: '/uuid123/fields/file/~locale',
          },
          contentTypeId2: {
            path: '/uuid123/fields/img/~locale/fields/file/~locale',
          },
        },
      } as PreboundVariable,
      getHeadEntityByDataSourceKey,
    );
    expect(result).toEqual(undefined);
  });

  it('should return undefined if content type of the head entry does not match the allowed content type', () => {
    const getHeadEntityByDataSourceKey = vi.fn().mockReturnValue({
      sys: {
        id: 'asset1',
        type: 'Asset',
        contentType: {
          sys: {
            id: 'nonmatchingContentTypeId',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
      },
    });

    const result = getPrebindingPathBySourceEntry(
      {
        type: 'BoundValue',
        path: '/uuid123/fields/image/~locale/fields/file/~locale',
        isPrebound: true,
        pathsByContentType: {
          contentTypeId1: {
            path: '/uuid123/fields/file/~locale',
          },
          contentTypeId2: {
            path: '/uuid123/fields/img/~locale/fields/file/~locale',
          },
        },
      } as PreboundVariable,
      getHeadEntityByDataSourceKey,
    );
    expect(result).toEqual(undefined);
  });

  it('should return undefined if the main path has no dataSourceKey', () => {
    const result = getPrebindingPathBySourceEntry(
      {
        type: 'BoundValue',
        path: '/',
        isPrebound: true,
        pathsByContentType: {
          contentTypeId1: {
            path: '/uuid123/fields/file/~locale',
          },
          contentTypeId2: {
            path: '/uuid123/fields/img/~locale/fields/file/~locale',
          },
        },
      } as PreboundVariable,
      vi.fn(),
    );
    expect(result).toEqual(undefined);
  });
});
