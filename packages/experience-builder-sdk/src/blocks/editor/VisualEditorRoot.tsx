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

const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({
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
    <Suspense fallback={<div>Loading...</div>}>
      <VisualEditorLoader
        experience={experience}
        visualEditorMode={visualEditorMode}
        canvasMode={canvasMode}
      />
    </Suspense>
  );
};

const VisualEditorRootWithErrorBoundary: React.FC<VisualEditorRootProps> = (props) => {
  return (
    <ErrorBoundary>
      <VisualEditorRoot {...props} />
    </ErrorBoundary>
  );
};

export default VisualEditorRootWithErrorBoundary;
