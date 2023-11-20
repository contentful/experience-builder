import React, { useCallback, useEffect, useState, Suspense } from 'react';

const VisualEditor = React.lazy(() => import('./blocks/VisualEditor'));

import { isDeprecatedExperience } from '@contentful/experience-builder-types';
import { EntityStore } from './core/preview/EntityStore';
import { supportedModes } from './constants';
import { DeprecatedExperience, Experience, InternalSDKMode } from './types';
import { validateExperienceBuilderConfig } from './utils/validation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DeprecatedPreviewDeliveryRoot } from './blocks/preview/DeprecatedPreviewDeliveryRoot';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';

type ExperienceRootProps = {
  experience: Experience<EntityStore> | DeprecatedExperience;
  locale: string;
  /**
   * @deprecated
   */
  slug?: string;
};

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export const ExperienceRoot = ({ locale, experience, slug }: ExperienceRootProps) => {
  const [mode, setMode] = useState<InternalSDKMode>(() => {
    if (inIframe()) {
      return 'editor';
    }

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
    return (
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <VisualEditor mode={mode} initialLocale={locale} />
        </Suspense>
      </ErrorBoundary>
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
