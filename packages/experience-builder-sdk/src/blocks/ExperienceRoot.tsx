'use client';
import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';

import { isDeprecatedExperience } from '@contentful/experience-builder-types';
import { EntityStore } from '../core/EntityStore';
import { supportedModes } from '../constants';
import { DeprecatedExperience, Experience, InternalSDKMode } from '../types';
import { validateExperienceBuilderConfig } from '../validation';
import { DeprecatedPreviewDeliveryRoot } from './DeprecatedPreviewDeliveryRoot';
import { PreviewDeliveryRoot } from './PreviewDeliveryRoot';
//import { VisualEditorRoot } from './VisualEditorRoot';

type ExperienceRootProps = {
  experience: Experience<EntityStore> | DeprecatedExperience;
  locale: string;
  /**
   * @deprecated
   */
  slug?: string;
};

export const ExperienceRoot = ({ locale, experience, slug }: ExperienceRootProps) => {
  const [mode, setMode] = useState<InternalSDKMode>(() => {
    if (supportedModes.includes(experience.mode)) {
      return experience.mode;
    }

    throw new Error(
      `Unsupported mode provided: ${experience.mode}. Supported values: ${supportedModes}`
    );
  });

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
    const VisualEditorRoot = lazy(() => import('../blocks/VisualEditorRoot'));
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <VisualEditorRoot initialLocale={locale} mode={mode} />;
      </Suspense>
    );
  }

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
