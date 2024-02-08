/**
 * This module encapsulates format of the path to a deep reference.
 */
import { Asset, Entry } from 'contentful';

export type UnresolvedFieldset = Array<[null, string, string?]>;
export type Fieldset = Array<[Entry | Asset, string, string?]>;

export const parseDataSourcePathIntoFieldset = (deepPath: string): UnresolvedFieldset => {
  const regex = /^\/([^/]+)\/fields\/(.+)$/; // https://regex101.com/r/cFADIR/1

  const matches = deepPath.match(regex);

  if (null === matches) {
    throw new Error(
      `Cannot match deepPath [${deepPath}] with regex [${regex.toString()}] to separate dataSource key from fields.`
    );
  }

  const [_match, _key, deepSegments] = matches;

  const segments = deepSegments.split('->');
  const fieldset: UnresolvedFieldset = segments.map((segment) => {
    const [field, localeQualifier] = segment.split('/');
    return [null, field, localeQualifier];
  });
  return fieldset;
};

/**
 * Parse path into components, supports  L1 references (one reference follow) atm.
 * @param path from data source. eg. `/cpFs4Cl49Zq6fWNLCdnw7/fields/image->file/~locale`
 *                               eg. `/cpFs4Cl49Zq6fWNLCdnw7/fields/file/~locale/fields/title`
 * @returns
 */
export const parseDataSourcePathWithL1DeepBindings = (
  path: string
): {
  key: string;
  field: string;
  referentField: string;
  referentLocaleQualifier: string;
} => {
  const regex = /^\/([^\/]+)\/fields\/([^-]+)->([^\/]+)\/(\S+)/;

  const matches = path.match(regex);
  if (!matches) {
    throw new Error(`Cannot match path with regex [${regex.toString()}]`);
  }
  const [_, key, field, referentField, referentLocaleQualifier] = matches as string[];

  return {
    key,
    field,
    referentField,
    referentLocaleQualifier,
  };
};

export const isDeepPath = (path: string): boolean => {
  return path.includes('->');
};
