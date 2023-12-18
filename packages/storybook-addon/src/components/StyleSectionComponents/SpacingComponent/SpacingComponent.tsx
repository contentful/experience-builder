import React, { KeyboardEventHandler } from 'react';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { MarginGrid } from './MarginGrid';
import { PaddingGrid } from './PaddingGrid';

type SpacingComponentProps = {
  margin: ComponentDefinitionVariable<'Text'>;
  padding: ComponentDefinitionVariable<'Text'>;
};

export const SpacingComponent = ({ margin, padding }: SpacingComponentProps) => {
  const onKeyUp: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      // @ts-expect-error says that blur doesn't exist on the target element
      event.target.blur();
    }
  };
  if (margin && padding) {
    return (
      <MarginGrid margin={margin} onKeyUp={onKeyUp}>
        <PaddingGrid padding={padding} onKeyUp={onKeyUp} />
      </MarginGrid>
    );
  }
  if (margin) {
    return <MarginGrid margin={margin} onKeyUp={onKeyUp} />;
  }
  if (padding) {
    return <PaddingGrid padding={padding} onKeyUp={onKeyUp} standalone={true} />;
  }

  return null;
};
