import React from 'react';
import { AddonPanel } from '@storybook/components';
import { PanelContent } from './components/PanelContent';

interface PanelProps {
  active: boolean;
}

export const Panel: React.FC<PanelProps> = (props) => {
  return (
    <AddonPanel
      {...props}
      css={{
        height: '100%',
      }}>
      <PanelContent />
    </AddonPanel>
  );
};
