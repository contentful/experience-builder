import { defineComponents } from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import { LinkComponent } from './components/LinkComponent';
import { CustomImageComponent } from './components/CustomImageComponent';
import DualDropzones from './components/DualDropzones';

// defineDesignTokens({
//   spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
//   sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
//   color: { Slate: '#94a3b8', Azure: 'azure', Orange: '#fdba74', Blue: '#0000ff' },
//   border: {
//     Azure: { width: '1px', style: 'solid', color: 'azure' },
//     Hero: { width: '2px', style: 'dashed', color: '#ffaabb' },
//     Card: { width: '1px', style: 'solid', color: '#ffccbb' },
//     Carousel: { width: '2px', style: 'dotted', color: 'rgba(30, 25, 25, 0.75)' },
//   },
//   fontSize: { XS: '12px', SM: '14px', MD: '16px', LG: '24px', XL: '32px' },
//   lineHeight: { XS: '1', SM: '1.25', MD: '1.5', LG: '200%' },
//   letterSpacing: { None: '0', XS: '0.05em', SM: '0.1em', MD: '0.15em', LG: '0.2em' },
//   textColor: { Dark: '#1a1a1a', Light: '#efefef', Slate: '#94a3b8' },
// });

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
        zone1: {
          displayName: 'Zone 1',
          type: 'Dropzone',
        },
        zone2: {
          displayName: 'Zone 2',
          type: 'Dropzone',
        },
      },
    },
    // options: {
    //   wrapComponent: false,
    // },
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
