import React, { useMemo } from 'react';
import { Box, Flex, Paragraph, Text } from '@contentful/f36-components';
import { css } from 'emotion';

import tokens from '@contentful/f36-tokens';
import CompositionFallBackIcon from '@svg/composition/composition-fall-back-icon.svg';
import { StyleInputBoolean, StyleInputNumber, StyleInputText } from './StyleInputFields';
import {
  CONTENTFUL_SECTION_ID,
  CONTENTFUL_CONTAINER_ID,
  ComponentDefinition,
} from '@contentful/experience-builder';
import { StyleInputSelect } from './StyleInputFields/StyleInputSelect';
import { SectionStyles } from './SectionStyles';

import { AffectedBreakpoints, BreakpointInheritanceTree } from './StyleSectionComponents';
import { capitalizeFirstLetter } from '@/utils/strings';

const styles = {
  wrapper: css({
    padding: tokens.spacingM,
    overflow: 'auto',
  }),
  paragraph: css({
    color: tokens.gray600,
    borderBottom: `1px solid ${tokens.gray300}`,
    paddingBottom: tokens.spacingXs,
  }),
  emptyStateWrapper: css({
    height: '60vh',
    marginTop: tokens.spacing2Xl,
    justifyContent: 'center',
  }),
  emptyStateParagraph: css({
    marginTop: tokens.spacingM,
    textAlign: 'center',
    width: '200px',
    color: tokens.gray500,
  }),
  emptyStateSvg: css({
    width: '70px',
    height: '70px',
  }),
  customOptionsHeader: css({
    paddingTop: '16px',
    paddingBottom: '4px',
  }),
};

type StylesTabProps = {
  componentDefinition: ComponentDefinition;
};

const StylesTab = ({ componentDefinition }: StylesTabProps) => {
  const inputFields = useMemo(() => {
    const fields: JSX.Element[] = [];
    if (componentDefinition) {
      for (const [variableName, variableDefinition] of Object.entries(
        componentDefinition.variables
      )) {
        if (variableName.startsWith('cf')) {
          continue;
        }
        if (variableDefinition.group === 'style') {
          // const savedValue = resolveDesignValue(variableName);
          // const defaultValue = savedValue ?? variableDefinition.defaultValue;

          const defaultValue = variableDefinition.defaultValue;

          const hasOptions =
            variableDefinition.validations?.in && variableDefinition.validations?.in.length > 0;

          switch (variableDefinition.type) {
            case 'Text':
              fields.push(
                hasOptions ? (
                  <StyleInputSelect<string>
                    key={`${variableName}-${componentDefinition.id}`}
                    name={variableName}
                    displayName={
                      variableDefinition.displayName || capitalizeFirstLetter(variableName)
                    }
                    defaultValue={defaultValue}
                    options={variableDefinition.validations?.in || []}
                  />
                ) : (
                  <StyleInputText
                    key={`${variableName}-${componentDefinition.id}`}
                    name={variableName}
                    displayName={
                      variableDefinition.displayName || capitalizeFirstLetter(variableName)
                    }
                    defaultValue={defaultValue}
                  />
                )
              );
              break;
            case 'Number':
              fields.push(
                hasOptions ? (
                  <StyleInputSelect<number>
                    key={`${variableName}-${componentDefinition.id}`}
                    name={variableName}
                    displayName={
                      variableDefinition.displayName || capitalizeFirstLetter(variableName)
                    }
                    defaultValue={defaultValue}
                    options={variableDefinition.validations?.in || []}
                  />
                ) : (
                  <StyleInputNumber
                    key={`${variableName}-${componentDefinition.id}`}
                    name={variableName}
                    displayName={
                      variableDefinition.displayName || capitalizeFirstLetter(variableName)
                    }
                    defaultValue={defaultValue}
                  />
                )
              );
              break;
            case 'Boolean':
              fields.push(
                <StyleInputBoolean
                  key={`${variableName}-${componentDefinition.id}`}
                  name={variableName}
                  displayName={
                    variableDefinition.displayName || capitalizeFirstLetter(variableName)
                  }
                  defaultValue={defaultValue}
                />
              );
              break;
            default:
              // eslint-disable-next-line no-console
              console.warn('Received unsupported field type: ' + variableDefinition.type);
          }
        }
      }
    }

    return fields;
  }, [componentDefinition]);

  const hasStyleVariables =
    componentDefinition &&
    Object.values(componentDefinition.variables).find(
      (variableDefinition) => variableDefinition.group === 'style'
    );

  if (!componentDefinition) {
    return (
      <Flex className={styles.wrapper}>
        <BreakpointInheritanceTree />
      </Flex>
    );
  }

  if (!componentDefinition || !hasStyleVariables) {
    return (
      <Flex flexDirection="column" alignItems="center" className={styles.emptyStateWrapper}>
        <Box as="div" className={styles.emptyStateSvg}>
          <CompositionFallBackIcon />
        </Box>
        <Paragraph className={styles.emptyStateParagraph}>
          {!componentDefinition
            ? 'Select a component to view content options'
            : 'No design options available for the selected component'}
        </Paragraph>
      </Flex>
    );
  }

  return (
    <>
      <Flex className={styles.wrapper} gap="spacingM" flexDirection="column" flexGrow="1">
        <SectionStyles selectedComponentDefinition={componentDefinition} />
        {![CONTENTFUL_SECTION_ID, CONTENTFUL_CONTAINER_ID].includes(componentDefinition.id) && (
          <>
            {inputFields.length > 0 && (
              <Text
                fontColor="gray400"
                fontWeight="fontWeightDemiBold"
                fontSize="fontSizeM"
                className={styles.customOptionsHeader}>
                CUSTOM OPTIONS
              </Text>
            )}
            {inputFields}
          </>
        )}
      </Flex>
      <AffectedBreakpoints />
    </>
  );
};

export { StylesTab };
