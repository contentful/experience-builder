import { CompositionComponent } from '@/types/composition';
import { ComponentDefinition } from '@contentful/experience-builder';
import React from 'react';

export interface CFProps {
  className?: string;
  classes?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  'data-cf-node-id'?: string;
  'data-cf-node-block-id'?: string;
  'data-cf-node-block-type'?: string;
}

export function withExperienceBuilder<T extends object>(
  Component: React.ComponentType<T>,
  options: ComponentDefinition
) {
  const Wrapped: CompositionComponent<CFProps & T> = ({
    classes,
    className,
    onMouseDown,
    onMouseUp,
    onClick,
    'data-cf-node-id': dataCfNodeId,
    'data-cf-node-block-id': dataCfNodeBlockId,
    'data-cf-node-block-type': dataCfNodeBlockType,
    ...props
  }) => (
    <div
      className={className}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
      data-cf-node-id={dataCfNodeId}
      data-cf-node-block-id={dataCfNodeBlockId}
      data-cf-node-block-type={dataCfNodeBlockType}>
      <Component className={classes} {...(props as T)} />
    </div>
  );
  Wrapped.ComponentDefinition = options;
  return Wrapped;
}
