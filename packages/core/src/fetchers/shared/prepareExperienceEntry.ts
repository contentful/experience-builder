import { ExperienceEntry } from '@/types';
import {
  removeCircularPatternReferences,
  removeSelfReferencingDataSource,
} from './circularityCheckers';

/**
 * Run additional checks on the references used in the experience entry and
 * process data required for prebinding. This must be used after fetching an
 * experience entry.
 *
 * The changes made to the passed experience entry are done inplace.
 **/
export const prepareExperienceEntry = (experienceEntry: ExperienceEntry) => {
  removeCircularPatternReferences(experienceEntry);
  removeSelfReferencingDataSource(experienceEntry);
};
