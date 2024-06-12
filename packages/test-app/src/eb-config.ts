import { defineComponents, defineBreakpoints } from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import { LinkComponent } from './components/LinkComponent';
import { CustomImageComponent } from './components/CustomImageComponent';
import NestedSlots from './components/NestedSlots';

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
    component: NestedSlots,
    definition: {
      id: 'nested-slots',
      thumbnailUrl: 'https://static.thenounproject.com/png/302688-200.png',
      name: 'Nested Slots',
      category: 'Custom Components',
      builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth', 'cfBorder'],
      variables: {},
      slots: {
        childrenSlot1: {
          displayName: 'Slot 1',
        },
        childrenSlot2: {
          displayName: 'Slot 2',
        },
      },
    },
  },
  {
    component: CustomImageComponent,
    definition: {
      id: 'acme-image',
      name: 'acme Image',
      category: 'acme Components',
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

defineBreakpoints([
  {
    id: 'test-desktop',
    query: '*',
    displayName: 'All Sizes',
    previewSize: '100%',
  },
  {
    id: 'test-tablet',
    query: '<982px',
    displayName: 'Tablet',
    previewSize: '820px',
  },
  {
    id: 'test-mobile',
    query: '<360px',
    displayName: 'Mobile',
    previewSize: '390px',
  },
]);
