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
import ColorfulBox from './components/ColorfulBox/ColorfulBox';
import { ComponentUsingReferences } from './components/ComponentUsingReferences';
import {
  ResolveManuallyComponent,
  ResolveManuallyComponentDefinition,
  ShallowComponent,
  ShallowComponentDefinition,
} from './components/BindingToReferences';
import { CustomContainer, customContainerDefinition } from './components/CustomContainer';
import tokens from '@contentful/f36-tokens';

// Import F36 Components
import { F36Button, f36ButtonDefinition } from './components/F36Button';
import { F36Card, f36CardDefinition } from './components/F36Card';
import { F36Text, f36TextDefinition } from './components/F36Text';
import { F36TextInput, f36TextInputDefinition } from './components/F36TextInput';
import { F36Select, f36SelectDefinition } from './components/F36Select';

defineComponents(
  [
    // F36 Design System Components
    {
      component: F36Button,
      definition: f36ButtonDefinition,
      options: {
        wrapComponent: false,
      },
    },
    {
      component: F36Card,
      definition: f36CardDefinition,
      options: {
        wrapComponent: false,
      },
    },
    {
      component: F36Text,
      definition: f36TextDefinition,
      options: {
        wrapComponent: false,
      },
    },
    {
      component: F36TextInput,
      definition: f36TextInputDefinition,
      options: {
        wrapComponent: false,
      },
    },
    {
      component: F36Select,
      definition: f36SelectDefinition,
      options: {
        wrapComponent: false,
      },
    },
    // Existing Custom Components
    {
      component: CustomContainer,
      definition: customContainerDefinition,
      options: {
        wrapComponent: false,
      },
    },
    {
      component: ResolveManuallyComponent,
      definition: ResolveManuallyComponentDefinition,
    },
    {
      component: ShallowComponent,
      definition: ShallowComponentDefinition,
    },
    {
      component: ColorfulBox,
      definition: {
        id: 'colorful-box',
        name: 'Colorful Box',
        category: 'Custom Components',
        variables: {},
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
        // Don't provide cfWidth as it's hardcoded inside the component (typical use case)
        builtInStyles: ['cfMargin', 'cfPadding', 'cfMaxWidth'],
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
        children: true,
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
        builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfMaxWidth', 'cfHeight'],
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
            // defaultValue: { lon: -69, lat: 69 },
          },
          media: {
            displayName: 'Media',
            type: 'Media',
            // defaultValue:
            //   'https://images.ctfassets.net/son9ld5ewssk/66dcJbD6GoCqwQ0ciGaCOg/6c20042a8684baedc1517fadfc3e3070/children-enabled_7x.png',
          },
          hyperlink: {
            displayName: 'Hyperlink',
            type: 'Hyperlink',
            // defaultValue: 'https://www.contentful.com',
          },
          richText: {
            displayName: 'Rich Text',
            type: 'RichText',
          },
          overflow: {
            displayName: 'Overflow',
            type: 'Text',
            defaultValue: '',
            group: 'style',
            validations: {
              in: [
                {
                  value: '',
                  displayName: 'Initial',
                },
                {
                  value: 'hidden',
                  displayName: 'Hidden',
                },
                {
                  value: 'visible',
                  displayName: 'Visible',
                },
                {
                  value: 'auto',
                  displayName: 'Auto',
                },
              ],
            },
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
    __disableTextAlignmentTransform: true,
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

defineDesignTokens({
  // Spacing tokens mapped from F36 design system
  spacing: {
    XS: tokens.spacing2Xs, // 0.25rem (4px)
    S: tokens.spacingS, // 0.75rem (12px)
    M: tokens.spacingM, // 1rem (16px)
    L: tokens.spacingL, // 1.5rem (24px)
    XL: tokens.spacingXl, // 2rem (32px)
    XXL: tokens.spacing2Xl, // 3rem (48px)
    XXXL: tokens.spacing3Xl, // 4rem (64px)
  },

  // Sizing tokens for component dimensions
  sizing: {
    XS: tokens.spacingM, // 1rem (16px)
    S: '100px', // Custom small size
    M: '300px', // Custom medium size
    L: '600px', // Custom large size
    XL: '1024px', // Custom extra large size
  },

  // Color palette from F36 design system
  color: {
    // Primary brand colors
    Primary: tokens.colorPrimary, // #0059C8
    White: tokens.colorWhite, // #ffffff
    Black: tokens.colorBlack, // #0C141C

    // Semantic colors
    Positive: tokens.colorPositive, // #006D23
    Negative: tokens.colorNegative, // #BD002A
    Warning: tokens.colorWarning, // #CC4500

    // Gray scale
    Gray100: tokens.gray100, // #F7F9FA
    Gray200: tokens.gray200, // #E7EBEE
    Gray300: tokens.gray300, // #CFD9E0
    Gray500: tokens.gray500, // #67728A
    Gray700: tokens.gray700, // #414D63
    Gray900: tokens.gray900, // #111B2B

    // Blue scale
    Blue100: tokens.blue100, // #E8F5FF
    Blue300: tokens.blue300, // #98CBFF
    Blue500: tokens.blue500, // #036FE3
    Blue700: tokens.blue700, // #0041AB

    // Additional colors
    Green300: tokens.green300, // #9ED696
    Orange300: tokens.orange300, // #FDB882
    Red300: tokens.red300, // #FFB1B2
    Purple300: tokens.purple300, // #D1BBFF
  },

  // Border tokens with F36 design system integration
  border: {
    Light: {
      width: '1px',
      style: 'solid',
      color: tokens.gray200,
    },
    Medium: {
      width: '1px',
      style: 'solid',
      color: tokens.gray300,
    },
    Dark: {
      width: '1px',
      style: 'solid',
      color: tokens.gray500,
    },
    Primary: {
      width: '2px',
      style: 'solid',
      color: tokens.colorPrimary,
    },
    Success: {
      width: '2px',
      style: 'solid',
      color: tokens.colorPositive,
    },
    Warning: {
      width: '2px',
      style: 'dashed',
      color: tokens.colorWarning,
    },
    Error: {
      width: '2px',
      style: 'solid',
      color: tokens.colorNegative,
    },
  },

  // Border radius from F36
  borderRadius: {
    Small: tokens.borderRadiusSmall, // 4px
    Medium: tokens.borderRadiusMedium, // 6px
    None: '0px',
  },

  // Typography - Font sizes from F36
  fontSize: {
    XS: tokens.fontSizeS, // 0.75rem (12px)
    SM: tokens.fontSizeM, // 0.875rem (14px)
    MD: tokens.fontSizeL, // 1rem (16px)
    LG: tokens.fontSizeXl, // 1.25rem (20px)
    XL: tokens.fontSize2Xl, // 1.5rem (24px)
    XXL: tokens.fontSize3Xl, // 2.25rem (36px)
    XXXL: tokens.fontSize4Xl, // 3rem (48px)
  },

  // Line heights from F36
  lineHeight: {
    Tight: tokens.lineHeightCondensed, // 1.25
    Normal: tokens.lineHeightDefault, // 1.5
    S: tokens.lineHeightS, // 1rem
    M: tokens.lineHeightM, // 1.25rem
    L: tokens.lineHeightL, // 1.5rem
    XL: tokens.lineHeightXl, // 2rem
  },

  // Letter spacing from F36
  letterSpacing: {
    Default: tokens.letterSpacingDefault, // 0rem
    Wide: tokens.letterSpacingWide, // 0.1rem
    Tight: '-0.025em',
    Normal: '0em',
    Loose: '0.05em',
  },

  // Text colors from F36 and semantic colors
  textColor: {
    Primary: tokens.colorBlack, // #0C141C
    Secondary: tokens.gray700, // #414D63
    Muted: tokens.gray500, // #67728A
    Light: tokens.gray300, // #CFD9E0
    Inverse: tokens.colorWhite, // #ffffff
    Link: tokens.colorPrimary, // #0059C8
    Success: tokens.colorPositive, // #006D23
    Warning: tokens.colorWarning, // #CC4500
    Error: tokens.colorNegative, // #BD002A
  },
});
