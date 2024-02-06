import React, { useCallback, useState } from 'react';
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

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | DeprecatedExperience;
  locale: string;
  /**
   * @deprecated
   */
  slug?: string;
  visualEditorMode?: VisualEditorMode;
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return false;
  }
}

export const ExperienceRoot = ({
  locale,
  experience,
  slug,
  visualEditorMode = VisualEditorMode.LazyLoad,
}: ExperienceRootProps) => {
  const [isEditorMode, setIsEditorMode] = useState(() => {
    if (inIframe()) {
      return true;
    }
    return false;
  });

  const switchToEditorMode = useCallback(() => {
    console.debug(`[exp-builder.sdk] Switching to editor mode.`);
    setIsEditorMode(true);
  }, []);

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
        switchToEditorMode={switchToEditorMode}
        locale={locale}
        slug={slug}
      />
    );
  }

  return (
    <PreviewDeliveryRoot
      locale={locale}
      switchToEditorMode={switchToEditorMode}
      experience={experience}
    />
  );
};
