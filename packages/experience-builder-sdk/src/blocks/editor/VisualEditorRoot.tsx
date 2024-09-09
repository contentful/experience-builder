import React, { Suspense } from 'react';
import { EntityStore, VisualEditorMode } from '@contentful/experiences-core';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useInitializeVisualEditor } from '../../hooks/useInitializeVisualEditor';
import type { Experience } from '@contentful/experiences-core/types';

const VisualEditorLoader = React.lazy(() => import('./VisualEditorLoader'));

type VisualEditorRootProps = {
  visualEditorMode: VisualEditorMode;
  experience?: Experience<EntityStore>;
  initialLocale: string;

  isReadOnlyMode?: boolean;
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({
  visualEditorMode,
  experience,
  initialLocale,
  isReadOnlyMode,
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
          isReadOnlyMode={isReadOnlyMode}
          visualEditorMode={visualEditorMode}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
