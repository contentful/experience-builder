import { ExperienceTreeNode } from '@contentful/experiences-core/types';
import { CSSProperties, SyntheticEvent } from 'react';

interface ColumnsBaseProps {
  editorMode: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface ColumnsEditorModeProps extends ColumnsBaseProps {
  editorMode: true;
  cfColumns: string;
  node: ExperienceTreeNode;
  renderDropzone: (node: ExperienceTreeNode, props?: Record<string, unknown>) => React.ReactNode;
  dragProps?: unknown;
}

interface ColumnsDeliveryModeProps extends ColumnsBaseProps {
  editorMode: false;
}

interface SingleColumnEditorModeProps extends ColumnsBaseProps {
  editorMode: true;
  node: ExperienceTreeNode;
  renderDropzone: (node: ExperienceTreeNode, props?: Record<string, unknown>) => React.ReactNode;
  cfColumnSpan: string;
  dragProps?: unknown;
  ['data-ctfl-draggable-id']: string;
  style?: CSSProperties;
  className: string;
  onMouseOver: (e: SyntheticEvent<Element, Event>) => void;
  onMouseOut: (e: SyntheticEvent<Element, Event>) => void;
  onMouseDown: (e: SyntheticEvent<Element, Event>) => void;
  onMouseUp: (e: SyntheticEvent<Element, Event>) => void;
  onClick: (e: SyntheticEvent<Element, Event>) => void;
}

interface SingleColumnDeliveryModeProps extends ColumnsBaseProps {
  editorMode: false;
}

export type ColumnsProps = ColumnsEditorModeProps | ColumnsDeliveryModeProps;

export type SingleColumnProps = SingleColumnEditorModeProps | SingleColumnDeliveryModeProps;
