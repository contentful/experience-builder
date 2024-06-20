import type { Asset, AssetFile, Entry } from 'contentful';
import { SCROLL_STATES, OUTGOING_EVENTS, INCOMING_EVENTS, INTERNAL_EVENTS } from '@/constants';
import { EntityStore } from './entity/EntityStore';
import { Document as RichTextDocument } from '@contentful/rich-text-types';

// Types for experience entry fields (as fetched in the API) are inferred by Zod schema in `@contentful/experiences-validators`
import type {
  ExperienceDataSource,
  ExperienceUnboundValues,
  ExperienceComponentSettings,
  ExperienceUsedComponents,
  ValuesByBreakpoint,
  Breakpoint,
  ComponentPropertyValue,
  PrimitiveValue,
  ExperienceComponentTree,
  ComponentDefinitionPropertyType,
} from '@contentful/experiences-validators';
export type {
  ExperienceDataSource,
  ExperienceUnboundValues,
  ExperienceComponentSettings,
  ComponentPropertyValue,
  ComponentTreeNode,
  PrimitiveValue,
  ValuesByBreakpoint,
  Breakpoint,
  SchemaVersions,
  DesignValue,
  UnboundValue,
  BoundValue,
  ComponentValue,
  ComponentDefinitionPropertyType as ComponentDefinitionVariableType,
} from '@contentful/experiences-validators';

type ScrollStateKey = keyof typeof SCROLL_STATES;
export type ScrollState = (typeof SCROLL_STATES)[ScrollStateKey];

type OutgoingEventKey = keyof typeof OUTGOING_EVENTS;
export type OutgoingEvent = (typeof OUTGOING_EVENTS)[OutgoingEventKey];

type IncomingEventKey = keyof typeof INCOMING_EVENTS;
export type IncomingEvent = (typeof INCOMING_EVENTS)[IncomingEventKey];

type InternalEventKey = keyof typeof INTERNAL_EVENTS;
export type InternalEvent = (typeof INTERNAL_EVENTS)[InternalEventKey];

export interface Link<T extends string> {
  sys: {
    type: 'Link';
    linkType: T;
    id: string;
  };
}

export type VariableFormats = 'URL'; // | alphaNum | base64 | email | ipAddress

export type ValidationOption<T extends ComponentDefinitionPropertyType> = {
  value: T extends 'Text' ? string : T extends 'Number' ? number : never;
  displayName?: string;
};

export type ComponentDefinitionVariableValidation<T extends ComponentDefinitionPropertyType> = {
  required?: boolean;
  in?: ValidationOption<T>[];
  format?: VariableFormats;
};

export interface ComponentDefinitionVariableBase<T extends ComponentDefinitionPropertyType> {
  type: T;
  validations?: ComponentDefinitionVariableValidation<T>;
  group?: 'style' | 'content';
  description?: string;
  displayName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: string | boolean | number | Record<any, any>; //todo: fix typings
}

export type ComponentDefinitionVariable<
  T extends ComponentDefinitionPropertyType = ComponentDefinitionPropertyType,
  // K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
> =
  // T extends 'Link'
  // ? ComponentDefinitionVariableLink
  // : T extends 'Array'
  // ? { items: { type: K } } & ComponentDefinitionVariableArray<K>
  /*:*/ ComponentDefinitionVariableBase<T>;

export type ComponentDefinition<
  T extends ComponentDefinitionPropertyType = ComponentDefinitionPropertyType,
> = {
  id: string;
  name: string;
  category?: string;
  thumbnailUrl?: string;
  hyperlinkPattern?: string;
  variables: Partial<Record<ContainerStyleVariableName, ComponentDefinitionVariable<T>>> &
    Record<string, ComponentDefinitionVariable<T>>;
  slots?: Record<string, { displayName: string }>;
  builtInStyles?: Array<keyof Omit<StyleProps, 'cfHyperlink' | 'cfOpenInNewTab'>>;
  children?: boolean;
  tooltip?: {
    imageUrl?: string;
    description: string;
  };
};

export type ComponentRegistration = {
  component: React.ElementType;
  definition: ComponentDefinition;
  options?: {
    wrapComponent?: boolean;
    wrapContainerTag?: keyof JSX.IntrinsicElements;
  };
};

export type ComponentRegistrationOptions = {
  enabledBuiltInComponents?: string[];
};

export type Binding = {
  spaceId: string;
  environmentId: string;
  entityId: string;
  entityType: 'Entry' | 'Asset' | 'ContentType';
  path: string[];
};

export type ComponentBinding = Record<string, Binding>;
export type BindingMap = Record<string, ComponentBinding>;
export type BindingMapByBlockId = Record<string, BindingMap>;

export type DataSourceEntryValueType = Link<'Entry' | 'Asset'>;

/** Type of a single node of the experience tree exchanged via postMessage between the SDK and Contentful Web app */
export type ExperienceTreeNode = {
  // TODO: add conditional typing magic to reduce the number of optionals
  type:
    | 'block'
    | 'root'
    | 'editorRoot'
    | 'designComponent'
    | 'designComponentBlock'
    | 'assembly'
    | 'assemblyBlock';
  data: {
    id: string;
    blockId?: string; // will be undefined in case string node or if root component
    slotId?: string;
    assembly?: {
      id: string;
      componentId: string;
      nodeLocation: string | null;
    };
    displayName?: string;
    props: Record<string, ComponentPropertyValue>;
    dataSource: ExperienceDataSource;
    unboundValues: ExperienceUnboundValues;
    breakpoints: Breakpoint[];
  };
  children: ExperienceTreeNode[];
  parentId?: string;
};
/** Type of the tree data structure exchanged via postMessage between the SDK and Contentful Web app */
export type ExperienceTree = {
  root: ExperienceTreeNode;
};

export type ExternalSDKMode = 'preview' | 'delivery';
export type InternalSDKMode = ExternalSDKMode | 'editor';

/**
 * Internally defined style variables are prefix with `cf` to avoid
 * collisions with user defined variables.
 */
export type StyleProps = {
  cfHorizontalAlignment: 'start' | 'end' | 'center';
  cfVerticalAlignment: 'start' | 'end' | 'center';
  cfMargin: string;
  cfPadding: string;
  cfBackgroundColor: string;
  cfWidth: string;
  cfMaxWidth: string;
  cfHeight: string;
  cfFlexDirection: 'row' | 'column';
  cfFlexWrap: 'nowrap' | 'wrap';
  cfBorder: string;
  cfBorderRadius: string;
  cfGap: string;
  cfHyperlink: string;
  cfImageAsset: OptimizedImageAsset | string;
  cfImageOptions: ImageOptions;
  cfBackgroundImageUrl: OptimizedBackgroundImageAsset | string;
  cfBackgroundImageOptions: BackgroundImageOptions;
  cfOpenInNewTab: boolean;
  cfFontSize: string;
  cfFontWeight: string;
  cfLineHeight: string;
  cfLetterSpacing: string;
  cfTextColor: string;
  cfTextAlign: 'left' | 'center' | 'right';
  cfTextTransform: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  cfTextBold: boolean;
  cfTextItalic: boolean;
  cfTextUnderline: boolean;
  cfColumns: string;
  cfColumnSpan: string;
  cfColumnSpanLock: boolean;
  cfWrapColumns: boolean;
  cfWrapColumnsCount: string;
};

// We might need to replace this with Record<string, string | number> when we want to be React-agnostic
export type CSSProperties = React.CSSProperties;

export type ContainerStyleVariableName = keyof StyleProps;

export type ExperienceFields = {
  title: string;
  slug: string;
  componentTree: ExperienceComponentTree;
  dataSource: ExperienceDataSource;
  unboundValues: ExperienceUnboundValues;
  usedComponents?: ExperienceUsedComponents | Array<ExperienceEntry>; // This will be either an array of Entry links or an array of resolved Experience entries
  componentSettings?: ExperienceComponentSettings;
};

export type RecursiveDesignTokenDefinition = {
  [key: string]: string | RecursiveDesignTokenDefinition;
};

export type DesignTokensDefinition = {
  spacing?: Record<string, string>;
  sizing?: Record<string, string>;
  color?: Record<string, string>;
  border?: Record<
    string,
    { width?: string; style?: 'solid' | 'dashed' | 'dotted'; color?: string }
  >;
  borderRadius?: Record<string, string>;
  fontSize?: Record<string, string>;
  lineHeight?: Record<string, string>;
  letterSpacing?: Record<string, string>;
  textColor?: Record<string, string>;
} & RecursiveDesignTokenDefinition;

/** Type of experience entry JSON data structure as returned by CPA/CDA */
export type ExperienceEntry = {
  sys: Entry['sys'];
  fields: ExperienceFields;
  metadata: Entry['metadata'];
};

export interface RawCoordinates {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Coordinates extends RawCoordinates {
  childrenCoordinates: RawCoordinates[];
}

export interface HoveredElement {
  blockType: string | undefined;
  nodeId: string | undefined;
  blockId: string | undefined;
}

export interface Experience<T extends EntityStore = EntityStore> {
  hyperlinkPattern?: string;
  entityStore?: T;
}

export type ResolveDesignValueType = (
  valuesByBreakpoint: ValuesByBreakpoint,
  variableName: string,
) => PrimitiveValue;

// The 'contentful' package only exposes CDA types while we received CMA ones in editor mode
export type ManagementEntity = (Entry | Asset) & {
  sys: {
    version: number;
  };
};

export type RequestEntitiesMessage = {
  entityIds: string[];
  entityType: 'Asset' | 'Entry';
  locale: string;
};

export type RequestedEntitiesMessage = {
  entities: Array<Entry | Asset>;
  missingEntityIds?: string[];
};

//All the possible types that can be returned to a component prop
export type BoundComponentPropertyTypes =
  | string
  | number
  | boolean
  | AssetFile
  | Record<string, AssetFile | undefined>
  | RichTextDocument
  | OptimizedBackgroundImageAsset
  | OptimizedImageAsset
  | Link<'Asset'>
  | undefined;

export type OptimizedImageAsset = {
  url: string;
  srcSet?: string[];
  sizes?: string;
  quality?: number;
  format?: string;
  file: AssetFile;
  loading?: ImageLoadingOption;
};

export type OptimizedBackgroundImageAsset = {
  url: string;
  srcSet?: string[];
  file: AssetFile;
};

export type ImageObjectFitOption = 'contain' | 'cover' | 'none';

export type ImageObjectPositionOption =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'center top'
  | 'center center'
  | 'center bottom';

export type ImageLoadingOption = 'lazy' | 'eager';

export type ImageOptions = {
  format?: string;
  width: string;
  height: string;
  loading?: ImageLoadingOption;
  objectFit?: ImageObjectFitOption;
  objectPosition?: ImageObjectPositionOption;
  quality?: string;
  targetSize: string;
};

export type BackgroundImageScalingOption = 'fit' | 'fill' | 'tile';

export type BackgroundImageAlignmentOption =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'left top'
  | 'left center'
  | 'left bottom'
  | 'right top'
  | 'right center'
  | 'right bottom'
  | 'center top'
  | 'center center'
  | 'center bottom';

export type BackgroundImageOptions = {
  format?: string;
  scaling: BackgroundImageScalingOption;
  alignment: BackgroundImageAlignmentOption;
  quality?: string;
  targetSize: string;
};

type ConnectedPayload = undefined | { sdkVersion: string; definitions: ComponentDefinition[] };
type DesignTokensPayload = DesignTokensDefinition;
type RegisteredBreakpointsPayload = { breakpoints: Breakpoint[] };
type MouseMovePayload = { clientX: number; clientY: number };
type NewHoveredElementPayload = { nodeId?: string };
type ComponentSelectedPayload = {
  nodeId: string;
  assembly?: { id: string; componentId: string; nodeLocation: string | null };
};
type RegisteredComponentsPayload = { definitions: ComponentDefinition[] };
type RequestComponentTreeUpdatePayload = undefined;
type ComponentDragCanceledPayload = undefined;
type ComponentDroppedPayload = {
  node: ExperienceTreeNode;
  index: number;
  parentNode: {
    type?: ExperienceTreeNode['type'] | 'root';
    data: { blockId?: string; id?: string };
  };
};
type ComponentMovedPayload = {
  nodeId: string;
  sourceParentId: string;
  destinationParentId: string;
  sourceIndex: number;
  destinationIndex: number;
};
type CanvasReloadPayload = undefined;
type CanvasErrorPayload = Error;
type UpdateSelectedComponentCoordinatesPayload = {
  selectedNodeCoordinates: DOMRect;
  selectedAssemblyChildCoordinates: DOMRect | null;
  parentCoordinates: DOMRect | null;
};
type CanvasScrollPayload = (typeof SCROLL_STATES)[keyof typeof SCROLL_STATES];
type ComponentMoveStartedPayload = undefined;
type ComponentMoveEndedPayload = undefined;
type OutsideCanvasClickPayload = { outsideCanvasClick: boolean };
type SDKFeaturesPayload = Record<string, unknown>;
type RequestEntitiesPayload = {
  entityIds: string[];
  entityType: 'Entry' | 'Asset';
  locale: string;
};

type OUTGOING_EVENT_PAYLOADS = {
  connected: ConnectedPayload;
  registerDesignTokens: DesignTokensPayload;
  registeredBreakpoints: RegisteredBreakpointsPayload;
  mouseMove: MouseMovePayload;
  newHoveredElement: NewHoveredElementPayload;
  componentSelected: ComponentSelectedPayload;
  registeredComponents: RegisteredComponentsPayload;
  requestComponentTreeUpdate: RequestComponentTreeUpdatePayload;
  componentDragCanceled: ComponentDragCanceledPayload;
  componentDropped: ComponentDroppedPayload;
  componentMoved: ComponentMovedPayload;
  canvasReload: CanvasReloadPayload;
  canvasError: CanvasErrorPayload;
  updateSelectedComponentCoordinates: UpdateSelectedComponentCoordinatesPayload;
  canvasScrolling: CanvasScrollPayload;
  componentMoveStarted: ComponentMoveStartedPayload;
  componentMoveEnded: ComponentMoveEndedPayload;
  outsideCanvasClick: OutsideCanvasClickPayload;
  sdkFeatures: SDKFeaturesPayload;
  REQUEST_ENTITIES: RequestEntitiesPayload;
};

export type SendMessageParams = <T extends OutgoingEvent>(
  eventType: T,
  data: OUTGOING_EVENT_PAYLOADS[T],
) => void;

export type OutgoingMessage = {
  [K in keyof OUTGOING_EVENT_PAYLOADS]: {
    source: 'customer-app';
    eventType: K;
    payload: OUTGOING_EVENT_PAYLOADS[K];
  };
}[keyof OUTGOING_EVENT_PAYLOADS];

type Filter<T, U> = T extends U ? T : never;
type SelectedValueTypes = Filter<ComponentPropertyValue['type'], 'UnboundValue' | 'BoundValue'>;

type RequestEditorModePayload = undefined;
type ExperienceUpdatedPayload = {
  tree: ExperienceTree;
  /** @deprecated in favor of assemblies */
  designComponents?: ExperienceUsedComponents;
  assemblies?: ExperienceUsedComponents;
  locale: string;
  /** @deprecated maybe? */
  defaultLocaleCode?: string;
  changedNode?: ExperienceTreeNode;
  changedValueType?: SelectedValueTypes;
};

type ComponentDraggingChangedPayload = {
  isDragging: boolean;
};

type IncomingComponentDragCanceledPayload = undefined;
type ComponentDragStartedPayload = { id: string };
type ComponentDragEndedPayload = undefined;
type IncomingComponentMoveEndedPayload = {
  mouseX: number;
  mouseY: number;
};
type CanvasResizedPayload = {
  selectedNodeId: string;
};
type SelectComponentPayload = {
  selectedNodeId: string;
};
type HoverComponentPayload = {
  hoveredNodeId: string;
};
type UpdatedEntityPayload = {
  entity: ManagementEntity;
  shouldRerender?: boolean;
};
type AssembliesAddedPayload = {
  assembly: ManagementEntity;
  assemblyDefinition: ComponentDefinition;
};
type AssembliesRegisteredPayload = {
  assemblies: ComponentDefinition[];
};
type IncomingMouseMovePayload = {
  mouseX: number;
  mouseY: number;
};
type RequestedEntitiesPayload = {
  entities: ManagementEntity[];
};

type INCOMING_EVENT_PAYLOADS = {
  requestEditorMode: RequestEditorModePayload;
  componentTreeUpdated: ExperienceUpdatedPayload;
  componentDraggingChanged: ComponentDraggingChangedPayload;
  componentDragCanceled: IncomingComponentDragCanceledPayload;
  componentDragStarted: ComponentDragStartedPayload;
  componentDragEnded: ComponentDragEndedPayload;
  componentMoveEnded: IncomingComponentMoveEndedPayload;
  canvasResized: CanvasResizedPayload;
  selectComponent: SelectComponentPayload;
  hoverComponent: HoverComponentPayload;
  updatedEntity: UpdatedEntityPayload;
  assembliesAdded: AssembliesAddedPayload;
  assembliesRegistered: AssembliesRegisteredPayload;
  mouseMove: IncomingMouseMovePayload;
  REQUESTED_ENTITIES: RequestedEntitiesPayload;
};

export type IncomingMessage = {
  [K in keyof INCOMING_EVENT_PAYLOADS]: {
    eventType: K;
    payload: INCOMING_EVENT_PAYLOADS[K];
  };
}[keyof INCOMING_EVENT_PAYLOADS];
