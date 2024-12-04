'use client';
// Need 'use client' for now since bundling of visual editor pkg and lazy loading
// it in results in the bundle having client code mixed into it
// todo: update build config of visual editor to work with server components

import React, { Suspense } from 'react';
import { EntityStore } from '@contentful/experiences-core';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import type { Experience } from '@contentful/experiences-core/types';

const VisualEditorLoader = React.lazy(() => import('@contentful/experiences-visual-editor-react'));

type VisualEditorRootProps = {
  experience?: Experience<EntityStore> | string | null;
};

export const VisualEditorRoot: React.FC<VisualEditorRootProps> = ({ experience }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <VisualEditorLoader experienceObject={experience} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
