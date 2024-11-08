'use client';
import React from 'react';
import { validateExperienceBuilderConfig } from '@contentful/experiences-core';
import { EntityStore } from '@contentful/experiences-core';
import type { Experience } from '@contentful/experiences-core/types';
import { useDetectCanvasMode } from './hooks/useDetectCanvasMode';
import { StudioCanvasMode } from '@contentful/experiences-core/constants';

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | string | null;
  locale: string;
  editorRoot: JSX.Element | null;
  deliveryRoot: JSX.Element | null;
};

export const ExperienceCanvasDetection: React.FC<ExperienceRootProps> = ({
  locale,
  editorRoot,
  deliveryRoot,
}) => {
  const mode = useDetectCanvasMode();

  validateExperienceBuilderConfig({
    locale,
    mode,
  });

  if (mode === StudioCanvasMode.EDITOR) {
    return editorRoot;
  }

  if (mode === StudioCanvasMode.READ_ONLY) {
    return editorRoot;
  }

  return deliveryRoot;
};
