import type { Entry, UnresolvedLink } from 'contentful';

type Link<T extends 'Asset' | 'Entry' = 'Asset' | 'Entry'> = UnresolvedLink<T>;

export type FnShouldFollowReferencesOfEntryField = (fieldName: string, entry: Entry) => boolean;

export const uniqueById = <T extends { sys: { id: string } }>(arr: Array<T>): T[] => {
  const map = new Map<string, T>();
  arr.forEach((item) => map.set(item.sys.id, item));
  return [...map.values()];
};

const isObject = (value: unknown) => {
  return typeof value === 'object' && value !== null;
};

/**
 * Extracts all references from an entry.
 * Handles both: reference and multi-reference fields.
 * Returns unique array of references (even if they repeat within the entry).
 */
export const referencesOf = (
  entry: Entry,
  fnShouldFollowReferencesOfEntryField?: FnShouldFollowReferencesOfEntryField,
): UnresolvedLink<'Asset' | 'Entry'>[] => {
  const references: Link<'Asset' | 'Entry'>[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleArray = (fieldValue: Array<unknown>, _fieldName: string) => {
    for (const item of fieldValue) {
      if (isObject(item) && (item as Link).sys?.type === 'Link') {
        references.push(item as Link<'Asset' | 'Entry'>);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLink = (fieldValue: Link<'Asset' | 'Entry'>, _fieldName: string) => {
    references.push(fieldValue);
  };

  for (const [fieldName, fieldValue] of Object.entries(
    entry.fields as Record<string, Record<string, unknown>>,
  )) {
    if (
      fnShouldFollowReferencesOfEntryField &&
      !fnShouldFollowReferencesOfEntryField(fieldName, entry)
    ) {
      continue;
    }
    if (fieldValue === undefined) {
      continue; // edge case when field is present on object, but is set to undefined explicitly e.g. during test mocking { myField: undefined }
    }

    if (Array.isArray(fieldValue)) {
      handleArray(fieldValue, fieldName);
    } else if (
      fieldValue !== null &&
      isObject(fieldValue) &&
      (fieldValue as Link).sys?.type === 'Link'
    ) {
      handleLink(fieldValue as Link<'Asset' | 'Entry'>, fieldName);
    }
  }
  return uniqueById(references);
};

export function extractReferencesFromEntriesAsIds(
  entries: Array<Entry>,
): [string[], string[], string[]] {
  const [uniqueEntries, uniqueAssets, uniqueReferences] = extractReferencesFromEntries(entries);

  const entryIds = uniqueEntries.map((link) => link.sys.id);
  const assetIds = uniqueAssets.map((link) => link.sys.id);
  const referenceIds = uniqueReferences.map((link) => link.sys.id);

  return [entryIds, assetIds, referenceIds] as const;
}

export function extractReferencesFromEntries(
  entries: Array<Entry>,
): [UnresolvedLink<'Entry'>[], UnresolvedLink<'Asset'>[], UnresolvedLink<'Entry' | 'Asset'>[]] {
  const allReferences = entries.flatMap((entry) => referencesOf(entry));

  const uniqueReferences = Array.from(new Set(allReferences)); // same reference can be in multiple entries, thus can be repeated

  const uniqueAssets = uniqueReferences.filter(
    (link) => link.sys.linkType === 'Asset',
  ) as UnresolvedLink<'Asset'>[];

  const uniqueEntries = uniqueReferences.filter(
    (link) => link.sys.linkType === 'Entry',
  ) as UnresolvedLink<'Entry'>[];

  return [uniqueEntries, uniqueAssets, uniqueReferences] as const;
}
