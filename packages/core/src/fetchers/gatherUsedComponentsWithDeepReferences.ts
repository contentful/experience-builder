import { ExperienceEntry, ExperienceFields } from '@/types';
export const gatherUsedComponentsWithDeepRefernces = ({
  experienceEntryFields,
  parentComponents,
}: {
  experienceEntryFields?: ExperienceFields;
  parentComponents: Set<string>;
}): ExperienceEntry[] => {
  const totalUsedComponents: ExperienceEntry[] = [];
  const usedComponents = experienceEntryFields?.usedComponents as ExperienceEntry[];
  if (!usedComponents || usedComponents.length === 0) {
    return [];
  }
  for (const component of usedComponents) {
    if ('fields' in component) {
      totalUsedComponents.push(component);
      if (parentComponents.has(component.sys.id)) {
        continue;
      }

      totalUsedComponents.push(
        ...gatherUsedComponentsWithDeepRefernces({
          experienceEntryFields: component.fields,
          parentComponents: new Set([...parentComponents, component.sys.id]),
        }),
      );
    }
  }
  return totalUsedComponents;
};
