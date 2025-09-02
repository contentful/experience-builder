import { ComponentDefinition } from '@contentful/experiences-sdk-react';

export { F36Icon } from './F36Icon';

// Whitelist ~10 commonly used icons for the PoC. Values omit the trailing `Icon` for author friendliness.
// These strings will be normalized at runtime (appending `Icon`). Ensure they correspond to existing exports.
const ICON_OPTIONS = [
  { value: 'User', displayName: 'User' },
  { value: 'Users', displayName: 'Users' },
  { value: 'Settings', displayName: 'Settings' },
  { value: 'Search', displayName: 'Search' },
  { value: 'Calendar', displayName: 'Calendar' },
  { value: 'Warning', displayName: 'Warning' },
  { value: 'CheckCircle', displayName: 'Success / Check' },
  { value: 'Check', displayName: 'Check' },
  { value: 'Close', displayName: 'Close / X' },
  { value: 'Plus', displayName: 'Plus / Add' },
  { value: 'Minus', displayName: 'Minus / Remove' },
  { value: 'Basket', displayName: 'Basket / Cart' },
  { value: 'ArrowRight', displayName: 'Right Arrow' },
];

export const f36IconDefinition: ComponentDefinition = {
  id: 'f36-icon',
  name: 'F36 Icon',
  category: 'F36 Design System',
  // Lightweight presentational piece; margin & alignment useful
  builtInStyles: ['cfMargin', 'cfTextAlign', 'cfTextColor'],
  variables: {
    iconName: {
      displayName: 'Icon',
      type: 'Text',
      defaultValue: 'User',
  group: 'style',
      description: 'Select which icon to render',
      validations: {
        in: ICON_OPTIONS,
      },
    },
    size: {
      displayName: 'Size',
      type: 'Text',
      defaultValue: 'medium',
      group: 'style',
      description: 'Icon size',
      validations: {
        in: [
          { value: 'tiny', displayName: 'Tiny' },
          { value: 'small', displayName: 'Small' },
          { value: 'medium', displayName: 'Medium' },
          { value: 'large', displayName: 'Large' },
          { value: 'xlarge', displayName: 'XLarge' },
        ],
      },
    },
    color: {
      displayName: 'Color',
      type: 'Text',
      defaultValue: 'black',
      group: 'style',
      description: 'Icon color token',
      validations: {
        in: [
          { value: 'black', displayName: 'Black' },
          { value: 'white', displayName: 'White' },
          { value: 'primary', displayName: 'Primary' },
          { value: 'positive', displayName: 'Positive' },
          { value: 'negative', displayName: 'Negative' },
          { value: 'warning', displayName: 'Warning' },
          { value: 'muted', displayName: 'Muted' },
        ],
      },
    },
  isDecorative: {
      displayName: 'Decorative (hide from screen readers)',
      type: 'Boolean',
      defaultValue: true,
      description:
        'If true, the icon is hidden from assistive tech. Set false and provide an aria label when the icon conveys meaning.',
    },
    ariaLabel: {
      displayName: 'ARIA Label',
      type: 'Text',
      description: 'Accessible label (required when not decorative)',
    },
  },
};
