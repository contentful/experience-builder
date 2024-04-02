import { defineComponents } from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import { LinkComponent } from './components/LinkComponent';

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
