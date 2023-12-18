import React from 'react';
import { ComponentDefinition } from '@contentful/experience-builder';
import {
  ComponentDefinitionVariable,
  ComponentDefinitionVariableType,
} from '@contentful/experience-builder/dist/types';
import { Flex, Text } from '@contentful/f36-components';
import {
  AlignmentInput,
  SpacingComponent,
  DistributionComponent,
  SizeInput,
  BackgroundImageInput,
} from './StyleSectionComponents';
import { SectionStyleInput } from './SectionStyleInput';

interface SectionStylesProps {
  selectedComponentDefinition: ComponentDefinition<ComponentDefinitionVariableType>;
}

export const SectionStyles = ({ selectedComponentDefinition }: SectionStylesProps) => {
  const {
    cfHorizontalAlignment: horizontalAlignment,
    cfVerticalAlignment: verticalAlignment,
    cfHeight: height,
    cfWidth: width,
    cfMaxWidth: maxWidth,
    cfFlexDirection: flexDirection,
    cfFlexWrap: flexWrap,
    cfGap: gap,
    cfBackgroundImageScaling: backgroundImageScaling,
    cfBackgroundImageAlignment,
    cfBackgroundImageUrl: _backgroundImageUrl,
    cfMargin: margin,
    cfPadding: padding,
    ...rest
  } = selectedComponentDefinition.variables;

  const shouldShowBackgroundImageRelatedWidgets = false;
  // const shouldShowBackgroundImageRelatedWidgets =
  //   selectedNode.hasAssignedBinding('cfBackgroundImageUrl') ||
  //   selectedNode.hasNonEmptyUnboundValue('cfBackgroundImageUrl');

  return (
    <>
      <Flex flexDirection="column" gap="spacingXs">
        {(horizontalAlignment ||
          verticalAlignment ||
          margin ||
          padding ||
          flexDirection ||
          gap ||
          flexWrap) && (
          <Text fontColor="gray700" fontWeight="fontWeightMedium">
            Layout
          </Text>
        )}
        <AlignmentInput
          horizontalAlignment={horizontalAlignment as ComponentDefinitionVariable<'Text'>}
          verticalAlignment={verticalAlignment as ComponentDefinitionVariable<'Text'>}
        />
        <SpacingComponent
          margin={margin as ComponentDefinitionVariable<'Text'>}
          padding={padding as ComponentDefinitionVariable<'Text'>}
        />
        <DistributionComponent
          flexDirection={flexDirection as ComponentDefinitionVariable<'Text'>}
          gap={gap as ComponentDefinitionVariable<'Text'>}
          flexWrap={flexWrap as ComponentDefinitionVariable<'Text'>}
        />
      </Flex>
      {(height || width || maxWidth) && (
        <SizeInput
          height={height as ComponentDefinitionVariable<'Text'>}
          width={width as ComponentDefinitionVariable<'Text'>}
          maxWidth={maxWidth as ComponentDefinitionVariable<'Text'>}
        />
      )}
      {Object.entries(rest).map(([name, variableDefinition]) => {
        return (
          <SectionStyleInput
            key={`${name}-${selectedComponentDefinition.id}`}
            variableName={name}
            displayName={variableDefinition.displayName}
            variableDefinition={variableDefinition as ComponentDefinitionVariable<'Text'>}
          />
        );
      })}

      {shouldShowBackgroundImageRelatedWidgets && (
        <BackgroundImageInput
          backgroundImageScaling={backgroundImageScaling as ComponentDefinitionVariable<'Text'>}
          backgroundImageAlignment={
            cfBackgroundImageAlignment as ComponentDefinitionVariable<'Text'>
          }
        />
      )}
    </>
  );
};
