import { Schema_2023_09_28 } from './schemas';
import { z } from 'zod';

const VERSION_SCHEMAS = {
  '2023-09-28': Schema_2023_09_28,
};

export const validateExperienceFields = (
  experience: any,
  schemaVersion: '2023-09-28'
): z.SafeParseReturnType<any, any> => {
  const schema = VERSION_SCHEMAS[schemaVersion];

  if (!schema) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: z.ZodIssueCode.invalid_literal,
          expected: '2023-09-28',
          received: schemaVersion,
          path: ['fields', 'componentTree', 'schemaVersion'],
          message: 'Unsupported schema version',
        },
      ]),
    };
  }

  const fieldsToValidate = {
    componentTree: experience.fields.componentTree,
    dataSource: experience.fields.dataSource,
    unboundValues: experience.fields.unboundValues,
    usedComponents: experience.fields.usedComponents,
    componentSettings: experience.fields.componentSettings,
  };

  return schema.safeParse(fieldsToValidate);
};
