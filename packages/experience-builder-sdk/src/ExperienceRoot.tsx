import React from 'react';
import { createExperience, VisualEditorMode } from '@contentful/experiences-core';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';
import { ExperienceCanvasDetection } from './ExperienceCanvasDetection';
import VisualEditorClientInitialization from './blocks/editor/VisualEditorClientInitialization';
import VisualEditorRoot from './blocks/editor/VisualEditorRoot';

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
  visualEditorMode?: VisualEditorMode;
};

export const ExperienceRoot = ({ locale, experience }: ExperienceRootProps) => {
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  const initialEntities = experienceObject?.entityStore?.entities || [];

  const editorRoot = (
    <VisualEditorClientInitialization initialEntities={initialEntities} initialLocale={locale}>
      <VisualEditorRoot experience={experience} />
    </VisualEditorClientInitialization>
  );

  const deliveryRoot = <PreviewDeliveryRoot locale={locale} experience={experience} />;

  return (
    <ExperienceCanvasDetection
      locale={locale}
      editorRoot={editorRoot}
      deliveryRoot={deliveryRoot}
    />
  );
};
