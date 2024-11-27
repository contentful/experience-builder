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
  const editorRoot = (
    <VisualEditorClientInitialization initialLocale={locale}>
      <VisualEditorRoot />
    </VisualEditorClientInitialization>
  );

  const deliveryRoot = <PreviewDeliveryRoot locale={locale} experience={experienceObject} />;

  return (
    <ExperienceCanvasDetection
      locale={locale}
      editorRoot={editorRoot}
      deliveryRoot={deliveryRoot}
    />
  );
};
