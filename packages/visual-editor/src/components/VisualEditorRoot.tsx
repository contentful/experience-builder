import React from 'react';
import { createExperience, EntityStore } from '@contentful/experiences-core';
import { RootRenderer } from './RootRenderer/RootRenderer';
import type { Experience } from '@contentful/experiences-core/types';
import { VisualEditorClientWrapper } from './VisualEditorClientWrapper';

export const VisualEditorRoot = ({
  experienceObject,
}: {
  experienceObject?: Experience<EntityStore> | string | null;
}) => {
  const experience =
    typeof experienceObject === 'string' ? createExperience(experienceObject) : experienceObject;

  if (!experience) return null;

  return (
    <VisualEditorClientWrapper experienceObject={experienceObject}>
      <RootRenderer />
    </VisualEditorClientWrapper>
  );
};
