'use client';

import { ExperienceConfiguration, NinetailedProvider } from '@ninetailed/experience.js-react';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import type { ExposedAudienceDefinition } from '@ninetailed/experience.js-preview-bridge';

export const Providers: React.FC<
  React.PropsWithChildren<{
    preview: {
      experiences?: ExperienceConfiguration[];
      audiences?: ExposedAudienceDefinition[];
    };
  }>
> = ({ children, preview }) => {
  const experiences = preview.experiences || [];
  const audiences = preview.audiences || [];

  return (
    <NinetailedProvider
      clientId="8600f622-e6c5-4bea-9c0d-7793c3ddda9c"
      plugins={[new NinetailedPreviewPlugin({ experiences, audiences })]}>
      {children}
    </NinetailedProvider>
  );
};
