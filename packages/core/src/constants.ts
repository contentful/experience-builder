export const SCROLL_STATES = {
  Start: 'scrollStart',
  IsScrolling: 'isScrolling',
  End: 'scrollEnd',
};

export const OUTGOING_EVENTS = {
  Connected: 'connected',
  DesignTokens: 'registerDesignTokens',
  HoveredSection: 'hoveredSection',
  MouseMove: 'mouseMove',
  NewHoveredElement: 'newHoveredElement',
  ComponentSelected: 'componentSelected',
  RegisteredComponents: 'registeredComponents',
  RequestComponentTreeUpdate: 'requestComponentTreeUpdate',
  ComponentDragCanceled: 'componentDragCanceled',
  ComponentDropped: 'componentDropped',
  ComponentMoved: 'componentMoved',
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
  ComponentDragCanceled: 'componentDragCanceled',
  ComponentDragStarted: 'componentDragStarted',
  ComponentDragEnded: 'componentDragEnded',
  CanvasResized: 'canvasResized',
  SelectComponent: 'selectComponent',
  HoverComponent: 'hoverComponent',
  UpdatedEntity: 'updatedEntity',
  /**
   * @deprecated use `AssembliesAdded` instead. This will be removed in version 5.
   * In the meanwhile, the experience builder will send the old and the new event to support multiple SDK versions.
   */
  DesignComponentsAdded: 'designComponentsAdded',
  /**
   * @deprecated use `AssembliesRegistered` instead. This will be removed in version 5.
   * In the meanwhile, the experience builder will send the old and the new event to support multiple SDK versions.
   */
  DesignComponentsRegistered: 'designComponentsRegistered',
  AssembliesAdded: 'assembliesAdded',
  AssembliesRegistered: 'assembliesRegistered',
  InitEditor: 'initEditor',
};

export const INTERNAL_EVENTS = {
  ComponentsRegistered: 'cfComponentsRegistered',
  VisualEditorInitialize: 'cfVisualEditorInitialize',
};

export const VISUAL_EDITOR_EVENTS = {
  Ready: 'cfVisualEditorReady',
};

export const VISUAL_EDITOR_CONTAINER_ID = 'cf-visual-editor';
export const CONTENTFUL_SECTION_ID = 'cf-section'; // TODO: remove me once all customers are using 2023-09-28 schema version
export const CONTENTFUL_CONTAINER_ID = 'contentful-container';
export const CONTENTFUL_COLUMNS_ID = 'contentful-columns';
export const CONTENTFUL_SINGLE_COLUMN_ID = 'contentful-single-column';
export const CONTENTFUL_SECTION_NAME = 'Section'; // TODO: remove me once all customers are using 2023-09-28 schema version
export const CONTENTFUL_COLUMNS_NAME = 'Columns';
export const CONTENTFUL_SINGLE_COLUMN_NAME = 'Column';
export const CONTENTFUL_CONTAINER_NAME = 'Container';
export const CONTENTFUL_COMPONENT_CATEGORY = 'contentful-component';
export const ASSEMBLY_NODE_TYPE = 'assembly';
export const ASSEMBLY_DEFAULT_CATEGORY = 'Assemblies';
export const ASSEMBLY_BLOCK_NODE_TYPE = 'assemblyBlock';
export const ASSEMBLY_NODE_TYPES = [ASSEMBLY_NODE_TYPE, ASSEMBLY_BLOCK_NODE_TYPE];

/** @deprecated use `ASSEMBLY_NODE_TYPE` instead. This will be removed in version 5. */
export const DESIGN_COMPONENT_NODE_TYPE = 'designComponent';
/** @deprecated use `ASSEMBLY_DEFAULT_CATEGORY` instead. This will be removed in version 5. */
export const DESIGN_COMPONENT_DEFAULT_CATEGORY = 'Design Components';
/** @deprecated use `ASSEMBLY_BLOCK_NODE_TYPE` instead. This will be removed in version 5. */
export const DESIGN_COMPONENT_BLOCK_NODE_TYPE = 'designComponentBlock';
/** @deprecated use `ASSEMBLY_NODE_TYPES` instead. This will be removed in version 5. */
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
  'cfFontSize',
  'cfFontWeight',
  'cfLineHeight',
  'cfLetterSpacing',
  'cfTextColor',
  'cfTextAlign',
  'cfTextTransform',
  'cfTextBold',
  'cfTextItalic',
  'cfTextUnderline',
  // For backwards compatibility
  // we need to keep those in this constant array
  // so that omit() in <VisualEditorBlock> and <CompositionBlock>
  // can filter them out and not pass as props
  'cfBackgroundImageAlignmentVertical',
  'cfBackgroundImageAlignmentHorizontal',
];

export enum PostMessageMethods {
  REQUEST_ENTITIES = 'REQUEST_ENTITIES',
  REQUESTED_ENTITIES = 'REQUESTED_ENTITIES',
}
