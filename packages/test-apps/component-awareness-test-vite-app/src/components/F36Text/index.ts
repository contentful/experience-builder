import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36Text } from './F36Text';

export const f36TextDefinition: ComponentDefinition = {
  id: 'f36-text',
  name: 'F36 Text',
  category: 'F36 Design System',
  builtInStyles: ['cfMargin', 'cfPadding', 'cfTextAlign', 'cfTextColor'],
  variables: {
    content: {
      displayName: 'Text Content',
      type: 'Text',
      defaultValue: 'Your text here',
      description: 'The text content to display',
    },
    element: {
      displayName: 'HTML Element',
      type: 'Text',
      defaultValue: 'p',
      group: 'style',
      description: 'The HTML element to render',
      validations: {
        in: [
          { value: 'p', displayName: 'Paragraph' },
          { value: 'h1', displayName: 'Heading 1' },
          { value: 'h2', displayName: 'Heading 2' },
          { value: 'h3', displayName: 'Heading 3' },
          { value: 'h4', displayName: 'Heading 4' },
          { value: 'h5', displayName: 'Heading 5' },
          { value: 'h6', displayName: 'Heading 6' },
          { value: 'span', displayName: 'Span' },
          { value: 'a', displayName: 'Anchor (link)' },
        ],
      },
    },
    href: {
      displayName: 'Link URL',
      type: 'Hyperlink',
      description: 'If set, renders text as a link (anchor)',
    },
    openInNewTab: {
      displayName: 'Open in new tab',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Opens the link in a new browser tab/window',
    },
    relNoFollow: {
      displayName: 'rel="nofollow"',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Adds nofollow to rel attribute (SEO hint)',
    },
    asTag: {
      displayName: 'Render as Tag',
      type: 'Boolean',
      defaultValue: false,
      group: 'style',
      description: 'Render the text as a pill-like tag element',
    },
    tagTone: {
      displayName: 'Tag Tone',
      type: 'Text',
      defaultValue: 'default',
      group: 'style',
      description: 'Visual tone used when rendering as a tag',
      validations: {
        in: [
          { value: 'default', displayName: 'Default' },
          { value: 'primary', displayName: 'Primary' },
          { value: 'positive', displayName: 'Positive' },
          { value: 'negative', displayName: 'Negative' },
          { value: 'warning', displayName: 'Warning' },
          { value: 'muted', displayName: 'Muted' },
        ],
      },
    },
    fontWeight: {
      displayName: 'Font Weight',
      type: 'Text',
      defaultValue: 'fontWeightNormal',
      group: 'style',
      description: 'The weight/boldness of the text',
      validations: {
        in: [
          { value: 'fontWeightNormal', displayName: 'Normal' },
          { value: 'fontWeightMedium', displayName: 'Medium' },
          { value: 'fontWeightDemiBold', displayName: 'Semi Bold' },
        ],
      },
    },
  },
};
