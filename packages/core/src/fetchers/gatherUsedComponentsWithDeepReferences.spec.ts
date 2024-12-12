import { experienceEntryFieldsWithFilledUsedComponents } from '../test/__fixtures__/experience';
import { gatherUsedComponentsWithDeepRefernces } from './gatherUsedComponentsWithDeepReferences';

describe('fetchReferencedEntities gatherUsedComponentsWithDeepRefernces', () => {
  it('should return an empty array if no used components are found', async () => {
    const usedComponents = gatherUsedComponentsWithDeepRefernces(undefined);

    expect(usedComponents).toEqual([]);
  });

  it('should return an array of used components with deep references', async () => {
    const usedComponents = gatherUsedComponentsWithDeepRefernces(
      experienceEntryFieldsWithFilledUsedComponents,
    );

    expect(usedComponents[0].sys.id).toEqual('root-pattern-1');
    expect(usedComponents[1].sys.id).toEqual('nested-pattern-1');
  });
});
