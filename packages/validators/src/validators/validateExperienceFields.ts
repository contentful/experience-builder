import { type SchemaVersions } from '../types';
import { ValidatorReturnValue } from './ValidatorReturnValue';
import { ExperienceSchema_2023_09_28 } from '../schemas';
import { zodToContentfulError, CodeNames } from '@/utils/zodToContentfulError';
import { validatePatternFields } from '@/validators/validatePatternFields';

const VERSION_SCHEMAS = {
  '2023-09-28': ExperienceSchema_2023_09_28,
};

// TODO: fix typing when the Entry type is exposed
function isPattern(experience: any): boolean {
  return experience.fields.componentSettings !== undefined;
}

/**
 *
 * @param experience The experience entry to validate
 * @param schemaVersionOverride Optional override for the schema version to validate against.
 * By default, the schema version is read from the experience entry
 * @returns object with success property and optional errors array
 */
export const validateExperienceFields = (
  // TODO: type this as Entry when the type is exposed
  experience: any,
  schemaVersionOverride?: SchemaVersions,
): ValidatorReturnValue => {
  // If this is a pattern, use the pattern validator
  if (isPattern(experience)) {
    return validatePatternFields(experience, schemaVersionOverride);
  }

  let schemaVersion: SchemaVersions | undefined;
  if (schemaVersionOverride) {
    schemaVersion = schemaVersionOverride;
  } else if (experience.fields.componentTree) {
    const locale = Object.keys(experience.fields.componentTree)[0];
    schemaVersion = experience.fields.componentTree[locale].schemaVersion;
  }

  const schema = schemaVersion && VERSION_SCHEMAS[schemaVersion];

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
