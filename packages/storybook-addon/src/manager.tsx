import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, PANEL_ID } from './constants';

import { Panel } from './Panel';

/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Experience Builder',
    match: ({ viewMode }) => viewMode === 'story',
    render: (props: { active: boolean }) => <Panel {...props} />,
  });

  // Register the tab
  // addons.add(TAB_ID, {
  //   type: types.TAB,
  //   title: 'Experience Builder Preview',
  //   //👇 Checks the current route for the story
  //   route: ({ storyId }) => `/experience-builder/${storyId}`,
  //   //👇 Shows the Tab UI element in experience-builder view mode
  //   match: ({ viewMode }) => viewMode === 'experience-builder',
  //   render: Tab,
  // });
});
