import {
  isDeepPath,
  lastPathNamedSegmentEq,
  parseDataSourcePathIntoFieldset,
  parseDataSourcePathWithL1DeepBindings,
} from './pathSchema';

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
