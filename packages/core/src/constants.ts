/** @deprecated will be removed when dropping backward compatibility for old DND */
export const SCROLL_STATES = {
  Start: 'scrollStart',
  IsScrolling: 'isScrolling',
  End: 'scrollEnd',
} as const;

export const OUTGOING_EVENTS = {
  Connected: 'connected',
  DesignTokens: 'registerDesignTokens',
  RegisteredBreakpoints: 'registeredBreakpoints',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  MouseMove: 'mouseMove',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  ComponentSelected: 'componentSelected',
  RegisteredComponents: 'registeredComponents',
  RequestComponentTreeUpdate: 'requestComponentTreeUpdate',
  CanvasReload: 'canvasReload',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  UpdateSelectedComponentCoordinates: 'updateSelectedComponentCoordinates',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  CanvasScroll: 'canvasScrolling',
  CanvasError: 'canvasError',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  OutsideCanvasClick: 'outsideCanvasClick',
  SDKFeatures: 'sdkFeatures',
  RequestEntities: 'REQUEST_ENTITIES',
} as const;

export const INCOMING_EVENTS = {
  RequestEditorMode: 'requestEditorMode',
  RequestReadOnlyMode: 'requestReadOnlyMode',
  ExperienceUpdated: 'componentTreeUpdated',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  ComponentDraggingChanged: 'componentDraggingChanged',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  ComponentDragCanceled: 'componentDragCanceled',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  ComponentDragStarted: 'componentDragStarted',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  ComponentDragEnded: 'componentDragEnded',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  ComponentMoveEnded: 'componentMoveEnded',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  CanvasResized: 'canvasResized',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  SelectComponent: 'selectComponent',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
  HoverComponent: 'hoverComponent',
  UpdatedEntity: 'updatedEntity',
  AssembliesAdded: 'assembliesAdded',
  AssembliesRegistered: 'assembliesRegistered',
  /** @deprecated will be removed when dropping backward compatibility for old DND */
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
  // For backwards compatibility
  // we need to keep those in this constant array
  // so that omit() in <VisualEditorBlock> and <CompositionBlock>
  // can filter them out and not pass as props
  'cfBackgroundImageScaling',
  'cfBackgroundImageAlignment',
  'cfBackgroundImageAlignmentVertical',
  'cfBackgroundImageAlignmentHorizontal',
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
