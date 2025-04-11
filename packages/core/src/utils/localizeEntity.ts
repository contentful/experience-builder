import { Asset, Entry } from 'contentful';

/**
 * Localizes the provided entry or asset to match the regular format of CDA/CPA entities.
 * Note that this function does not apply a fallback to the default locale nor does it check
 * the content type for the localization setting of each field.
 * It will simply resolve each field to the requested locale.
 * @example
 * ```
 * const multiLocaleEntry = { fields: { title: { 'en-US': 'Hello' } } };
 * const localizedEntry = localizeEntity(multiLocaleEntry, 'en-US');
 * console.log(localizedEntry.fields.title); // 'Hello'
 * ```
 */
export function localizeEntity(entity: Asset | Entry, locale: string) {
  if (!entity || !entity.fields) {
    throw new Error('Invalid entity provided');
  }
  if (entity.sys.locale) {
    throw new Error('Entity is already localized');
  }
  const cloned = structuredClone(entity);
  // Set the requested locale as entry locale
  cloned.sys.locale = locale;

  for (const key in cloned.fields) {
    cloned.fields[key] = cloned.fields[key][locale];
  }

  return cloned;
}
