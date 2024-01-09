import fs from 'fs';
import { validateExperienceFieldsZod, validateExperienceFieldsJSONSchema } from './validators';

const experiencePath = 'fixtures/experience.json';
const experienceJSON = JSON.parse(fs.readFileSync(experiencePath, 'utf-8'));

console.log('Validating experience using JSON Schema...');
const result = validateExperienceFieldsJSONSchema(experienceJSON);
console.log('Result: ', result);

console.log('Validating experience using Zod library...');
const resultZod = validateExperienceFieldsZod(experienceJSON);
console.log('Result: ', resultZod);
