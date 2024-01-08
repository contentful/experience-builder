import React, { Suspense } from 'react';
import { VisualEditorMode } from '@contentful/experience-builder-core';
import { EntityStore } from '@contentful/visual-sdk';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useInitializeVisualEditor } from '../../hooks/useInitializeVisualEditor';

const VisualEditorLoader = React.lazy(() => import('./VisualEditorLoader'));

type VisualEditorRootProps = {
  visualEditorMode: VisualEditorMode;
  initialEntities: EntityStore['entities'];
  initialLocale: string;
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({
  visualEditorMode,
  initialEntities,
  initialLocale,
}) => {
  useInitializeVisualEditor({
    initialLocale,
    initialEntities,
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <VisualEditorLoader visualEditorMode={visualEditorMode} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
