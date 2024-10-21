import { ComponentDefinitionSchema } from '../schemas';
import { ValidatorReturnValue } from './ValidatorReturnValue';
import { zodToContentfulError } from '../utils/zodToContentfulError';

export const validateComponentDefinition = (definition): ValidatorReturnValue => {
  const result = ComponentDefinitionSchema.safeParse(definition);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map(zodToContentfulError),
    };
  }
  return { success: true };
};
