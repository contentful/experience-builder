import { Flex, Select, TextInput } from '@contentful/f36-components';
import React, { useState } from 'react';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { BORDER_STYLE_OPTIONS, LengthRegExp } from '../constants';
import { ColorInput } from '../BackgroundColorInput/ColorInput';
import { useBorderConstituents } from './useBorderConstituents';
import BorderWidthLinesIcon from '@svg/composition/border-width-lines.svg';
import { css } from 'emotion';
import { ensureHasMeasureUnit } from '../utils';
import { useVariableState } from '@/hooks/useVariableState';
import tokens from '@contentful/f36-tokens';

const styles = {
  borderStyleInput: css({
    flex: '140px 0 0',
  }),
  borderWidthIcon: css({
    flexShrink: 0,
    marginLeft: tokens.spacing2Xs,
  }),
};

export type BorderInputProps = {
  variableDefinition: ComponentDefinitionVariable<'Text'>;
  variableName: string;
};

export const BorderInput = ({ variableDefinition, variableName }: BorderInputProps) => {
  const defaultValue = String(variableDefinition.defaultValue) ?? '';
  const [borderValue, setBorderValue] = useVariableState({
    variableDefinition,
    variableName,
  });
  const [borderWidth, borderStyle, borderColor] = useBorderConstituents(borderValue);
  const [unvalidatedBorderWidth, setUnvalidatedBorderWidth] = useState(borderWidth);

  const updateBorderColor = (newBorderColor: string) => {
    const newBorderValue = `${borderWidth} ${borderStyle} ${newBorderColor}`;
    setBorderValue(newBorderValue);
  };

  const updateBorderStyle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBorderStyle = event.target.value;
    const newBorderValue = `${borderWidth} ${newBorderStyle} ${borderColor}`;
    setBorderValue(newBorderValue);
  };

  const updateUnvalidatedBorderWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBorderWidth = event.target.value;
    setUnvalidatedBorderWidth(newBorderWidth);
    // Temporarily update the design value for live preview without proper validation
    const enrichedBorderWidth = ensureHasMeasureUnit(newBorderWidth);
    const newBorderValue = `${enrichedBorderWidth} ${borderStyle} ${borderColor}`;
    setBorderValue(newBorderValue);
  };

  const validateBorderWidth = () => {
    // Validate input on blur and enrich with measure unit if missing
    if (LengthRegExp.test(unvalidatedBorderWidth)) {
      const newBorderValue = `${unvalidatedBorderWidth} ${borderStyle} ${borderColor}`;
      setBorderValue(newBorderValue);
    } else {
      const newBorderWidth = ensureHasMeasureUnit(String(unvalidatedBorderWidth));
      const newBorderValue = `${newBorderWidth} ${borderStyle} ${borderColor}`;
      setUnvalidatedBorderWidth(newBorderWidth);
      setBorderValue(newBorderValue);
    }
  };

  return (
    <Flex flexDirection="column" gap="spacingXs">
      <ColorInput value={borderColor} onChange={updateBorderColor} />
      <Flex gap="spacing2Xs" alignItems="center">
        <Select
          name="borderStyle"
          aria-label="Border style"
          value={borderStyle}
          onChange={updateBorderStyle}
          className={styles.borderStyleInput}>
          {BORDER_STYLE_OPTIONS.map((style) => (
            <Select.Option key={style} value={style}>
              {`${style[0].toUpperCase()}${style.slice(1)}`}
            </Select.Option>
          ))}
        </Select>
        <BorderWidthLinesIcon />
        {/* <TextInput
          name="borderWidth"
          aria-label="Border width"
          placeholder={defaultValue ? defaultValue.toString() : ''}
          value={unvalidatedBorderWidth}
          onChange={updateUnvalidatedBorderWidth}
          onBlur={validateBorderWidth}
        /> */}
      </Flex>
    </Flex>
  );
};
