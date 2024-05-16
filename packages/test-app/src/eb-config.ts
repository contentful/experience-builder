import { defineComponents } from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import DualDropzones from './components/DualDropzones';
import IconGroup from './components/IconGroup';
import { LinkComponent } from './components/LinkComponent';
import { CustomImageComponent } from './components/CustomImageComponent';

defineComponents([
  {
    component: ComponentWithChildren,
    definition: {
      id: 'component-with-children',
      thumbnailUrl: 'https://static.thenounproject.com/png/2397501-200.png',
      children: true,
      name: 'Children Enabled',
      category: 'Custom Components',
      builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth'],
      variables: {
        heading: {
          displayName: 'Heading',
          type: 'Text',
          defaultValue: 'Lorem ipsum',
        },
      },
    },
    options: {
      wrapComponent: false,
    },
  },
  {
    component: DualDropzones,
    definition: {
      id: 'dual-dropzones',
      thumbnailUrl: 'https://static.thenounproject.com/png/3406258-200.png',
      // children: true, // ['zone1', 'zone2'],
      name: 'Dual Dropzones',
      category: 'Custom Components',
      builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth', 'cfBorder'],
      variables: {
        // zone1: {
        //   displayName: 'Zone 1',
        //   type: 'Slot',
        // },
        // zone2: {
        //   displayName: 'Zone 2',
        //   type: 'Slot',
        // },
      },
    },
    // options: {
    //   wrapComponent: false,
    // },
  },
  {
    component: IconGroup,
    definition: {
      id: 'icon-group',
      name: 'Icon Group',
      category: 'Custom Components',
      builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth', 'cfFlexDirection'],
      variables: {},
      children: true,
    },
    options: {
      wrapComponent: false,
    },
  },
  {
    component: CustomImageComponent,
    definition: {
      id: 'custom-image',
      name: 'Custom Image',
      category: 'Custom Components',
      variables: {
        src: {
          displayName: 'SRC',
          type: 'Media',
        },
      },
    },
  },
  {
    component: LinkComponent,
    definition: {
      id: 'link-component-custom',
      name: 'Link Component with custom link',
      hyperlinkPattern: 'https://test.com/{locale}',
      variables: {
        href: {
          displayName: 'Href',
          type: 'Hyperlink',
        },
        text: {
          displayName: 'Text',
          type: 'Text',
        },
      },
    },
  },
  {
    component: LinkComponent,
    definition: {
      id: 'link-component',
      name: 'Link Component',
      variables: {
        href: {
          displayName: 'Href',
          type: 'Hyperlink',
        },
        text: {
          displayName: 'Text',
          type: 'Text',
        },
      },
    },
  },
]);
