import React from 'react';
import './button.css';
import { CompositionComponent } from 'src/types/composition';

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button: CompositionComponent<ButtonProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}>
      {label}
    </button>
  );
};

Button.ComponentDefinition = {
  id: 'button',
  name: 'Button',
  builtInStyles: ['cfPadding', 'cfMargin', 'cfFlexWrap'],
  variables: {
    label: {
      defaultValue: 'My Button',
      type: 'Text',
    },
    primary: {
      defaultValue: false,
      type: 'Boolean',
      group: 'style',
    },
  },
};
