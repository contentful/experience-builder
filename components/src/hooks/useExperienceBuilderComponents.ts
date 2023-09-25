import { ComponentRegistration } from '@contentful/experience-builder';
import {
  ExperienceBuilderButton,
  ExperienceBuilderHeading,
  ExperienceBuilderImage,
  ExperienceBuilderRichText,
  ExperienceBuilderText,
} from '../components';
import { useEffect } from 'react';

export function useExperienceBuilderComponents(
  defineComponents: (componentRegistrations: ComponentRegistration[]) => void
) {
  useEffect(() => {
    defineComponents([
      {
        component: ExperienceBuilderButton,
        definition: ExperienceBuilderButton.ComponentDefinition,
      },
      {
        component: ExperienceBuilderRichText,
        definition: ExperienceBuilderRichText.ComponentDefinition,
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
