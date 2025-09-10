import React from 'react';
import { Collapse, Button, Stack } from '@contentful/f36-components';

interface F36CollapseProps {
  title?: string;
  isExpanded?: boolean; // initial state (when toggle button shown) or controlled state (no button)
  showToggleButton?: boolean;
  toggleButtonLabel?: string; // label for the toggle button
  children?: React.ReactNode;
}

// Lean wrapper around F36 Collapse component so it can be registered in Studio.
export const F36Collapse: React.FC<F36CollapseProps> = ({
  title = 'Section title',
  isExpanded = false,
  showToggleButton = false,
  toggleButtonLabel = 'Toggle',
  children,
  ...rest
}) => {
  const [internalExpanded, setInternalExpanded] = React.useState(isExpanded);

  const expanded = showToggleButton ? internalExpanded : isExpanded;

  const content = (
    <Collapse title={title} isExpanded={expanded} {...rest}>
      {children}
    </Collapse>
  );

  if (!showToggleButton) return content;

  return (
    <Stack flexDirection="column">
      <Button
        size="small"
        variant="secondary"
        onClick={() => setInternalExpanded((v) => !v)}
        aria-expanded={expanded}>
        {toggleButtonLabel}
      </Button>
      {content}
    </Stack>
  );
};

export default F36Collapse;
