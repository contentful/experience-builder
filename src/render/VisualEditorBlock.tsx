import tokens from '@contentful/f36-tokens';
import { css } from '@emotion/css';
import React, { useMemo } from 'react';
import { RegisterComponent } from '../registerComponent';
import { sendMessage } from '../sendMessage';
import { VisualEditorTemplate } from './VisualEditorTemplate';

const styles = {
  hover: css({
    display: 'inline-block',
    ':hover': {
      border: `3px solid ${tokens.blue500}`
    }
  })
}

type VisualEditorBlockProps = {
  node: any;
  template?: any;
  boundVariables?: Record<string, any>
}

export const VisualEditorBlock = ({ node, template, boundVariables = {} }: VisualEditorBlockProps) => {
  const { getRegistration } = new RegisterComponent();

  const blockType = node.data.blockId.split(':')[0]
  const blockBoundVariables = boundVariables[node.data.blockId] || {}

  const blockConfiguration = useMemo(() => getRegistration(blockType), [blockType, getRegistration])

  const props = useMemo(() => {
    if (!blockConfiguration) {
      return {};
    }

    return blockConfiguration.variables.reduce((acc, variable) => {
      return {
        ...acc,
        [variable.name]: blockBoundVariables[variable.name]?.value || node.data.props[variable.name] || variable.defaultValue
      };
    }, {});
  }, [blockConfiguration, node, boundVariables]);


  if (node.type === 'template') {
    return <VisualEditorTemplate key={node.data.id} node={node} boundVariables={boundVariables}/>
  }

  if (!blockConfiguration) {
    return null;
  }

  const { component, ...blockConfigurationWithoutComponent } = blockConfiguration;

  const children = node.children.map((childNode: any) => {
    if (childNode.type === 'string') {
      return blockBoundVariables[childNode.data.propKey]?.value || childNode.data.props[childNode.data.propKey]
    }

    return (<VisualEditorBlock node={childNode} key={childNode.data.id} template={template} boundVariables={boundVariables} />)
    });

  console.log('children', node, children);

  return React.createElement(component, {
    onClick: (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      sendMessage('componentSelected', { node, block: template || blockConfigurationWithoutComponent })
    },
    className: styles.hover,
    ...props,
  }, children);
}
