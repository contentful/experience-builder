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
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({
  visualEditorMode,
  experience,
  initialLocale,
}) => {
  const initialEntities = experience?.entityStore?.entities || [];

  const experienceEntry = useInitializeVisualEditor({
    initialLocale,
    initialEntities,
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <VisualEditorLoader
          experience={experience}
          experienceEntry={experienceEntry}
          visualEditorMode={visualEditorMode}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
