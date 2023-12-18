import { ComponentDefinition } from '@contentful/experience-builder';
import React from 'react';

export interface CompositionComponent<P = object> extends React.FC<P> {
  ComponentDefinition: ComponentDefinition;
}
