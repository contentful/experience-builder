import { ComponentDefinition } from '@contentful/experiences-sdk-react';
import React from 'react';

export interface ExperienceComponent<P = object> extends React.FC<P> {
  ComponentDefinition: ComponentDefinition;
}
