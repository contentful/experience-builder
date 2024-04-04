import { Entry } from 'contentful';

export const resolveHyperlinkPattern = (
  pattern: string,
  entry: Entry | null,
  locale: string | null,
) => {
  if (!entry || !locale) return null;
  const variables = {
    entry,
    locale,
  };

  return buildTemplate({ template: pattern, context: variables });
};

function getValue(obj, path) {
  return path
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.')
    .reduce((o, k) => (o || {})[k], obj);
}

export function addLocale(str: string, locale: string): string {
  const fieldsIndicator = 'fields';
  const fieldsIndex = str.indexOf(fieldsIndicator);
  if (fieldsIndex !== -1) {
    const dotIndex = str.indexOf('.', fieldsIndex + fieldsIndicator.length + 1); // +1 for '.'
    if (dotIndex !== -1) {
      return str.slice(0, dotIndex + 1) + locale + '.' + str.slice(dotIndex + 1);
    }
  }

  return str;
}

export function getTemplateValue(
  ctx: { entry: Entry; locale: string },
  path: string,
): string | (() => string) {
  const pathWithLocale = addLocale(path, ctx.locale);
  const retrievedValue = getValue(ctx, pathWithLocale) as string | Record<string, string>;

  return typeof retrievedValue === 'object' && retrievedValue !== null
    ? retrievedValue[ctx.locale]!
    : retrievedValue;
}

export function buildTemplate({
  template,
  context,
}: {
  template: string;
  context: { entry: Entry; locale: string };
}): string {
  const localeVariable = /{\s*locale\s*}/g;
  // e.g. "{ page.sys.id }"
  const variables = /{\s*([\S]+?)\s*}/g;

  return (
    template
      // first replace the locale pattern
      .replace(localeVariable, context.locale)
      // then resolve the remaining variables
      .replace(variables, (_, path: string) => {
        const fallback = path + '_NOT_FOUND';
        const value = getTemplateValue(context, path) ?? fallback;

        // using _.result didn't gave proper results so we run our own version of it
        return String(typeof value === 'function' ? value() : value);
      })
  );
}
