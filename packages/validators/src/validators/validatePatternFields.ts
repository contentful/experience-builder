import { type SchemaVersions } from '../types';
import { ValidatorReturnValue } from './ValidatorReturnValue';
import { PatternSchema_2023_09_28 } from '../schemas';
import { zodToContentfulError, CodeNames } from '@/utils/zodToContentfulError';

const VERSION_SCHEMAS = {
  '2023-09-28': PatternSchema_2023_09_28,
};

/**
 *
 * @param pattern The pattern entry to validate
 * @param schemaVersionOverride Optional override for the schema version to validate against.
 * By default, the schema version is read from the pattern entry
 * @returns object with success property and optional errors array
 */
export const validatePatternFields = (
  // TODO: type this as Entry when the type is exposed
  pattern: any,
  schemaVersionOverride?: SchemaVersions,
): ValidatorReturnValue => {
  let schemaVersion: SchemaVersions | undefined;

  if (schemaVersionOverride) {
    schemaVersion = schemaVersionOverride;
  } else if (pattern.fields.componentTree) {
    const locale = Object.keys(pattern.fields.componentTree)[0];
    schemaVersion = pattern.fields.componentTree[locale].schemaVersion;
  }

  const schema = schemaVersion && VERSION_SCHEMAS[schemaVersion];

  if (!schema) {
    return {
      success: false,
      errors: [
        {
          name: schemaVersion ? CodeNames.In : CodeNames.Required,
          expected: Object.keys(VERSION_SCHEMAS),
          value: schemaVersion,
          path: ['fields', 'componentTree', 'schemaVersion'],
          details: schemaVersion
            ? 'Unsupported schema version'
            : 'The property "schemaVersion" is required here',
        },
      ],
    };
  }

  const fieldsToValidate = {
    componentTree: pattern.fields.componentTree,
    dataSource: pattern.fields.dataSource,
    unboundValues: pattern.fields.unboundValues,
    usedComponents: pattern.fields.usedComponents,
    componentSettings: pattern.fields.componentSettings,
  };

  const result = schema.safeParse(fieldsToValidate);
  if (!result.success) {
    return {
      success: result.success,
      errors: result.error.issues.map(zodToContentfulError),
    };
  }
  return { success: true };
};
