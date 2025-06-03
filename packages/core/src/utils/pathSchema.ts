/**
 * This module encapsulates format of the path to a deep reference.
 */

import { Asset, Entry } from 'contentful';

const chunkSegments = (
  segments: string[],
  { startNextChunkOnElementEqualTo }: { startNextChunkOnElementEqualTo: string },
): Array<string[]> => {
  const chunks: Array<string[]> = [];
  let currentChunk: string[] = [];

  const isSegmentBeginningOfChunk = (segment: string) => segment === startNextChunkOnElementEqualTo;
  const excludeEmptyChunks = (chunk: string[]) => chunk.length > 0;

  for (let i = 0; i < segments.length; i++) {
    const isInitialElement = i === 0;
    const segment = segments[i];
    if (isInitialElement) {
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
  // Then group segments into intermediate represenatation - chunks, where each non-initial chunk starts with 'fields'
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
    // eg. /-_432uuid123123
    return /^\/([^/^~]+)$/.test(initialChunk.join('/'));
  };

  const isValidFieldChunk = (fieldChunk: string[]) => {
    // must start with 'fields' and have at least 3 segments, second non-empty and last segment must be '~locale'
    // eg. fields/-32234mainStory/~locale
    return /^fields\/[^/^~]+\/~locale$/.test(fieldChunk.join('/'));
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
    fields: fieldChunks.map((fieldChunk) => fieldChunk[1]), // pick  only fieldName eg. from  ['fields','mainStory', '~locale'] we pick `mainStory`
  };
};

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
  path: string,
): {
  key: string;
  field: string;
  referentField: string;
} => {
  const parsedPath = parseDeepPath(path);

  if (null === parsedPath) {
    throw new Error(`Cannot parse path '${path}' as deep path`);
  }

  return {
    key: parsedPath.key,
    field: parsedPath.fields[0],
    referentField: parsedPath.fields[1],
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
  const deepPathParsed = parseDeepPath(deepPathCandidate);
  if (!deepPathParsed) {
    return false;
  }
  return deepPathParsed.fields.length > 1;
};

export const lastPathNamedSegmentEq = (path: string, expectedName: string) => {
  // `/key123/fields/featureImage/~locale/fields/file/~locale`
  // ['', 'key123', 'fields', 'featureImage', '~locale', 'fields', 'file', '~locale']
  const segments = path.split('/');

  if (segments.length < 2) {
    console.warn(
      `[experiences-sdk-react] Attempting to check whether last named segment of the path (${path}) equals to '${expectedName}', but the path doesn't have enough segments.`,
    );
    return false;
  }
  const secondLast = segments[segments.length - 2]; // skipping trailing '~locale'
  return secondLast === expectedName;
};
