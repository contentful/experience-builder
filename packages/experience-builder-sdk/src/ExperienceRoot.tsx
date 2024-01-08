import React, { useCallback, useState } from 'react';
import {
  VisualEditorMode,
  isDeprecatedExperience,
  supportedModes,
} from '@contentful/experience-builder-core';
import { EntityStore } from '@contentful/experience-builder-core';
import type {
  DeprecatedExperience,
  Experience,
  InternalSDKMode,
} from '@contentful/experience-builder-core/types';
import { validateExperienceBuilderConfig } from './utils/validation';
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
  const [mode, setMode] = useState<InternalSDKMode>(() => {
    if (!experience) {
      if (typeof window !== 'undefined' && window !== window.parent) {
        return 'editor';
      }
      return 'delivery';
    }

    if (supportedModes.includes(experience.mode)) {
      return experience.mode;
    }

    if (inIframe()) {
      return 'editor';
    }

    throw new Error(
      `Unsupported mode provided: ${experience.mode}. Supported values: ${supportedModes}`
    );
  });

  const switchToEditorMode = useCallback(() => {
    console.debug(`[exp-builder.sdk] Switching from ${mode} to editor mode.`);
    setMode('editor');
  }, [mode]);

  validateExperienceBuilderConfig({
    locale,
    mode,
  });

  if (mode === 'editor') {
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
        mode={mode}
        switchToEditorMode={switchToEditorMode}
        locale={locale}
        slug={slug}
      />
    );
  }

  return (
    <PreviewDeliveryRoot
      locale={locale}
      mode={mode}
      switchToEditorMode={switchToEditorMode}
      experience={experience}
    />
  );
};
