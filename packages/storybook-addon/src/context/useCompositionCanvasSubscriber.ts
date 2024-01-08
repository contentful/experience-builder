import type { CompositionVariableValueType } from '@contentful/experience-builder';
import { useArgs } from '@storybook/manager-api';
import { useCallback } from 'react';

export function useCompositionCanvasSubscriber() {
  const [_, updateArgs] = useArgs();

  const onDesignValueChanged = (variableName: string, value: CompositionVariableValueType) => {
    updateArgs({ [variableName]: value });
  };

  const onUnboundValuesChanged = useCallback(
    ({ variableName, value }: { variableName: string; value: any }) => {
      updateArgs({ [variableName]: value });
    },
    [_, updateArgs]
  );

  return {
    onDesignValueChanged,
    onUnboundValuesChanged,
  };
}
