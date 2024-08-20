'use client';
import React from 'react';
import {
  VisualEditorMode,
  createExperience,
  validateExperienceBuilderConfig,
} from '@contentful/experiences-core';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';
import VisualEditorRoot from './blocks/editor/VisualEditorRoot';
import { useDetectEditorMode } from './hooks/useDetectEditorMode';

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
  visualEditorMode?: VisualEditorMode;
  metadata: Record<string, any>;
};

export const ExperienceRoot = ({
  locale,
  experience,
  visualEditorMode = VisualEditorMode.LazyLoad,
  metadata,
}: ExperienceRootProps) => {
  const isEditorMode = useDetectEditorMode();
  //If experience is passed in as a JSON string, recreate it to an experience object
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  validateExperienceBuilderConfig({
    locale,
    isEditorMode,
  });

  if (isEditorMode) {
    return (
      <VisualEditorRoot
        experience={experienceObject as Experience<EntityStore> | undefined}
        visualEditorMode={visualEditorMode}
        initialLocale={locale}
        metadata={metadata}
      />
    );
  }

  if (!experienceObject) return null;

  return <PreviewDeliveryRoot metadata={metadata} locale={locale} experience={experienceObject} />;
};
