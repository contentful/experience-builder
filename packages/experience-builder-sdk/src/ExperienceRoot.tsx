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
import { useDetectReadOnlyMode } from './hooks/useDetectReadOnlyMode';
import ReadOnlyModeRoot from './blocks/readOnlyMode/ReadOnlyModeRoot';

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
  visualEditorMode?: VisualEditorMode;
};

export const ExperienceRoot = ({
  locale,
  experience,
  visualEditorMode = VisualEditorMode.LazyLoad,
}: ExperienceRootProps) => {
  const isEditorMode = useDetectEditorMode();
  const isReadOnlyMode = useDetectReadOnlyMode();
  //If experience is passed in as a JSON string, recreate it to an experience object
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  validateExperienceBuilderConfig({
    locale,
    isEditorMode,
  });

  // console.log('[ <ExperienceRoot> ] isReadOnlyMode => ', isReadOnlyMode);

  // if (isReadOnlyMode) {
  //   return (
  //     // inject visualEditorMode
  //     <ReadOnlyModeRoot experience={experience} visualEditorMode={visualEditorMode} />
  //   );
  // }

  if (isEditorMode) {
    return (
      <VisualEditorRoot
        experience={experienceObject as Experience<EntityStore> | undefined}
        visualEditorMode={visualEditorMode}
        initialLocale={locale}
      />
    );
  }

  if (!experienceObject) return null;

  return <PreviewDeliveryRoot locale={locale} experience={experienceObject} />;
};
