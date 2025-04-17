import { defineComponents, defineBreakpoints } from '@contentful/experiences-sdk-react';
import ComponentWithChildren from './components/ComponentWithChildren';
import { LinkComponent } from './components/LinkComponent';
import { CustomImageComponent } from './components/CustomImageComponent';
import NestedSlots from './components/NestedSlots';
import KitchenSink from './components/KitchenSink';
import ColorfulBox from './components/ColorfulBox/ColorfulBox';
import { ComponentUsingReferences } from './components/ComponentUsingReferences';
import { PotionShelf } from './components/PotionShelf';
import { NeatPotionShelf } from './components/NeatPotionShelf';

defineComponents(
  [
    {
      component: PotionShelf,
      definition: {
        id: 'dk-potion-shelf',
        name: 'Potion Shelf',
        category: 'The Telegraph',
        builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth'],
        variables: {
          potions: {
            type: 'Array',
            displayName: 'Potions',
          },
          lotions: {
            type: 'Array',
            displayName: 'Lotions',
          },
          linkProp1: {
            type: 'Link',
            displayName: 'LinkProp1',
          },
        },
      },
    },
    {
      component: NeatPotionShelf,
      definition: {
        id: 'dk-neat-potion-shelf',
        name: 'Neat Potion Shelf',
        category: 'The Telegraph',
        builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth'],
        variables: {
          potions: {
            type: 'Array',
            displayName: 'Potions',
          },
          lotions: {
            type: 'Array',
            displayName: 'Lotions',
          },
          linkProp1: {
            type: 'Link',
            displayName: 'LinkProp1',
          },
        },
      },
    },
    {
      component: ColorfulBox,
      definition: {
        id: 'colorful-box',
        name: 'Colorful Box',
        category: 'Custom Components',
        variables: {},
      },
      options: {
        wrapContainerWidth: '50%',
      },
    },
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
      component: ComponentUsingReferences,
      definition: {
        id: 'component-using-references',
        name: 'Component Using References',
        category: 'Custom Components',
        builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth'],
        variables: {
          title: {
            displayName: 'Title',
            type: 'Text',
          },
          description: {
            displayName: 'Description',
            type: 'Text',
          },
          entry: {
            displayName: 'Entry Reference',
            type: 'Link',
          },
        },
      },
      options: {
        wrapComponent: true,
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
  ],
  {
    experimentalComponents: {
      carousel: true,
    },
  },
);

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
    previewSize: '350px',
  },
]);
