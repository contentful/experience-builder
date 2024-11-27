import React from 'react';
import { RootRenderer } from './RootRenderer/RootRenderer';
import { VisualEditorClientWrapper } from './VisualEditorClientWrapper';

export const VisualEditorRoot = () => {
  return (
    <VisualEditorClientWrapper>
      <RootRenderer />
    </VisualEditorClientWrapper>
  );
};
