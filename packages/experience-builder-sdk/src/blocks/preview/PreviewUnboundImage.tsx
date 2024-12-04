'use client';
import React from 'react';
import type {
  ComponentTreeNode,
  CSSProperties,
  PrimitiveValue,
} from '@contentful/experiences-core/types';
import { sanitizeNodeProps } from '@contentful/experiences-core';
import { useClassName } from '../../hooks/useClassName';

interface PreviewUnboundImageProps {
  node: ComponentTreeNode;
  nodeProps: Record<PropertyKey, PrimitiveValue>;
  component: React.ElementType;
}

/**
 * This component is used to render a placeholder Image component in the preview
 * when the image is unbound. It applies the Image size styles to a wrapping div.
 */
const PreviewUnboundImage: React.FC<PreviewUnboundImageProps> = ({
  node,
  nodeProps,
  component,
}) => {
  const wrapperStyle: CSSProperties = {
    position: 'relative',
  };

  const modifiedNodeProps = { ...nodeProps };
  if (typeof modifiedNodeProps.cfImageOptions === 'object') {
    const { width, height, ...restImageOptions } = modifiedNodeProps.cfImageOptions;

    // Apply the Image size styles to the wrapping div
    wrapperStyle.height = String(height);
    wrapperStyle.width = String(width);

    // Set the Image height and width to 100% to fill the wrapping div
    modifiedNodeProps.cfImageOptions = {
      ...restImageOptions,
      height: '100%',
      width: '100%',
    };
  }

  const className = useClassName({ props: modifiedNodeProps, node });

  return (
    <div className="cf-preview-unbound-image" style={wrapperStyle}>
      {React.createElement(component, {
        ...sanitizeNodeProps(modifiedNodeProps),
        className,
      })}
    </div>
  );
};

export default PreviewUnboundImage;
