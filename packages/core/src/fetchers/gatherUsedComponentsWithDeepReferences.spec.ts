import { ExperienceEntry } from '@/types';
import { experienceEntryFieldsWithFilledUsedComponents } from '../test/__fixtures__/experience';
import { gatherUsedComponentsWithDeepRefernces } from './gatherUsedComponentsWithDeepReferences';

describe('fetchReferencedEntities gatherUsedComponentsWithDeepRefernces', () => {
  it('should return an empty array if no used components are found', async () => {
    const usedComponents = gatherUsedComponentsWithDeepRefernces({
      parentComponents: new Set(),
    });

    expect(usedComponents).toEqual([]);
  });

  it('should return an array of used components with deep references', async () => {
    const usedComponents = gatherUsedComponentsWithDeepRefernces({
      experienceEntryFields: experienceEntryFieldsWithFilledUsedComponents,
      parentComponents: new Set(['root-experience-1']),
    });

    expect(usedComponents[0].sys.id).toEqual('root-pattern-1');
    expect(usedComponents[1].sys.id).toEqual('nested-pattern-1');
  });

  it('should bail when detecting a circular dependencies', async () => {
    const circularExperienceFields = structuredClone(experienceEntryFieldsWithFilledUsedComponents);
    const patternLevel1 = circularExperienceFields.usedComponents![0] as ExperienceEntry;
    const patternLevel2 = patternLevel1.fields.usedComponents![0] as ExperienceEntry;
    patternLevel2.fields.usedComponents = [patternLevel1];

    const usedComponents = gatherUsedComponentsWithDeepRefernces({
      experienceEntryFields: circularExperienceFields,
      parentComponents: new Set(['root-experience-1']),
    });
    expect(usedComponents[0].sys.id).toEqual('root-pattern-1');
    expect(usedComponents[1].sys.id).toEqual('nested-pattern-1');
  });
});
