import React from 'react';
import * as F36Icons from '@contentful/f36-icons-alpha';

// We import the icon set namespace-style so we can resolve by string.
// Studio will control which icon to render via the validated variable `iconName`.

export interface F36IconProps {
  iconName: string; // validated & whitelisted in component definition
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
  color?: 'primary' | 'positive' | 'negative' | 'warning' | 'muted' | 'white' | 'black';
  isDecorative?: boolean; // if true, hide from screen readers
  ariaLabel?: string; // accessibility label when not decorative
}

// Runtime safety helper (icons package exports many components ending with Icon)
type GenericIcon = React.ComponentType<{
  size?: string;
  color?: string;
  'aria-hidden'?: boolean | undefined;
  'aria-label'?: string | undefined;
}>;

// Map friendly names used in Studio to actual export component names (without the trailing Icon suffix here)
// Refer to the icon exports list to ensure accuracy.
const ICON_NAME_ALIASES: Record<string, string> = {
  // Provide aliases where our chosen label differs from exact export root name
  // For example, we exposed 'Calendar' but export is CalendarBlankIcon or CalendarDotsIcon.
  Calendar: 'CalendarBlank',
  User: 'User',
  Users: 'Users',
  Settings: 'GearSix',
  Warning: 'Warning',
  CheckCircle: 'CheckCircle',
  Check: 'Check',
  Close: 'X',
  Plus: 'Plus',
  Minus: 'Minus',
  Search: 'MagnifyingGlass',
  // Keep previous direct names too
  MagnifyingGlass: 'MagnifyingGlass',
  Basket: 'ShoppingCartSimple',
  Cart: 'ShoppingCartSimple',
  ArrowRight: 'ArrowRight',
  RightArrow: 'ArrowRight',
  // Heart not available in exported list; leaving mapping out so it triggers fallback
};

const resolveIcon = (name: string): GenericIcon | undefined => {
  // If user provided a friendly alias, map it.
  const base = ICON_NAME_ALIASES[name] || name;
  const withSuffix = base.endsWith('Icon') ? base : `${base}Icon`;
  return (F36Icons as Record<string, GenericIcon>)[withSuffix];
};

export const F36Icon: React.FC<F36IconProps> = ({
  iconName,
  size = 'medium',
  color = 'black',
  isDecorative = true,
  ariaLabel,
  ...rest
}) => {
  const IconComponent = resolveIcon(iconName);

  if (!IconComponent) {
    // Graceful fallback so editor doesn't break if an icon name gets out of sync
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          border: '1px solid #CFD9E0',
          fontSize: 12,
          fontFamily: 'monospace',
          color: '#67728A',
        }}
        aria-label={isDecorative ? undefined : ariaLabel || `Unknown icon: ${iconName}`}
        aria-hidden={isDecorative || undefined}>
        ?
      </span>
    );
  }

  return (
    <IconComponent
      {...rest}
      size={size}
      color={color}
      aria-hidden={isDecorative || undefined}
      aria-label={isDecorative ? undefined : ariaLabel || iconName}
    />
  );
};

export default F36Icon;
