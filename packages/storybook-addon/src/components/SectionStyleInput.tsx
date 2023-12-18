import React, { useCallback, useEffect, useState } from 'react';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';

// import { SECTION_STYLE_ATTRIBUTE_KEY } from '@contentful/experience-builder/dist/types';
import { BackgroundColorInput, BorderInput, DefaultInput } from './StyleSectionComponents';
import { Button, Flex, Text } from '@contentful/f36-components';
import { HorizontalRuleIcon, PlusIcon } from '@contentful/f36-icons';
import { css } from 'emotion';
import { ContainerStyleVariableName } from '@contentful/experience-builder/dist/types';
import { useCompositionCanvasSubscriber } from '@/context/useCompositionCanvasSubscriber';

const styles = {
  expandButton: css({
    padding: '0',
  }),
};

type StyleComponentDefinition = {
  /** Can be selected by clicking the "+" or is filled with default values  */
  expandable: boolean;
  initialValue?: string;
};

const SECTION_STYLE_COMPONENT_MAP = {
  cfBackgroundColor: {
    expandable: true,
    initialValue: 'rgba(255, 255, 255, 1)',
  },
  cfBorder: {
    expandable: true,
  },
} satisfies Partial<Record<ContainerStyleVariableName, StyleComponentDefinition>>;

export const SectionStyleInput = ({
  variableName,
  displayName,
  variableDefinition,
}: {
  variableName: any;
  displayName?: string;
  variableDefinition: ComponentDefinitionVariable<'Text'>;
}) => {
  const { onDesignValueChanged } = useCompositionCanvasSubscriber();

  const variableSectionMetadata = (SECTION_STYLE_COMPONENT_MAP as any)[variableName] as
    | StyleComponentDefinition
    | undefined;

  const defaultValue = String(variableDefinition.defaultValue) ?? '';
  // The store doesn't update the selectedNode immediately in every component.
  // Thus, we need to pass it manually to ensure that we get the most up-to-date value
  // const value = resolveDesignValue(variableName, selectedNode);
  // const hasValueChanged = value !== undefined && value !== defaultValue;
  const hasValueChanged = true;

  const [isExpanded, setExpanded] = useState(hasValueChanged);

  useEffect(() => {
    setExpanded(hasValueChanged);
    // Re-evaluate this only when the breakpoint view was switched or another
    // element selected to avoid collapsing just by changing the value.
    // FIXME: This is not triggered on undo/ redo -> click + for background color and then hit CMD+Z
  }, []);

  const onExpandClick = useCallback(() => {
    const defaultValue = String(variableDefinition.defaultValue) ?? '';
    const nextState = !isExpanded;
    if (isExpanded) {
      // Removing the value makes it fallback to default instead of inheriting again from another breakpoint.
      // Luckily, this doesn't cause a re-rendering. So we can set expanded to true without the effect
      // overwriting it again.
      onDesignValueChanged(variableName, defaultValue);
    } else {
      onDesignValueChanged(variableName, variableSectionMetadata?.initialValue);
    }
    setExpanded(nextState);
  }, [
    variableDefinition.defaultValue,
    isExpanded,
    onDesignValueChanged,
    variableName,
    variableSectionMetadata,
  ]);

  if (!variableSectionMetadata) {
    return null;
  }

  const shouldRenderInput = !variableSectionMetadata.expandable || isExpanded;

  const renderInputComponent = () => {
    if (!shouldRenderInput) {
      return null;
    }

    if (variableName === 'cfBackgroundColor') {
      return (
        <BackgroundColorInput variableDefinition={variableDefinition} variableName={variableName} />
      );
    }

    if (variableName === 'cfBorder') {
      return <BorderInput variableDefinition={variableDefinition} variableName={variableName} />;
    }

    return (
      <DefaultInput
        key={variableName}
        variableDefinition={variableDefinition}
        variableName={variableName}
      />
    );
  };

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontColor="gray700" fontWeight="fontWeightMedium">
          {displayName || variableName}
        </Text>
        <Button
          size="small"
          variant="transparent"
          type="button"
          className={styles.expandButton}
          onClick={onExpandClick}>
          {isExpanded ? <HorizontalRuleIcon variant="muted" /> : <PlusIcon variant="muted" />}
        </Button>
      </Flex>
      {renderInputComponent()}
    </>
  );
};
