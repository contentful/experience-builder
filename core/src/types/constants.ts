import { InternalSDKMode } from './types';

export const SCROLL_STATES = {
  Start: 'scrollStart',
  IsScrolling: 'isScrolling',
  End: 'scrollEnd',
};

export const OUTGOING_EVENTS = {
  Connected: 'connected',
  HoveredSection: 'hoveredSection',
  MouseMove: 'mouseMove',
  MouseUp: 'mouseUp',
  MouseDown: 'mouseDown',
  NewHoveredElement: 'newHoveredElement',
  ComponentSelected: 'componentSelected',
  RegisteredComponents: 'registeredComponents',
  RequestComponentTreeUpdate: 'requestComponentTreeUpdate',
  ComponentDropped: 'componentDropped',
  CanvasReload: 'canvasReload',
  UpdateSelectedComponentCoordinates: 'updateSelectedComponentCoordinates',
  UpdateHoveredComponentCoordinates: 'updateHoveredComponentCoordinates',
  CanvasScroll: 'canvasScrolling',
  CanvasError: 'canvasError',
};

export const INCOMING_EVENTS = {
  RequestEditorMode: 'requestEditorMode',
  CompositionUpdated: 'componentTreeUpdated',
  ComponentDraggingChanged: 'componentDraggingChanged',
  ComponentDragStarted: 'componentDragStarted',
  CanvasResized: 'canvasResized',
  SelectComponent: 'selectComponent',
  HoverComponent: 'hoverComponent',
  UpdatedEntity: 'updatedEntity',
  DesignComponentsAdded: 'designComponentsAdded',
  InitEditor: 'initEditor',
};

export const INTERNAL_EVENTS = {
  ComponentsRegistered: 'componentsRegistered',
};

export const CONTENTFUL_SECTION_ID = 'contentful-section'; // TODO: remove me once all customers are using 2023-09-28 schema version
export const CONTENTFUL_CONTAINER_ID = 'contentful-container';
export const CONTENTFUL_SECTION_NAME = 'Section'; // TODO: remove me once all customers are using 2023-09-28 schema version
export const CONTENTFUL_CONTAINER_NAME = 'Container';
export const CONTENTFUL_COMPONENT_CATEGORY = 'contentful-component';
export const DESIGN_COMPONENT_NODE_TYPE = 'designComponent';
export const DESIGN_COMPONENT_BLOCK_NODE_TYPE = 'designComponentBlock';
export const DESIGN_COMPONENT_NODE_TYPES = [
  DESIGN_COMPONENT_NODE_TYPE,
  DESIGN_COMPONENT_BLOCK_NODE_TYPE,
];
export const LATEST_SCHEMA_VERSION = '2023-09-28';
export const CF_STYLE_ATTRIBUTES = [
  'cfHorizontalAlignment',
  'cfVerticalAlignment',
  'cfMargin',
  'cfPadding',
  'cfBackgroundColor',
  'cfWidth',
  'cfMaxWidth',
  'cfHeight',
  'cfFlexDirection',
  'cfFlexWrap',
  'cfBorder',
  'cfGap',
  'cfBackgroundImageUrl',
  'cfBackgroundImageScaling',
  'cfBackgroundImageAlignment',
  // For backwards compatibility
  // we need to keep those in this constant array
  // so that omit() in <VisualEditorBlock> and <CompositionBlock>
  // can filter them out and not pass as props
  'cfBackgroundImageAlignmentVertical',
  'cfBackgroundImageAlignmentHorizontal',
];

export const supportedModes: InternalSDKMode[] = ['delivery', 'preview', 'editor'];
