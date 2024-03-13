import {
  ExperienceTreeNode,
  ResolveDesignValueType,
  StyleProps,
} from '@contentful/experiences-core/types';
import React from 'react';

type PatternProps<EditorMode = boolean> = EditorMode extends true
  ? {
      children?: React.ReactNode;
      className?: string;
      cfHyperlink?: StyleProps['cfHyperlink'];
      cfOpenInNewTab?: StyleProps['cfOpenInNewTab'];
      editorMode?: EditorMode;
      node: ExperienceTreeNode;
      resolveDesignValue?: ResolveDesignValueType;
      renderDropzone: (
        node: ExperienceTreeNode,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props?: Record<string, any>,
      ) => React.ReactNode;
    }
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>;

const patternStyle = { display: 'contents' };

// Feel free to do any magic as regards variable definitions for patterns
// Or if this isn't necessary by the time we figure that part out, we can bid this part farewell
export const Pattern: React.FC<PatternProps> = (props) => {
  if (props.editorMode) {
    const { node } = props;

    return props.renderDropzone(node, {
      ['data-test-id']: 'contentful-pattern',
      className: props.className,
      style: patternStyle,
    });
  }
  // Using a display contents so pattern content/children
  // can appear as if they are direct children of the div wrapper's parent
  return <div data-test-id="pattern" {...props} style={patternStyle} />;
};
