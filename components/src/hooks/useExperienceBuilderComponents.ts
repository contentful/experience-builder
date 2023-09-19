import { ComponentRegistration } from '@contentful/experience-builder';
import {
  ExperienceBuilderButton,
  ExperienceBuilderHeading,
  ExperienceBuilderImage,
  ExperienceBuilderText,
} from '..';
import { useEffect } from 'react';

export default function useExperienceBuilderComponents(
  defineComponents: (componentRegistrations: ComponentRegistration[]) => void
) {
  useEffect(() => {
    defineComponents([
      {
        component: ExperienceBuilderButton,
        definition: ExperienceBuilderButton.ComponentDefinition,
      },
      {
        component: ExperienceBuilderHeading,
        definition: ExperienceBuilderHeading.ComponentDefinition,
      },
      {
        component: ExperienceBuilderImage,
        definition: ExperienceBuilderImage.ComponentDefinition,
      },
      {
        component: ExperienceBuilderText,
        definition: ExperienceBuilderText.ComponentDefinition,
      },
    ]);
  }, []);
}
