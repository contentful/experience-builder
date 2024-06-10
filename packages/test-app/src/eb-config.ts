import {
  defineComponents,
  defineBreakpoints,
  defineDesignTokens,
} from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import { LinkComponent } from './components/LinkComponent';
import { CustomImageComponent } from './components/CustomImageComponent';
import NestedSlots from './components/NestedSlots';

defineDesignTokens({
  spacing: {
    XS: 'var(--cf-spacing-6)',
    S: 'var(--cf-spacing-8)',
    M: 'var(--cf-spacing-10)',
    L: 'var(--cf-spacing-12)',
    XL: '128px',
  },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  color: { Slate: '#94a3b8', Azure: 'azure', Orange: '#fdba74', Blue: '#0000ff' },
  borderRadius: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  border: {
    Azure: { width: '1', style: 'solid', color: 'azure' },
    Hero: { width: '2px', style: 'dashed', color: '#ffaabb' },
    Card: { width: '1px', style: 'solid', color: '#ffccbb' },
    Carousel: { width: '2px', style: 'dotted', color: 'rgba(30, 25, 25, 0.75)' },
  },
  text: {
    'Heading 1': {
      fontSize: '16px',
      lineHeight: '1.5',
      letterSpacing: '0.1em',
      color: '#1a1a1a',
    },
    'Heading 2': {
      fontSize: '24px',
      lineHeight: '1.5',
      letterSpacing: '0.1em',
      color: '#1a1a1a',
    },
    'Small Paragraph': {
      fontSize: '14px',
      lineHeight: '1.5',
      letterSpacing: '0.1em',
      color: '#1a1a1a',
    },
  },
  fontSize: { XS: '12p', SM: '14px', MD: '16px', LG: '24px', XL: '32px' },
  lineHeight: { XS: '1', SM: '1.25', MD: '1.5', LG: '200%' },
  letterSpacing: { None: '0', XS: '0.05em', SM: '0.1em', MD: '0.15em', LG: '0.2em' },
  textColor: { Dark: '#1a1a1a', Light: '#efefef', Slate: '#94a3b8' },
});

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
