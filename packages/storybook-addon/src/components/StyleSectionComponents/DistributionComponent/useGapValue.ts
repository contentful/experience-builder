import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { useState, useCallback, useEffect } from 'react';
import { SpacingValueRegexp } from '../constants';
import { ensureHasMeasureUnit } from '../utils';
import { useVariableState } from '@/hooks/useVariableState';

type UseGapValueProps = {
  gap?: ComponentDefinitionVariable<'Text'>;
};

type GapMap = {
  rowGap: string;
  columnGap: string;
};

const toGapMap = (value?: string): GapMap => {
  return {
    rowGap: value?.split(' ')[0] ?? '0px',
    columnGap: value?.split(' ')[1] ?? '0px',
  };
};

const gapVariableName = 'cfGap';

export const useGapValue = ({ gap }: UseGapValueProps) => {
  const [gapValue, setGapValue, initialValue] = useVariableState({
    variableDefinition: gap,
    variableName: gapVariableName,
  });
  const [gapBufferValue, setGapBufferValue] = useState(toGapMap(initialValue));
  const savedGapMap = toGapMap(gapValue);

  useEffect(() => {
    setGapBufferValue(toGapMap(initialValue));
    // Re-evaluate this when the breakpoint view was switched
  }, [initialValue]);

  const onRowGapValueChange = useCallback(
    (value: any) => {
      setGapBufferValue({
        ...gapBufferValue,
        rowGap: value,
      });
    },
    [gapBufferValue]
  );
  const onColumnGapValueChange = useCallback(
    (value: any) => {
      setGapBufferValue({
        ...gapBufferValue,
        columnGap: value,
      });
    },
    [gapBufferValue]
  );

  const onRowGapBlur = useCallback(() => {
    const tempValue = gapBufferValue.rowGap;

    if (SpacingValueRegexp.test(tempValue)) {
      const ensuredValue = ensureHasMeasureUnit(tempValue);
      const designValueForGap = `${ensuredValue} ${savedGapMap.columnGap}`;
      setGapValue(designValueForGap);
    } else {
      setGapBufferValue({
        ...gapBufferValue,
        rowGap: savedGapMap.rowGap,
      });
    }
  }, [gapBufferValue, savedGapMap.columnGap, savedGapMap.rowGap, setGapValue]);

  const onColumnGapBlur = useCallback(() => {
    const tempValue = gapBufferValue.columnGap;

    if (SpacingValueRegexp.test(tempValue)) {
      const ensuredValue = ensureHasMeasureUnit(tempValue);
      const designValueForGap = `${savedGapMap.rowGap} ${ensuredValue}`;
      setGapValue(designValueForGap);
    } else {
      setGapBufferValue({
        ...gapBufferValue,
        columnGap: savedGapMap.columnGap,
      });
    }
  }, [gapBufferValue, savedGapMap.columnGap, savedGapMap.rowGap, setGapValue]);

  return {
    gapBufferValue,
    onRowGapValueChange,
    onColumnGapValueChange,
    onRowGapBlur,
    onColumnGapBlur,
  };
};
