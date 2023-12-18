import React from 'react';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { Flex, Text } from '@contentful/f36-components';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { SizeSelector } from './SizeSelector';
import { MaxWidthInput } from './MaxWidthInput';

const styles = {
  label: css({
    display: 'inline-block',
    padding: `${tokens.spacingXs} 0`,
  }),
};

type SectionSettingInputProps = {
  height?: ComponentDefinitionVariable<'Text'>;
  width?: ComponentDefinitionVariable<'Text'>;
  maxWidth?: ComponentDefinitionVariable<'Text'>;
};

export const SizeInput = ({ height, width, maxWidth }: SectionSettingInputProps) => {
  return (
    <Flex flexDirection="column">
      <Text fontWeight="fontWeightMedium" fontColor="gray700" className={styles.label}>
        Size
      </Text>
      <Flex flexDirection="column" gap="spacingS">
        {height && (
          <SizeSelector variableDefinition={height} variableName="cfHeight" label="Height" />
        )}
        {width && <SizeSelector variableDefinition={width} variableName="cfWidth" label="Width" />}
        {maxWidth && width && (
          <MaxWidthInput variableDefinition={maxWidth} widthVariableDefinition={width} />
        )}
      </Flex>
    </Flex>
  );
};
