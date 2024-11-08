'use client';
import React, { Suspense } from 'react';
import { useInitializeVisualEditor } from '../../hooks/useInitializeVisualEditor';
import { Entry, Asset, ChainModifiers } from 'contentful';
import { ErrorBoundary } from '../../components/ErrorBoundary';

type VisualEditorClientInitializationProps = {
  initialLocale: string;
  initialEntities: (Entry | Asset<ChainModifiers, string>)[];
  children: JSX.Element;
};

export const VisualEditorClientInitialization: React.FC<VisualEditorClientInitializationProps> = ({
  initialEntities,
  initialLocale,
  children,
}) => {
  useInitializeVisualEditor({
    initialLocale,
    initialEntities,
  });

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default VisualEditorClientInitialization;
