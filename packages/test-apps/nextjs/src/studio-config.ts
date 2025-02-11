import {
  defineComponents,
  defineBreakpoints,
  defineDesignTokens,
} from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import { LinkComponent } from './components/LinkComponent';
import { CustomImageComponent } from './components/CustomImageComponent';
import NestedSlots from './components/NestedSlots';
import KitchenSink from './components/KitchenSink';

export const registeredComponents = [
  {
    component: ComponentWithChildren,
    definition: {
      id: 'component-with-children',
      thumbnailUrl:
        'https://images.ctfassets.net/son9ld5ewssk/66dcJbD6GoCqwQ0ciGaCOg/6c20042a8684baedc1517fadfc3e3070/children-enabled_7x.png',
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
      thumbnailUrl:
        'https://images.ctfassets.net/son9ld5ewssk/5J3uY5m9DMwWg7FnpLvKwR/858b0168bbea353c57785797aa8e39ac/nested-slots_7x.png',
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
  {
    component: KitchenSink,
    definition: {
      id: 'kitchen-sink',
      thumbnailUrl:
        'https://images.ctfassets.net/son9ld5ewssk/66dcJbD6GoCqwQ0ciGaCOg/6c20042a8684baedc1517fadfc3e3070/children-enabled_7x.png',
      children: true,
      name: 'Kitchen Sink',
      category: 'Custom Components',
      builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth'],
      variables: {
        jsonObject: {
          displayName: 'Json',
          type: 'Object',
        },
        booleanValue: {
          displayName: 'Boolean',
          type: 'Boolean',
        },
        listText: {
          displayName: 'List Text',
          type: 'Array',
        },
        entryReference: {
          displayName: 'Entry Reference',
          type: 'Link',
        },
        imageReference: {
          displayName: 'Image Reference',
          type: 'Link',
        },
        listReference: {
          displayName: 'List Entry Reference',
          type: 'Array',
        },
        text: {
          displayName: 'Text',
          type: 'Text',
          // defaultValue: 'Lorem ipsum',
        },
        date: {
          displayName: 'Date',
          type: 'Date',
        },
        location: {
          displayName: 'Location',
          type: 'Location',
          defaultValue: { lon: -69, lat: 69 },
        },
        media: {
          displayName: 'Media',
          type: 'Media',
          defaultValue:
            'https://images.ctfassets.net/son9ld5ewssk/66dcJbD6GoCqwQ0ciGaCOg/6c20042a8684baedc1517fadfc3e3070/children-enabled_7x.png',
        },
        hyperlink: {
          displayName: 'Hyperlink',
          type: 'Hyperlink',
          defaultValue: 'https://www.contentful.com',
        },
        richText: {
          displayName: 'Rich Text',
          type: 'RichText',
        },
      },
    },
    options: {
      wrapComponent: false,
    },
  },
];

defineBreakpoints([
  {
    id: 'test-desktop',
    query: '*',
    displayName: 'All Sizes',
    displayIcon: 'desktop',
    previewSize: '100%',
  },
  {
    id: 'test-tablet',
    query: '<982px',
    displayName: 'Tablet',
    displayIcon: 'tablet',
    previewSize: '820px',
  },
  {
    id: 'test-mobile',
    query: '<576px',
    displayName: 'Mobile',
    displayIcon: 'mobile',
    previewSize: '390px',
  },
]);

defineDesignTokens({
  spacing: { XS: '4px', S: '16px', M: '32px', L: '64px', XL: '128px' },
  sizing: { XS: '16px', S: '100px', M: '300px', L: '600px', XL: '1024px' },
  color: {
    Slate: '#94a3b8',
    Azure: 'azure',
    Orange: '#fdba74',
    Blue: '#0000ff',
  },
  border: {
    Azure: { width: '1px', style: 'solid', color: 'azure' },
    Hero: { width: '2px', style: 'dashed', color: '#ffaabb' },
    Card: { width: '1px', style: 'solid', color: '#ffccbb' },
    Carousel: { width: '2px', style: 'dotted', color: 'rgba(30, 25, 25, 0.75)' },
  },
  fontSize: { XS: '12px', SM: '14px', MD: '16px', LG: '24px', XL: '32px' },
  lineHeight: { XS: '1', SM: '1.25', MD: '1.5', LG: '200%' },
  letterSpacing: {
    None: '0',
    XS: '0.05em',
    SM: '0.1em',
    MD: '0.15em',
    LG: '0.2em',
  },
  textColor: { Dark: '#1a1a1a', Light: '#efefef', Slate: '#94a3b8' },
});
