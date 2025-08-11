import React, { Suspense } from 'react';
import { EntityStore, VisualEditorMode } from '@contentful/experiences-core';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useInitializeVisualEditor } from '../../hooks/useInitializeVisualEditor';
import type { Experience } from '@contentful/experiences-core/types';
import type { StudioCanvasMode } from '@contentful/experiences-core/constants';

const VisualEditorLoader = React.lazy(() => import('./VisualEditorLoader'));

type VisualEditorRootProps = {
  visualEditorMode: VisualEditorMode;
  canvasMode?: StudioCanvasMode;
  experience?: Experience<EntityStore>;
  initialLocale: string;
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({
  visualEditorMode,
  canvasMode,
  experience,
  initialLocale,
}) => {
  const initialEntities = experience?.entityStore?.entities || [];

  useInitializeVisualEditor({
    initialLocale,
    initialEntities,
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <VisualEditorLoader
          experience={experience}
          visualEditorMode={visualEditorMode}
          canvasMode={canvasMode}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
