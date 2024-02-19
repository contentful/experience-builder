import { Schema_2023_09_28 } from './schemas';
import { z } from 'zod';
import { ContentfulError, zodToContentfulError } from './utils/zodToContentfulError';

const VERSION_SCHEMAS = {
  '2023-09-28': Schema_2023_09_28,
};

interface ValidatorReturnValue {
  success: boolean;
  errors?: ContentfulError[];
}

export const validateExperienceFields = (
  experience: any,
  schemaVersion: keyof typeof VERSION_SCHEMAS
): ValidatorReturnValue => {
  const schema = VERSION_SCHEMAS[schemaVersion];

  if (!schema) {
    return {
      success: false,
      errors: [
        {
          name: 'in',
          expected: ['2023-09-28'],
          value: schemaVersion,
          path: ['fields', 'componentTree', 'schemaVersion'],
          details: 'Unsupported schema version',
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
  return {
    success: true,
  };
};
