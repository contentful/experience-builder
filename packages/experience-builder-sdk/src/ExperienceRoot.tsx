import React from 'react';
import { VisualEditorMode, validateExperienceBuilderConfig } from '@contentful/experiences-core';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';
import VisualEditorRoot from './blocks/editor/VisualEditorRoot';
import { useDetectEditorMode } from './hooks/useDetectEditorMode';

type ExperienceRootProps = {
  experience?: Experience<EntityStore>;
  locale: string;
  visualEditorMode?: VisualEditorMode;
};

export const ExperienceRoot = ({
  locale,
  experience,
  visualEditorMode = VisualEditorMode.LazyLoad,
}: ExperienceRootProps) => {
  const isEditorMode = useDetectEditorMode();

  validateExperienceBuilderConfig({
    locale,
    isEditorMode,
  });

  if (isEditorMode) {
    const entityStore = experience?.entityStore;
    return (
      <VisualEditorRoot
        visualEditorMode={visualEditorMode}
        initialEntities={entityStore?.entities || []}
        initialLocale={locale}
      />
    );
  }

  if (!experience) return null;

  return <PreviewDeliveryRoot locale={locale} experience={experience} />;
};
