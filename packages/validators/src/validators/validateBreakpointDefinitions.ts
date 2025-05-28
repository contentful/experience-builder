import { z } from 'zod';
import { BreakpointSchema, breakpointsRefinement } from '../schemas/latest';
import { ValidatorReturnValue } from './ValidatorReturnValue';
import { zodToContentfulError } from '@/utils/zodToContentfulError';

export const validateBreakpointsDefinition = (breakpoints): ValidatorReturnValue => {
  const result = z
    .array(BreakpointSchema)
    .superRefine(breakpointsRefinement)
    .safeParse(breakpoints);
  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map(zodToContentfulError),
    };
  }
  return { success: true };
};
