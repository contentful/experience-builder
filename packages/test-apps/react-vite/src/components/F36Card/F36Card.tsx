import React from 'react';
import { Card } from '@contentful/f36-components';

interface F36CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  padding: 'none' | 'default' | 'large';
  withDragHandle?: boolean;
  isSelected?: boolean;
}

export const F36Card: React.FC<F36CardProps> = ({
  title,
  description,
  children,
  padding = 'default',
  withDragHandle = false,
  isSelected = false,
  ...rest
}) => {
  return (
    <Card padding={padding} withDragHandle={withDragHandle} isSelected={isSelected} {...rest}>
      {title && (
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>{title}</h3>
      )}
      {description && <p style={{ margin: '0 0 16px 0', color: '#67728A' }}>{description}</p>}
      {children}
    </Card>
  );
};

export default F36Card;
