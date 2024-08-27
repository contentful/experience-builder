import React, { Suspense } from 'react';
import { EntityStore, VisualEditorMode } from '@contentful/experiences-core';
import {} from '@contentful/experiences-read-only-mode-react';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useInitializeVisualEditor } from '../../hooks/useInitializeVisualEditor';

import type { Experience } from '@contentful/experiences-core/types';

// const VisualEditorLoader = React.lazy(() => import('./ReadOnlyModeLoader'));

type VisualEditorRootProps = {
  experience?: Experience<EntityStore>;
  initialLocale: string;
};

export const ReadOnlyModeRoot: React.FC<VisualEditorRootProps> = ({
  experience,
  initialLocale,
}) => {
  const initialEntities = experience?.entityStore?.entities || [];
  // useReadOnlySubscriber();

  // useInitializeReadOnlyMode({
  //   initialLocale,
  //   initialEntities,
  // });

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}></Suspense>
    </ErrorBoundary>
  );
};

export default ReadOnlyModeRoot;
