import {
  CompositionComponentNode,
  ResolveDesignValueType,
  StyleProps,
} from '@contentful/experiences-core/types';
import React from 'react';

export type AssemblyProps<EditorMode = boolean> = EditorMode extends true
  ? {
      children?: React.ReactNode;
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      editorMode?: EditorMode;
      node: CompositionComponentNode;
      resolveDesignValue?: ResolveDesignValueType;
      renderDropzone: (
        node: CompositionComponentNode,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props?: Record<string, any>,
      ) => React.ReactNode;
    }
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>;

const assemblyStyle = { display: 'contents' };

// Feel free to do any magic as regards variable definitions for assemblies
// Or if this isn't necessary by the time we figure that part out, we can bid this part farewell
export const Assembly: React.FC<AssemblyProps> = (props) => {
  if (props.editorMode) {
    const { node } = props;

    return props.renderDropzone(node, {
      ['data-test-id']: 'contentful-assembly',
      className: props.className,
      style: assemblyStyle,
    });
  }
  // Using a display contents so assembly content/children
  // can appear as if they are direct children of the div wrapper's parent
  return <div data-test-id="assembly" {...props} style={assemblyStyle} />;
};
