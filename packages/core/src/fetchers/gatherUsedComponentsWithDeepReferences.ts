import { ExperienceEntry, ExperienceFields } from '@/types';
export const gatherUsedComponentsWithDeepRefernces = (
  experienceEntryFields?: ExperienceFields,
): ExperienceEntry[] => {
  const usedComponentDeepReferences: ExperienceEntry[] = [];
  const usedComponents = experienceEntryFields?.usedComponents as ExperienceEntry[];
  if (!usedComponents || usedComponents.length === 0) {
    return [];
  }
  for (const component of usedComponents) {
    if ('fields' in component) {
      usedComponentDeepReferences.push(component);
      usedComponentDeepReferences.push(...gatherUsedComponentsWithDeepRefernces(component.fields));
    }
  }
  return usedComponentDeepReferences;
};
