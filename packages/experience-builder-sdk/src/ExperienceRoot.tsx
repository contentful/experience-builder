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
import { useDetectMode } from './hooks/useDetectMode';
import { StudioExperienceMode } from '@contentful/experiences-core/constants';

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
  const mode = useDetectMode();

  console.log('[ SDK ] <ExpRoot> mode => ', mode);

  //If experience is passed in as a JSON string, recreate it to an experience object
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  validateExperienceBuilderConfig({
    locale,
    mode,
  });

  if (mode === StudioExperienceMode.EDITOR) {
    return (
      <VisualEditorRoot
        experience={experienceObject as Experience<EntityStore> | undefined}
        visualEditorMode={visualEditorMode}
        initialLocale={locale}
      />
    );
  }

  if (mode === StudioExperienceMode.READ_ONLY) {
    return (
      <>
        <h1>READ ONLY MODE ENABLED!!!!</h1>
        <p>Rendering VisualEditorRoot, (Editor mode) to see actual tree/experience!!!!!</p>
        <p>
          with the understanding that this will be updated with eventually with "read only" visual
          mode.
        </p>
        <VisualEditorRoot
          experience={experienceObject as Experience<EntityStore> | undefined}
          visualEditorMode={visualEditorMode}
          initialLocale={locale}
        />
      </>
    );
  }

  if (!experienceObject) return null;

  return <PreviewDeliveryRoot locale={locale} experience={experienceObject} />;
};
