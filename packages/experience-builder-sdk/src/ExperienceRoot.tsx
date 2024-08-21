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
import { store } from '@contentful/experiences-core';

type ExperienceRootProps<T = unknown> = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
  visualEditorMode?: VisualEditorMode;
  initialStore?: T;
};

export const ExperienceRoot = ({
  locale,
  experience,
  visualEditorMode = VisualEditorMode.LazyLoad,
  initialStore,
}: ExperienceRootProps) => {
  const isEditorMode = useDetectEditorMode();
  //If experience is passed in as a JSON string, recreate it to an experience object
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  validateExperienceBuilderConfig({
    locale,
    isEditorMode,
  });

  store.makeStore(initialStore);

  if (isEditorMode) {
    return (
      <VisualEditorRoot
        initialStore={initialStore}
        experience={experienceObject as Experience<EntityStore> | undefined}
        visualEditorMode={visualEditorMode}
        initialLocale={locale}
      />
    );
  }

  if (!experienceObject) return null;

  return <PreviewDeliveryRoot locale={locale} experience={experienceObject} />;
};
