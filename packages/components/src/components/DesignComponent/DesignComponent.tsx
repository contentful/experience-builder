import { CompositionComponentNode, StyleProps } from '@contentful/experience-builder-core/types';
import React from 'react';

export type DesignComponentProps<EditorMode = boolean> = EditorMode extends true
  ? {
      children?: React.ReactNode;
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      editorMode?: EditorMode;
      node: CompositionComponentNode;
      resolveDesignValue?: any;
      renderDropZone: (
        node: CompositionComponentNode,
        props?: Record<string, any>
      ) => React.ReactNode;
    }
  : Record<string, any>;

const designComponentStyle = { display: 'contents' };

// Feel free to do any magic as regards variable definitions for design components
// Or if this isn't necessary by the time we figure that part out, we can bid this part farewell
export const DesignComponent: React.FC<DesignComponentProps> = (props) => {
  if (props.editorMode) {
    const { node } = props;

    return props.renderDropZone(node, {
      ['data-test-id']: 'contentful-container',
      ['data-cf-node-id']: node.data.id,
      ['data-cf-node-block-id']: node.data.blockId,
      ['data-cf-node-block-type']: node.type,
      id: 'design-component',
      className: props.className,
      style: designComponentStyle,
    });
  }
  // Using a display contents so design component content/children
  // can appear as if they are direct children of the div wrapper's parent
  return <div data-test-id="design-component" {...props} style={designComponentStyle} />;
};
