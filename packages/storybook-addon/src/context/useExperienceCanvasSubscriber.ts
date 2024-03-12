import type { PrimitiveValue } from '@contentful/experiences-sdk-react';
import { useArgs } from '@storybook/manager-api';
import { useCallback } from 'react';

export function useExperienceCanvasSubscriber() {
  const [_, updateArgs] = useArgs();

  const onDesignValueChanged = (variableName: string, value: PrimitiveValue) => {
    updateArgs({ [variableName]: value });
  };

  const onUnboundValuesChanged = useCallback(
    ({ variableName, value }: { variableName: string; value: any }) => {
      updateArgs({ [variableName]: value });
    },
    [_, updateArgs],
  );

  return {
    onDesignValueChanged,
    onUnboundValuesChanged,
  };
}
