import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { ChangeEventHandler, FocusEventHandler, useCallback, useEffect, useState } from 'react';
import { SpacingValueRegexp } from '../constants';
import { ensureHasMeasureUnit } from '../utils';
import { useVariableState } from '@/hooks/useVariableState';

type SpacingMap = {
  top: string;
  left: string;
  right: string;
  bottom: string;
};

const marginVariableName = 'cfMargin';
const paddingVariableName = 'cfPadding';

type UseSpacingValueProps = {
  variableName: typeof marginVariableName | typeof paddingVariableName;
  variableDefinition?: ComponentDefinitionVariable<'Text'>;
};

const toSpacingMap = (value?: string): SpacingMap => {
  if (!value || typeof value !== 'string') {
    return {
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
    };
  }

  const [top, right, bottom, left] = value.split(' ');

  return {
    top: SpacingValueRegexp.test(top) ? top : '0px',
    right: SpacingValueRegexp.test(right) ? right : '0px',
    bottom: SpacingValueRegexp.test(bottom) ? bottom : '0px',
    left: SpacingValueRegexp.test(left) ? left : '0px',
  };
};

const toSpacingDesignValue = (spacingMap: SpacingMap): string => {
  const top = ensureHasMeasureUnit(spacingMap.top);
  const right = ensureHasMeasureUnit(spacingMap.right);
  const bottom = ensureHasMeasureUnit(spacingMap.bottom);
  const left = ensureHasMeasureUnit(spacingMap.left);
  return `${top} ${right} ${bottom} ${left}`;
};

export const useSpacingValue = ({ variableName, variableDefinition }: UseSpacingValueProps) => {
  const [spacingValue, setSpacingValue, initialValue] = useVariableState({
    variableName,
    variableDefinition,
  });
  const [spacingBufferValue, setSpacingBufferValue] = useState(toSpacingMap(initialValue));
  const savedSpacingMap = toSpacingMap(spacingValue);

  useEffect(() => {
    setSpacingBufferValue(toSpacingMap(initialValue));
    // Re-evaluate this when the breakpoint view was switched
  }, [initialValue]);

  const onBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.target.name.startsWith(variableName)) {
        const location = event.target.name
          .replace(variableName, '')
          .toLowerCase() as keyof SpacingMap;
        const tempValue = spacingBufferValue[location];

        if (SpacingValueRegexp.test(tempValue)) {
          const spacingDesignValue = toSpacingDesignValue({
            ...savedSpacingMap,
            [location]: ensureHasMeasureUnit(tempValue),
          });
          setSpacingValue(spacingDesignValue);
        } else {
          setSpacingBufferValue({
            ...spacingBufferValue,
            [location]: savedSpacingMap[location],
          });
        }
      }
    },
    [variableName, spacingBufferValue, savedSpacingMap, setSpacingValue]
  );

  const onValueChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.target.name.startsWith(variableName)) {
        const location = event.target.name.replace(variableName, '').toLowerCase();

        setSpacingBufferValue({
          ...spacingBufferValue,
          [location]: event.target.value,
        });
      }
    },
    [spacingBufferValue, variableName]
  );

  return { onBlur, onValueChange, spacingBufferValue };
};
