/**
 * This module encapsulates format of the path to a deep reference.
 */

import { Asset, Entry } from 'contentful';

export type UnresolvedFieldset = Array<[null, string, string?]>;
export type Fieldset = Array<[Entry | Asset, string, string?]>;

export const parseDataSourcePathIntoFieldset = (path: string): UnresolvedFieldset => {
  const parsedPath = parseDeepPath(path);

  if (null === parsedPath) {
    throw new Error(`Cannot parse path '${path}' as deep path`);
  }

  return parsedPath.fields.map((field) => [null, field, '~locale']);
};

/**
 * Parse path into components, supports  L1 references (one reference follow) atm.
 * @param path from data source. eg. `/uuid123/fields/image/~locale/fields/file/~locale`
 *                               eg. `/uuid123/fields/file/~locale/fields/title/~locale`
 * @returns
 */
export const parseDataSourcePathWithL1DeepBindings = (
  path: string
): {
  key: string;
  field: string;
  fieldLocaleQualifier: string | null;
  referentField: string;
  referentLocaleQualifier: string | null;
} => {
  const parsedPath = parseDeepPath(path);

  if (null === parsedPath) {
    // Does it throw on non-deep bindings?
    // I think it should support non-deep bindings... too.. no? where is it used?
    throw new Error(`Cannot parse path '${path}' as deep path`);
  }

  return {
    key: parsedPath.key,
    field: parsedPath.fields[0],
    referentField: parsedPath.fields[1],
    // probaly I don't need this
    fieldLocaleQualifier: '~locale',
    referentLocaleQualifier: '~locale',
  };
};

/**
 * Detects if paths is valid deep-path, like:
 *  - /gV6yKXp61hfYrR7rEyKxY/fields/mainStory/~locale/fields/cover/~locale/fields/title/~locale
 * or regular, like:
 *  - /6J8eA60yXwdm5eyUh9fX6/fields/mainStory/~locale
 * @returns
 */
export const isDeepPath = (deepPathCandidate: string): boolean => {
  return parseDeepPath(deepPathCandidate) !== null;
};

type DeepPathParsed = {
  key: string;
  fields: string[]; // without locale (as it's not used in SDK atm)
};

const parseDeepPath = (deepPathCandidate: string): DeepPathParsed | null => {
  // ALGORITHM:
  // We start with deep path in form:
  // /uuid123/fields/mainStory/~locale/fields/cover/~locale/fields/title/~locale
  // First turn string into array of segments
  //      ['', 'uuid123', 'fields', 'mainStory', '~locale', 'fields', 'cover', '~locale', 'fields', 'title', '~locale']
  // Then group segments into chunks, where each non-initial chunk starts with 'fields'
  //      [
  //        [ "", "uuid123" ],
  //        [ "fields", "mainStory", "~locale" ],
  //        [ "fields", "cover", "~locale" ],
  //        [ "fields", "title", "~locale" ]
  //      ]
  // Then check "initial" chunk for corretness
  // Then check all "field-leading" chunks for correctness

  const isValidInitialChunk = (initialChunk: string[]) => {
    // must have start with '' and have at least 2 segments, second non-empty
    if (initialChunk.length !== 2) return false;
    if (initialChunk[0] !== '') return false;
    if (initialChunk[1].length === 0) return false;
    return true;
  };

  const isValidFieldChunk = (fieldChunk: string[]) => {
    // must start with 'fields' and have at least 3 segments, second non-empty and last segment must be '~locale'
    if (fieldChunk.length !== 3) return false;
    if (fieldChunk[0] !== 'fields') return false;
    if (fieldChunk[1].length === 0) return false;
    if (fieldChunk[2] !== '~locale') return false;
    return true;
  };

  const deepPathSegments = deepPathCandidate.split('/');
  const chunks = chunkSegments(deepPathSegments, { startNextChunkOnElementEqualTo: 'fields' });
  if (chunks.length <= 1) {
    return null; // malformed path, even regular paths have at least 2 chunks
  } else if (chunks.length === 2) {
    return null; // deep paths have at least 3 chunks
  }

  // With 3+ chunks we can now check for deep path correctness
  const [initialChunk, ...fieldChunks] = chunks;

  if (!isValidInitialChunk(initialChunk)) {
    return null;
  }

  if (!fieldChunks.every(isValidFieldChunk)) {
    return null;
  }

  return {
    key: initialChunk[1], // pick uuid from initial chunk ['','uuid123'],
    fields: fieldChunks.map((fieldChunk) => fieldChunk[1]), // pick field from each field chunk eg. ['fields','mainStory', '~locale']
  };
};

const chunkSegments = (
  segments: string[],
  { startNextChunkOnElementEqualTo }: { startNextChunkOnElementEqualTo: string }
): Array<string[]> => {
  const chunks: Array<string[]> = [];
  let currentChunk: string[] = [];

  const isSegmentBeginningOfChunk = (segment: string) => segment === startNextChunkOnElementEqualTo;
  const isInitialElement = (segmentIndex: number) => segmentIndex === 0;
  const excludeEmptyChunks = (chunk: string[]) => chunk.length > 0;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (isInitialElement(i)) {
      currentChunk = [segment];
    } else if (isSegmentBeginningOfChunk(segment)) {
      chunks.push(currentChunk);
      currentChunk = [segment];
    } else {
      currentChunk.push(segment);
    }
  }
  chunks.push(currentChunk);

  return chunks.filter(excludeEmptyChunks);
};
