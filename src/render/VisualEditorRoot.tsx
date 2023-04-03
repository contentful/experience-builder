import { css } from '@emotion/css';
import React, { useEffect } from 'react';
import { VisualEditorBlock } from './VisualEditorBlock';

const rootStyles = css({
  height: '100%'
});

type VisualEditorRootProps = {
  visualEditorData?: Record<string, any>
  boundVariables?: Record<string, any>
}

export const VisualEditorRoot = ({ visualEditorData = {}, boundVariables = {}}: VisualEditorRootProps) => {
  if (!visualEditorData.root) {
    return null;
  }

	console.log('I got here visualEditorDatavisualEditorDatavisualEditorData', visualEditorData)
  
  return React.createElement('div', {}, visualEditorData.root.children.map((node: any) => (
    <VisualEditorBlock key={node.data.id} node={node} boundVariables={boundVariables} />
  )));
};
