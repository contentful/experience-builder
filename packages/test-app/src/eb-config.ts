import { defineComponents } from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import { LinkComponent } from './components/LinkComponent';
import { CustomImageComponent } from './components/CustomImageComponent';
import { FullWidthWrapped } from './components/FullWidthWrapped';
import { FullWidthNoWrapped } from './components/FullWidthNoWrapped';

defineComponents([
  {
    component: ComponentWithChildren,
    definition: {
      id: 'component-with-children',
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
  {
    component: FullWidthWrapped,
    definition: {
      id: 'fullWidthWrapped',
      name: 'FullWidth Wrapped',
      category: 'Custom Components',
      builtInStyles: ['cfWidth', 'cfHeight', 'cfMargin'],
      variables: {
        text: {
          displayName: 'Text',
          type: 'Text',
        },
      },
    },
    options: { wrapComponent: true },
  },
  {
    component: FullWidthNoWrapped,
    definition: {
      id: 'fullWidthNoWrapped',
      name: 'FullWidth No Wrapped',
      category: 'Custom Components',
      variables: {
        text: {
          displayName: 'Text',
          type: 'Text',
        },
      },
    },
    options: { wrapComponent: false },
  },
]);
