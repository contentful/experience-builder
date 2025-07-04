import { StructureComponentProps } from '@contentful/experiences-core/types';
import React, { HTMLAttributes } from 'react';

export type AssemblyProps = StructureComponentProps<HTMLAttributes<HTMLDivElement>>;

const assemblyStyle = { display: 'contents' };

export const Assembly: React.FC<AssemblyProps> = (props) => {
  // Using a display contents so assembly content/children
  // can appear as if they are direct children of the div wrapper's parent
  return <div data-test-id="assembly" {...props} style={assemblyStyle} />;
};
