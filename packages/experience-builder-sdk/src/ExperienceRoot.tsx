import React, { useCallback, useEffect, useState } from 'react';

import { isDeprecatedExperience } from '@contentful/experience-builder-types';
import { EntityStore } from './core/preview/EntityStore';
import { supportedModes } from './constants';
import { DeprecatedExperience, Experience, InternalSDKMode } from './types';
import { validateExperienceBuilderConfig } from './utils/validation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DeprecatedPreviewDeliveryRoot } from './blocks/preview/DeprecatedPreviewDeliveryRoot';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';
import { VisualEditorRoot } from './blocks/editor/VisualEditorRoot';

type ExperienceRootProps = {
  experience?: Experience<EntityStore> | DeprecatedExperience;
  locale: string;
  /**
   * @deprecated
   */
  slug?: string;
};

export const ExperienceRoot = ({ locale, experience, slug }: ExperienceRootProps) => {
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

    throw new Error(
      `Unsupported mode provided: ${experience.mode}. Supported values: ${supportedModes}`
    );
  });

  console.log('mode', mode);

  useEffect(() => {
    if (supportedModes.includes(mode)) {
      setMode(mode);
    }
  }, [mode]);

  const switchToEditorMode = useCallback(() => {
    setMode('editor');
  }, []);

  validateExperienceBuilderConfig({
    locale,
    mode,
  });

  if (!mode || !supportedModes.includes(mode)) return null;

  if (mode === 'editor') {
    return (
      <ErrorBoundary>
        <VisualEditorRoot initialLocale={locale} mode={mode} />
      </ErrorBoundary>
    );
  }

  if (!experience) return null;

  if (isDeprecatedExperience(experience)) {
    return (
      <DeprecatedPreviewDeliveryRoot
        deprecatedExperience={experience}
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
