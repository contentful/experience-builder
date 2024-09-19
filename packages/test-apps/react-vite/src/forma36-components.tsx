import {
  Paragraph,
  Badge,
  Avatar,
  Asset,
  Image,
  Card,
  Button,
  Heading,
  Icon,
  SectionHeading,
  List,
} from '@contentful/f36-components';

const paragraphDefinition = {
  id: 'paragraph',
  name: 'Paragraph',
  category: 'Forma 36',
  children: true,
  variables: {
    'is-truncated': {
      displayName: 'Is Truncated',
      type: 'Boolean',
      description: 'Truncate the text if it exceeds the width of the container',
      group: 'style',
      defaultValue: false,
    },
    'is-word-break': {
      displayName: 'Is Word Break',
      type: 'Boolean',
      description: 'Allow words to be broken and wrap onto the next line',
      group: 'style',
      defaultValue: false,
    },
    'margin-bottom': {
      displayName: 'Margin Bottom',
      type: 'Text',
      description: 'Margin space below the paragraph',
      group: 'style',
      defaultValue: 'spacingM',
    },
  },
};

const badgeDefinition = {
  id: 'badge',
  name: 'Badge',
  category: 'Forma 36',
  children: false,
  variables: {
    variant: {
      displayName: 'Variant',
      type: 'Text',
      description: 'Determines the variation of the component',
      group: 'style',
      defaultValue: 'primary',
      validations: {
        in: [
          { value: 'primary', displayName: 'Primary' },
          { value: 'secondary', displayName: 'Secondary' },
          { value: 'positive', displayName: 'Positive' },
          { value: 'negative', displayName: 'Negative' },
          { value: 'warning', displayName: 'Warning' },
          { value: 'premium', displayName: 'Premium' },
          { value: 'primary-filled', displayName: 'Primary Filled' },
        ],
      },
    },
    size: {
      displayName: 'Size',
      type: 'Text',
      description: 'Sets the size of the component',
      group: 'style',
      defaultValue: 'default',
      validations: {
        in: [
          { value: 'default', displayName: 'Default' },
          { value: 'small', displayName: 'Small' },
        ],
      },
    },
    startIcon: {
      displayName: 'Start Icon',
      type: 'Media',
      description: 'Icon aligned to the start of the badge',
      group: 'style',
    },
    endIcon: {
      displayName: 'End Icon',
      type: 'Media',
      description: 'Icon aligned to the end of the badge',
      group: 'style',
    },
    textTransform: {
      displayName: 'Text Transform',
      type: 'Text',
      description: 'Controls the text transformation of the badge content',
      group: 'style',
      defaultValue: 'capitalize',
      validations: {
        in: [
          { value: 'capitalize', displayName: 'Capitalize' },
          { value: 'none', displayName: 'None' },
        ],
      },
    },
  },
};

const assetDefinition = {
  id: 'asset',
  name: 'Asset',
  category: 'Forma 36',
  children: false,
  variables: {
    src: {
      displayName: 'Source',
      type: 'Media',
      description: 'A src attribute to use for image assets',
    },
    status: {
      displayName: 'Status',
      type: 'Text',
      description: 'The publish status of the asset',
      group: 'style',
      defaultValue: 'published',
      validations: {
        in: [
          { value: 'archived', displayName: 'Archived' },
          { value: 'changed', displayName: 'Changed' },
          { value: 'deleted', displayName: 'Deleted' },
          { value: 'draft', displayName: 'Draft' },
          { value: 'published', displayName: 'Published' },
        ],
      },
    },
    title: {
      displayName: 'Title',
      type: 'Text',
      description: 'The title of the asset',
    },
    type: {
      displayName: 'Type',
      type: 'Text',
      description: 'The type of asset being represented',
      group: 'style',
      defaultValue: 'image',
      validations: {
        in: [
          { value: 'image', displayName: 'Image' },
          { value: 'audio', displayName: 'Audio' },
          { value: 'video', displayName: 'Video' },
          { value: 'presentation', displayName: 'Presentation' },
          { value: 'spreadsheet', displayName: 'Spreadsheet' },
          { value: 'pdfdocument', displayName: 'PDF Document' },
          { value: 'archive', displayName: 'Archive' },
        ],
      },
    },
  },
};

const avatarDefinition = {
  id: 'avatar',
  name: 'Avatar',
  category: 'Forma 36',
  children: false,
  variables: {
    alt: {
      displayName: 'Alt Text',
      type: 'Text',
      description: 'Alternative text for the avatar image',
    },
    size: {
      displayName: 'Size',
      type: 'Text',
      group: 'style',
      defaultValue: 'medium',
      validations: {
        in: [
          { value: 'tiny', displayName: 'Tiny' },
          { value: 'small', displayName: 'Small' },
          { value: 'medium', displayName: 'Medium' },
          { value: 'large', displayName: 'Large' },
        ],
      },
    },
    initials: {
      displayName: 'Initials',
      type: 'Text',
      description: 'Initials to display when no image is available',
    },
    src: {
      displayName: 'Image Source',
      type: 'Media',
      description: 'URL of the avatar image',
    },
    variant: {
      displayName: 'Variant',
      type: 'Text',
      group: 'style',
      defaultValue: 'user',
      validations: {
        in: [
          { value: 'user', displayName: 'User' },
          { value: 'app', displayName: 'App' },
        ],
      },
    },
    colorVariant: {
      displayName: 'Color Variant',
      type: 'Text',
      group: 'style',
      description: 'Color variant for the avatar',
    },
  },
};

const buttonDefinition = {
  id: 'button',
  name: 'Button',
  category: 'Forma 36',
  children: true,
  variables: {
    variant: {
      displayName: 'Variant',
      type: 'Text',
      group: 'style',
      defaultValue: 'secondary',
      validations: {
        in: [
          { value: 'primary', displayName: 'Primary' },
          { value: 'secondary', displayName: 'Secondary' },
          { value: 'positive', displayName: 'Positive' },
          { value: 'negative', displayName: 'Negative' },
          { value: 'transparent', displayName: 'Transparent' },
        ],
      },
    },
    size: {
      displayName: 'Size',
      type: 'Text',
      group: 'style',
      defaultValue: 'medium',
      validations: {
        in: [
          { value: 'small', displayName: 'Small' },
          { value: 'medium', displayName: 'Medium' },
          { value: 'large', displayName: 'Large' },
        ],
      },
    },
    isActive: {
      displayName: 'Is Active',
      type: 'Boolean',
      group: 'style',
      defaultValue: false,
    },
    isDisabled: {
      displayName: 'Is Disabled',
      type: 'Boolean',
      group: 'style',
      defaultValue: false,
    },
    isLoading: {
      displayName: 'Is Loading',
      type: 'Boolean',
      group: 'style',
      defaultValue: false,
    },
    isFullWidth: {
      displayName: 'Is Full Width',
      type: 'Boolean',
      group: 'style',
      defaultValue: false,
    },
  },
};

const cardDefinition = {
  id: 'card',
  name: 'Card',
  category: 'Forma 36',
  children: true,
  variables: {
    title: {
      displayName: 'Title',
      type: 'Text',
      description: 'The title of the card',
    },
    padding: {
      displayName: 'Padding',
      type: 'Text',
      group: 'style',
      defaultValue: 'default',
      description: 'Padding size to apply to the component',
      validations: {
        in: [
          { value: 'default', displayName: 'Default' },
          { value: 'large', displayName: 'Large' },
          { value: 'none', displayName: 'None' },
        ],
      },
    },
    badge: {
      displayName: 'Badge',
      type: 'Text',
      description: 'Badge content for the card',
    },
    icon: {
      displayName: 'Icon',
      type: 'Media',
      description: 'Icon for the card',
    },
    actions: {
      displayName: 'Actions',
      type: 'Text',
      description: 'Actions for the card',
    },
  },
};

const headingDefinition = {
  id: 'heading',
  name: 'Heading',
  category: 'Forma 36',
  children: true,
  variables: {
    as: {
      displayName: 'Heading Level',
      type: 'Text',
      description: 'The heading level to render',
      group: 'style',
      defaultValue: 'h1',
      validations: {
        in: [
          { value: 'h1', displayName: 'H1' },
          { value: 'h2', displayName: 'H2' },
          { value: 'h3', displayName: 'H3' },
          { value: 'h4', displayName: 'H4' },
          { value: 'h5', displayName: 'H5' },
          { value: 'h6', displayName: 'H6' },
        ],
      },
    },
    isTruncated: {
      displayName: 'Truncate',
      type: 'Boolean',
      description: 'Whether the text should be truncated',
      group: 'style',
    },
    isWordBreak: {
      displayName: 'Word Break',
      type: 'Boolean',
      description: 'Whether to break words',
      group: 'style',
    },
    marginBottom: {
      displayName: 'Margin Bottom',
      type: 'Text',
      description: 'Bottom margin of the heading',
      group: 'style',
      defaultValue: 'spacingM',
    },
    fontWeight: {
      displayName: 'Font Weight',
      type: 'Text',
      description: 'Font weight of the heading',
      group: 'style',
      defaultValue: 'fontWeightDemiBold',
    },
    fontColor: {
      displayName: 'Font Color',
      type: 'Text',
      description: 'Color of the heading text',
      group: 'style',
      defaultValue: 'gray900',
    },
  },
};

const sectionHeadingDefinition = {
  id: 'section-heading',
  name: 'Section Heading',
  category: 'Forma 36',
  children: true,
  variables: {
    as: {
      displayName: 'Heading Level',
      type: 'Text',
      description: 'The heading level to render',
      group: 'style',
      defaultValue: 'h1',
      validations: {
        in: [
          { value: 'h1', displayName: 'H1' },
          { value: 'h2', displayName: 'H2' },
        ],
      },
    },
    isTruncated: {
      displayName: 'Truncate',
      type: 'Boolean',
      description: 'Whether the text should be truncated',
      group: 'style',
    },
    isWordBreak: {
      displayName: 'Word Break',
      type: 'Boolean',
      description: 'Whether to break words',
      group: 'style',
    },
    marginBottom: {
      displayName: 'Margin Bottom',
      type: 'Text',
      description: 'Bottom margin of the heading',
      group: 'style',
      defaultValue: 'spacingM',
    },
  },
};

const listDefinition = {
  id: 'list',
  name: 'List',
  category: 'Forma 36',
  children: true,
  variables: {
    as: {
      displayName: 'Heading Level',
      type: 'Text',
      description: 'The heading level to render',
      group: 'style',
    },
  },
};

const listItemDefinition = {
  id: 'list-item',
  name: 'List Item',
  category: 'Forma 36',
  children: true,
  variables: {},
};

const imageDefinition = {
  id: 'image',
  name: 'Image',
  category: 'Forma 36',
  children: false,
  variables: {
    src: {
      displayName: 'Source',
      type: 'Media',
      description: 'The source URL of the image',
    },
    alt: {
      displayName: 'Alt Text',
      type: 'Text',
      description: 'Alternative text for the image',
    },
    width: {
      displayName: 'Width',
      type: 'Text',
      description: 'Width of the image',
      group: 'style',
      defaultValue: '200px',
    },
    height: {
      displayName: 'Height',
      type: 'Text',
      description: 'Height of the image',
      group: 'style',
      defaultValue: '200px',
    },
    className: {
      displayName: 'CSS Class',
      type: 'Text',
      description: 'Additional CSS class for the image',
      group: 'style',
    },
  },
};

const iconDefinition = {
  id: 'icon',
  name: 'Icon',
  category: 'Forma 36',
  children: true,
  variables: {
    size: {
      displayName: 'Size',
      type: 'Text',
      description: 'Determines the size of the icon',
      group: 'style',
      defaultValue: 'small',
      validations: {
        in: [
          { value: 'xlarge', displayName: 'Extra Large' },
          { value: 'large', displayName: 'Large' },
          { value: 'medium', displayName: 'Medium' },
          { value: 'small', displayName: 'Small' },
          { value: 'tiny', displayName: 'Tiny' },
        ],
      },
    },
    variant: {
      displayName: 'Variant',
      type: 'Text',
      description: 'Determines the fill color used',
      group: 'style',
      defaultValue: 'primary',
      validations: {
        in: [
          { value: 'negative', displayName: 'Negative' },
          { value: 'positive', displayName: 'Positive' },
          { value: 'primary', displayName: 'Primary' },
          { value: 'secondary', displayName: 'Secondary' },
          { value: 'warning', displayName: 'Warning' },
          { value: 'muted', displayName: 'Muted' },
          { value: 'white', displayName: 'White' },
          { value: 'premium', displayName: 'Premium' },
        ],
      },
    },
    'aria-label': {
      displayName: 'Aria Label',
      type: 'Text',
      description: 'Accessible label for the icon',
    },
    'aria-labelledby': {
      displayName: 'Aria Labelledby',
      type: 'Text',
      description: 'ID of the element that labels the icon',
    },
    viewBox: {
      displayName: 'ViewBox',
      type: 'Text',
      description: 'Custom SVG viewBox attribute to use',
      defaultValue: '0 0 24 24',
    },
  },
};

export const components = [
  { component: Paragraph, definition: paragraphDefinition },
  { component: Badge, definition: badgeDefinition },
  { component: Asset, definition: assetDefinition },
  { component: Avatar, definition: avatarDefinition },
  { component: Button, definition: buttonDefinition },
  { component: Card, definition: cardDefinition },
  { component: Heading, definition: headingDefinition },
  { component: Image, definition: imageDefinition },
  { component: Icon, definition: iconDefinition },
  { component: SectionHeading, definition: sectionHeadingDefinition },
  { component: List, definition: listDefinition },
  { component: List.Item, definition: listItemDefinition },
];
