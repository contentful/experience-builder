import React from 'react';
import {
  VisualEditorMode,
  isDeprecatedExperience,
  validateExperienceBuilderConfig,
} from '@contentful/experience-builder-core';
import { EntityStore } from '@contentful/experience-builder-core';
import type { DeprecatedExperience, Experience } from '@contentful/experience-builder-core/types';
import { DeprecatedPreviewDeliveryRoot } from './blocks/preview/DeprecatedPreviewDeliveryRoot';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';
import VisualEditorRoot from './blocks/editor/VisualEditorRoot';
import { useDetectEditorMode } from './hooks/useDetectEditorMode';

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | DeprecatedExperience;
  locale: string;
  /**
   * @deprecated
   */
  slug?: string;
  visualEditorMode?: VisualEditorMode;
};

export const ExperienceRoot = ({
  locale,
  experience,
  slug,
  visualEditorMode = VisualEditorMode.LazyLoad,
}: ExperienceRootProps) => {
  const isEditorMode = useDetectEditorMode();

  validateExperienceBuilderConfig({
    locale,
    isEditorMode,
  });

  if (isEditorMode) {
    const entityStore =
      experience && !isDeprecatedExperience(experience) ? experience.entityStore : undefined;
    return (
      <VisualEditorRoot
        visualEditorMode={visualEditorMode}
        initialEntities={entityStore?.entities || []}
        initialLocale={locale}
      />
    );
  }

  if (!experience) return null;

  if (isDeprecatedExperience(experience)) {
    return (
      <DeprecatedPreviewDeliveryRoot
        deprecatedExperience={experience as DeprecatedExperience}
        locale={locale}
        slug={slug}
      />
    );
  }

  return <PreviewDeliveryRoot locale={locale} experience={experience} />;
};
