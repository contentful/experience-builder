import React, { useCallback, useEffect, useState, Suspense } from 'react';

const VisualEditor = React.lazy(() => import('./blocks/VisualEditor'));
import {
  VisualEditorMode,
  isDeprecatedExperience,
  supportedModes,
} from '@contentful/experience-builder-core';
import { EntityStore } from './core/preview/EntityStore';
import type {
  DeprecatedExperience,
  Experience,
  InternalSDKMode,
} from '@contentful/experience-builder-core/types';
import { validateExperienceBuilderConfig } from './utils/validation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DeprecatedPreviewDeliveryRoot } from './blocks/preview/DeprecatedPreviewDeliveryRoot';
import { PreviewDeliveryRoot } from './blocks/preview/PreviewDeliveryRoot';

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
          <VisualEditor mode={mode} initialLocale={locale} visualEditorMode={visualEditorMode} />
        </Suspense>
      </ErrorBoundary>
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
