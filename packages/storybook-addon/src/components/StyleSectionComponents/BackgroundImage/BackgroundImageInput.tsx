import React from 'react';
import type { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { Flex, Text } from '@contentful/f36-components';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { BackgroundImageSettingsSelector } from './BackgroundImageSettingsSelector';
import { BackgroundImageAlignmentInput } from './BackgroundImageAlignmentInput';

const styles = {
  label: css({
    display: 'inline-block',
    padding: `${tokens.spacingXs} 0`,
    color: tokens.gray500,
    fontWeight: tokens.fontWeightDemiBold,
  }),
};

type BackgroundImageInputProps = {
  backgroundImageScaling?: ComponentDefinitionVariable<'Text'>;
  backgroundImageAlignment?: ComponentDefinitionVariable<'Text'>;
};

export const BackgroundImageInput = ({
  backgroundImageAlignment,
  backgroundImageScaling,
}: BackgroundImageInputProps) => {
  return (
    <Flex flexDirection="column">
      <Text color="gray500" fontWeight="fontWeightNormal" className={styles.label}>
        Background Image
      </Text>
      <Flex flexDirection="column" gap="spacingS">
        {!!backgroundImageScaling && (
          <BackgroundImageSettingsSelector
            variableDefinition={backgroundImageScaling}
            variableName="cfBackgroundImageScaling"
          />
        )}
        {!!backgroundImageAlignment && (
          <BackgroundImageAlignmentInput
            variableName="cfBackgroundImageAlignment"
            variableDefinition={backgroundImageAlignment}
          />
        )}
      </Flex>
    </Flex>
  );
};
