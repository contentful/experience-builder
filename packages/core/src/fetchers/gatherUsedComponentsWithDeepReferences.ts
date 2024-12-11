import { ExperienceEntry, ExperienceFields } from '@/types';
export const gatherUsedComponentsWithDeepRefernces = (
  experienceEntryFields?: ExperienceFields,
): ExperienceEntry[] => {
  const usedComponentdeepReferences: ExperienceEntry[] = [];
  const usedComponents = experienceEntryFields?.usedComponents as ExperienceEntry[];
  if (!usedComponents || usedComponents.length === 0) {
    return [];
  }
  for (const component of usedComponents) {
    if ('fields' in component) {
      usedComponentdeepReferences.push(component);
      usedComponentdeepReferences.push(...gatherUsedComponentsWithDeepRefernces(component.fields));
    }
  }
  return usedComponentdeepReferences;
};
