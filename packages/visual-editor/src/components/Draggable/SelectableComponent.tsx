import React, { useRef } from 'react';
import { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import classNames from 'classnames';
import styles from './styles.module.css';
import { Rect } from '@components/Draggable/canvasToolsUtils';
import Placeholder, { PlaceholderParams } from './Placeholder';
import { useDraggedItemStore } from '@/store/draggedItem';
import Tooltip from './Tooltip';

interface SelectableComponentProps {
  placeholder: PlaceholderParams;
  wrapperProps: Record<string, string | undefined>;
  tooltipLabel: string;
  children: ReactNode;
  id: string;
  isAssemblyBlock?: boolean;
  isSelected?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMouseDown?: (e: SyntheticEvent) => void;
  onMouseUp?: (e: SyntheticEvent) => void;
  onMouseOver?: (e: SyntheticEvent) => void;
  onMouseOut?: (e: SyntheticEvent) => void;
  coordinates: Rect | null;
  isContainer: boolean;
  blockId?: string;
  style?: CSSProperties;
}

export const SelectableComponent: React.FC<SelectableComponentProps> = ({
  tooltipLabel,
  children,
  id,
  isAssemblyBlock = false,
  isSelected = false,
  onClick = () => null,
  onMouseOver = () => null,
  coordinates,
  style,
  wrapperProps,
  isContainer,
  blockId,
  placeholder,
  ...rest
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const isHoveredComponent = useDraggedItemStore((state) => state.hoveredComponentId === id);

  return (
    <div
      data-ctfl-draggable-id={id}
      data-test-id={`draggable-${blockId ?? 'node'}`}
      ref={(refNode) => {
        ref.current = refNode;
      }}
      {...wrapperProps}
      {...rest}
      className={classNames(styles.DraggableComponent, wrapperProps.className, {
        [styles.isAssemblyBlock]: isAssemblyBlock,
        [styles.isSelected]: isSelected,
        [styles.isHoveringComponent]: isHoveredComponent,
      })}
      style={{
        ...style,
      }}
      onMouseOver={onMouseOver}
      onClick={onClick}>
      <Tooltip
        id={id}
        coordinates={coordinates}
        isAssemblyBlock={isAssemblyBlock}
        isContainer={isContainer}
        label={tooltipLabel}
      />
      <Placeholder {...placeholder} id={id} />
      {children}
    </div>
  );
};
