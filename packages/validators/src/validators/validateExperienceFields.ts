import { type SchemaVersions } from '../types';
import { ValidatorReturnValue } from './ValidatorReturnValue';
import { Schema_2023_09_28 } from '../schemas';
import { zodToContentfulError, CodeNames } from '../utils/zodToContentfulError';

const VERSION_SCHEMAS = {
  '2023-09-28': Schema_2023_09_28,
};

/**
 *
 * @param experience The experience entry to validate
 * @param schemaVersionOverride Optional override for the schema version to validate against. By default the schema version is read from the experience entry
 * @returns object with success property and optional errors array
 */
export const validateExperienceFields = (
  experience: any,
  schemaVersionOverride?: SchemaVersions,
): ValidatorReturnValue => {
  let schemaVersion;
  if (experience.fields.componentTree) {
    const locale = Object.keys(experience.fields.componentTree)[0];
    schemaVersion = experience.fields.componentTree[locale].schemaVersion;
  }
  const schema = VERSION_SCHEMAS[schemaVersionOverride || schemaVersion];

  if (!schema) {
    return {
      success: false,
      errors: [
        {
          name: schemaVersion ? CodeNames.In : CodeNames.Required,
          expected: ['2023-09-28'],
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
    componentTree: experience.fields.componentTree,
    dataSource: experience.fields.dataSource,
    unboundValues: experience.fields.unboundValues,
    usedComponents: experience.fields.usedComponents,
    componentSettings: experience.fields.componentSettings,
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
