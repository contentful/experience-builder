import React from 'react';
import CompositionTextIcon from '@svg/composition/composition-icon-text.svg';
import CompositionLocationIcon from '@svg/composition/composition-icon-location.svg';
import CompositionDateIcon from '@svg/composition/composition-icon-date.svg';
import CompositionCodeIcon from '@svg/composition/composition-icon-code.svg';
import { ComponentDefinitionVariableType } from '@contentful/experience-builder';
import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';

const styles = {
  root: css({
    marginRight: tokens.spacing2Xs,
  }),
};

const variableTypeToIconMap = {
  Text: CompositionTextIcon,
  Location: CompositionLocationIcon,
  Date: CompositionDateIcon,
  Object: CompositionCodeIcon,
  RichText: undefined as any,
  Number: undefined as any,
  Boolean: undefined as any,
} satisfies Record<ComponentDefinitionVariableType, any>;

type VariableIconProps = {
  variableType: ComponentDefinitionVariableType;
};

export const VariableIcon = ({ variableType }: VariableIconProps) => {
  const TypeIcon = variableTypeToIconMap[variableType];
  if (!TypeIcon) return null;

  // return <TypeIcon className={styles.root} />;

  // return <img src={TypeIcon} className={styles.root} />;
  return null;
};
