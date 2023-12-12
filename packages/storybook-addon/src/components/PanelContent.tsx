import React, { useMemo } from 'react';
import { Tabs } from '@contentful/f36-components';
import { styles } from './ExperienceBuilder.styles';
import { useParameter } from '@storybook/manager-api';
import { PARAM_KEY } from 'src/constants';
import { ComponentDefinition } from '@contentful/experience-builder';
import { StylesTab } from './StylesTab';
import { ContentTab } from './ContentTab';
import { Workbench } from '@contentful/f36-workbench';
import { cx } from 'emotion';
import { enrichComponentDefinition } from '@/utils/definitions';

interface PanelContentProps {}

/**
 * Checkout https://github.com/storybookjs/storybook/blob/next/code/addons/jest/src/components/Panel.tsx
 * for a real world example
 */
export const PanelContent: React.FC<PanelContentProps> = () => {
  const componentDefinition = useParameter<ComponentDefinition | null>(PARAM_KEY, null);

  const enrichedComponentDefinition = useMemo(() => {
    if (!componentDefinition) return null;

    return enrichComponentDefinition(componentDefinition);
  }, [componentDefinition]);

  return (
    <Workbench.Sidebar position="right" className={cx(styles.sidebar, styles.componentSidebar)}>
      <div style={{ maxWidth: '420px', flex: 1 }}>
        <Tabs defaultTab="design" className={styles.componentTabs}>
          <Tabs.List className={styles.tabList}>
            <Tabs.Tab className={styles.componentIndividualTab} panelId="design">
              Design
            </Tabs.Tab>
            <Tabs.Tab className={styles.componentIndividualTab} panelId="content">
              Content
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel id="design" className={styles.tabPanel}>
            <StylesTab componentDefinition={enrichedComponentDefinition} />
          </Tabs.Panel>
          <Tabs.Panel id="content" className={styles.tabPanel}>
            <ContentTab componentDefinition={enrichedComponentDefinition} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </Workbench.Sidebar>
  );
};
