'use client';
import React, { Suspense } from 'react';
import { useInitializeVisualEditor } from '../../hooks/useInitializeVisualEditor';
import { ErrorBoundary } from '../../components/ErrorBoundary';

type VisualEditorClientInitializationProps = {
  initialLocale: string;
  children: JSX.Element;
};

export const VisualEditorClientInitialization: React.FC<VisualEditorClientInitializationProps> = ({
  initialLocale,
  children,
}) => {
  useInitializeVisualEditor({
    initialLocale,
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorClientInitialization;
