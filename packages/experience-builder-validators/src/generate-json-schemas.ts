import { ExperienceFieldsSchema } from './schemas';
import { zodToJsonSchema } from 'zod-to-json-schema';
import fs from 'fs';

const jsonSchema = zodToJsonSchema(ExperienceFieldsSchema);

fs.writeFileSync(
  `${__dirname}/../generated/jsonschemas/experience.json`,
  JSON.stringify(jsonSchema, null, 4),
  {
    encoding: 'utf-8',
  }
);
