import { Schema_2023_09_28 } from './schemas';

const VERSION_SCHEMAS = {
  '2023-09-28': Schema_2023_09_28,
};

export const validateExperienceFieldsZod = (experience: any, schemaVersion: '2023-09-28') => {
  const schema = VERSION_SCHEMAS[schemaVersion];

  if (!schema) {
    return {
      error: 'Unsupported schema version',
    };
  }

  const fieldsToValidate = {
    componentTree: experience.componentTree,
    dataSource: experience.dataSource,
    unboundValues: experience.unboundValues,
    usedComponents: experience.usedComponents,
    componentSettings: experience.componentSettings,
  };

  return schema.safeParse(fieldsToValidate);
};
