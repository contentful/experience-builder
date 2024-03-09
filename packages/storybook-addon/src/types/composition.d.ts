import { ComponentDefinition } from '@contentful/experiences-sdk-react';
import React from 'react';

export interface CompositionComponent<P = object> extends React.FC<P> {
  ComponentDefinition: ComponentDefinition;
}
