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
  ComponentMoveStarted: 'componentMoveStarted',
  ComponentMoveEnded: 'componentMoveEnded',
  OutsideCanvasClick: 'outsideCanvasClick',
};

export const INCOMING_EVENTS = {
  RequestEditorMode: 'requestEditorMode',
  CompositionUpdated: 'componentTreeUpdated',
  ComponentDraggingChanged: 'componentDraggingChanged',
  ComponentDragCanceled: 'componentDragCanceled',
  ComponentDragStarted: 'componentDragStarted',
  ComponentDragEnded: 'componentDragEnded',
  ComponentMoveEnded: 'componentMoveEnded',
  CanvasResized: 'canvasResized',
  SelectComponent: 'selectComponent',
  HoverComponent: 'hoverComponent',
  UpdatedEntity: 'updatedEntity',
  AssembliesAdded: 'assembliesAdded',
  AssembliesRegistered: 'assembliesRegistered',
  InitEditor: 'initEditor',
  MouseMove: 'mouseMove',
};

export const INTERNAL_EVENTS = {
  ComponentsRegistered: 'cfComponentsRegistered',
  VisualEditorInitialize: 'cfVisualEditorInitialize',
};

export const VISUAL_EDITOR_EVENTS = {
  Ready: 'cfVisualEditorReady',
};

export const VISUAL_EDITOR_CONTAINER_ID = 'cf-visual-editor';
export const CONTENTFUL_COMPONENT_CATEGORY = 'contentful-component';
export const CONTENTFUL_DEFAULT_CATEGORY = 'Contentful';

export const CONTENTFUL_COMPONENTS = {
  section: {
    id: 'contentful-section',
    name: 'Section',
  },
  container: {
    id: 'contentful-container',
    name: 'Container',
  },
  columns: {
    id: 'contentful-columns',
    name: 'Columns',
  },
  singleColumn: {
    id: 'contentful-single-column',
    name: 'Column',
  },
  button: {
    id: 'button',
    name: 'Button',
  },
  heading: {
    id: 'heading',
    name: 'Heading',
  },
  image: {
    id: 'image',
    name: 'Image',
  },
  richText: {
    id: 'richText',
    name: 'Rich Text',
  },
  text: {
    id: 'text',
    name: 'Text',
  },
};

export const ASSEMBLY_NODE_TYPE = 'assembly';
export const ASSEMBLY_DEFAULT_CATEGORY = 'Assemblies';
export const ASSEMBLY_BLOCK_NODE_TYPE = 'assemblyBlock';
export const ASSEMBLY_NODE_TYPES = [ASSEMBLY_NODE_TYPE, ASSEMBLY_BLOCK_NODE_TYPE];
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
  'cfImageAsset',
  'cfImageFormat',
  'cfImageHeight',
  'cfImageObjectFit',
  'cfImageObjectPosition',
  'cfImageQuality',
  'cfImageSizes',
  'cfImageWidth',
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

export const EMPTY_CONTAINER_HEIGHT = '80px';

export const DEFAULT_IMAGE_WIDTH = '500px';

export enum PostMessageMethods {
  REQUEST_ENTITIES = 'REQUEST_ENTITIES',
  REQUESTED_ENTITIES = 'REQUESTED_ENTITIES',
}

export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'png', 'webp', 'gif', 'avif'] as const;
