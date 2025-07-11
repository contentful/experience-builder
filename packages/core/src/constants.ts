export const SCROLL_STATES = {
  Start: 'scrollStart',
  IsScrolling: 'isScrolling',
  End: 'scrollEnd',
} as const;

export const OUTGOING_EVENTS = {
  Connected: 'connected',
  DesignTokens: 'registerDesignTokens',
  RegisteredBreakpoints: 'registeredBreakpoints',
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
  CanvasScroll: 'canvasScrolling',
  CanvasError: 'canvasError',
  ComponentMoveStarted: 'componentMoveStarted',
  ComponentMoveEnded: 'componentMoveEnded',
  OutsideCanvasClick: 'outsideCanvasClick',
  SDKFeatures: 'sdkFeatures',
  RequestEntities: 'REQUEST_ENTITIES',
} as const;

export const INCOMING_EVENTS = {
  RequestEditorMode: 'requestEditorMode',
  RequestReadOnlyMode: 'requestReadOnlyMode',
  ExperienceUpdated: 'componentTreeUpdated',
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
  MouseMove: 'mouseMove',
  RequestedEntities: 'REQUESTED_ENTITIES',
} as const;

export const INTERNAL_EVENTS = {
  ComponentsRegistered: 'cfComponentsRegistered',
  VisualEditorInitialize: 'cfVisualEditorInitialize',
} as const;

export const VISUAL_EDITOR_EVENTS = {
  Ready: 'cfVisualEditorReady',
};

/**
 * These modes are ONLY intended to be internally used within the context of
 * editing an experience inside of Contentful Studio. i.e. these modes
 * intentionally do not include preview/delivery modes.
 */
export enum StudioCanvasMode {
  READ_ONLY = 'readOnlyMode',
  EDITOR = 'editorMode',
  NONE = 'none',
}

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
    id: 'contentful-button',
    name: 'Button',
  },
  heading: {
    id: 'contentful-heading',
    name: 'Heading',
  },
  image: {
    id: 'contentful-image',
    name: 'Image',
  },
  richText: {
    id: 'contentful-richText',
    name: 'Rich Text',
  },
  text: {
    id: 'contentful-text',
    name: 'Text',
  },
  divider: {
    id: 'contentful-divider',
    name: 'Divider',
  },
  carousel: {
    id: 'contentful-carousel',
    name: 'Carousel',
  },
} as const;

export const ASSEMBLY_NODE_TYPE = 'assembly';
export const ASSEMBLY_DEFAULT_CATEGORY = 'Assemblies';
export const ASSEMBLY_BLOCK_NODE_TYPE = 'assemblyBlock';
export const ASSEMBLY_NODE_TYPES = [ASSEMBLY_NODE_TYPE, ASSEMBLY_BLOCK_NODE_TYPE];
export const LATEST_SCHEMA_VERSION = '2023-09-28';
export const CF_STYLE_ATTRIBUTES = [
  'cfVisibility',
  'cfHorizontalAlignment',
  'cfVerticalAlignment',
  'cfMargin',
  'cfPadding',
  'cfBackgroundColor',
  'cfWidth',
  'cfMaxWidth',
  'cfHeight',
  'cfImageAsset',
  'cfImageOptions',
  'cfBackgroundImageUrl',
  'cfBackgroundImageOptions',
  'cfFlexDirection',
  'cfFlexWrap',
  'cfFlexReverse',
  'cfBorder',
  'cfBorderRadius',
  'cfGap',
  'cfColumnSpan',
  'cfColumnSpanLock',
  'cfColumns',
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
];

export const EMPTY_CONTAINER_HEIGHT = '80px';

export const HYPERLINK_DEFAULT_PATTERN = `/{locale}/{entry.fields.slug}/`;

export const DEFAULT_IMAGE_WIDTH = '500px';

export enum PostMessageMethods {
  REQUEST_ENTITIES = 'REQUEST_ENTITIES',
  REQUESTED_ENTITIES = 'REQUESTED_ENTITIES',
}

export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'png', 'webp', 'gif', 'avif'] as const;

export const PATTERN_PROPERTY_DIVIDER = '-----';

export const SIDELOADED_PREFIX = 'sideloaded_';
