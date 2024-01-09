import Ajv from 'ajv';
import { ExperienceFieldsSchema } from './schemas';
import fs from 'fs';

export const validateExperienceFieldsZod = (fields: any) => {
  const result = ExperienceFieldsSchema.safeParse(fields);
  if (!result.success) {
    return result.error.message;
  }
  return result.data;
};

export const validateExperienceFieldsJSONSchema = (fields: any) => {
  const jsonSchemaPath = 'generated/jsonschemas/experience.json';
  const jsonSchema = JSON.parse(fs.readFileSync(jsonSchemaPath, 'utf-8'));

  const avj = new Ajv({ allErrors: true });
  const validate = avj.compile(jsonSchema);
  const valid = validate(fields);
  if (!valid) {
    return validate.errors;
  } else {
    return fields;
  }
};
