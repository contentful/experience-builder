'use client';
import React from 'react';
import {
  VisualEditorMode,
  createExperience,
  validateExperienceBuilderConfig,
  debug as cfDebug,
  entityCacheStore,
} from '@contentful/experiences-core';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';
import VisualEditorRoot from './blocks/editor/VisualEditorRoot';
import { useDetectCanvasMode } from './hooks/useDetectCanvasMode';
import { StudioCanvasMode } from '@contentful/experiences-core/constants';

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
  visualEditorMode?: VisualEditorMode;
  /** Enables extra logging in the SDK to support troubleshooting.
   *  This option is not recommended for production environments as it
   *  will result in too many unnecessary logs being produced during runtime.
   *  Default: false
   */
  debug?: boolean;
};

export const ExperienceRoot = ({
  locale,
  experience,
  visualEditorMode = VisualEditorMode.LazyLoad,
  debug,
}: ExperienceRootProps) => {
  const mode = useDetectCanvasMode();

  if (typeof debug === 'boolean') {
    cfDebug.setEnabled(debug);
  }

  //If experience is passed in as a JSON string, recreate it to an experience object
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  validateExperienceBuilderConfig({
    locale,
    mode,
  });

  if (mode === StudioCanvasMode.EDITOR || mode === StudioCanvasMode.READ_ONLY) {
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
