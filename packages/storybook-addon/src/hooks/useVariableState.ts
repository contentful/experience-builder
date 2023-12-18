import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { useCallback, useEffect, useMemo, useState } from 'react';

type UseVariableStateProps = {
  variableDefinition: ComponentDefinitionVariable<'Text'>;
  variableName: string;
};

export const useVariableState = ({ variableDefinition, variableName }: UseVariableStateProps) => {
  // Keep this out of the memoization. The zustand store doesn't update correctly
  // the props and thus doesn't recalculate this value when it gets changed from the
  // outside (e.g. reversible actions).

  const initialValue = useMemo(() => {
    const defaultValue = String(variableDefinition?.defaultValue) ?? '';
    return String(defaultValue);
  }, [variableDefinition?.defaultValue]);

  const [value, _setValue] = useState(initialValue);

  useEffect(() => {
    _setValue(initialValue);
    // Re-evaluate this when the breakpoint view was switched
  }, [initialValue]);

  const setValue = useCallback(
    (value: typeof initialValue) => {
      if (!value) return;
      _setValue(value);
    },
    [variableName]
  );

  return [value, setValue, initialValue] as const;
};
