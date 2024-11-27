'use client';
// Need 'use client' for now since bundling of visual editor pkg and lazy loading
// it in results in the bundle having client code mixed into it
// todo: update build config of visual editor to work with server components

import React, { Suspense } from 'react';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const VisualEditorLoader = React.lazy(() => import('@contentful/experiences-visual-editor-react'));

export const VisualEditorRoot: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <VisualEditorLoader />
      </Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorRoot;
