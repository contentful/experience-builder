import type { ContentfulErrorDetails } from '../utils/zodToContentfulError';

export type ValidatorReturnValue = {
  success: boolean;
  errors?: ContentfulErrorDetails[];
};
