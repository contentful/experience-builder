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
} from '@contentful/experiences-validators';
// TODO: Remove references to 'Composition'
export type {
  /** @deprecated the old type name will be replaced by ExperienceDataSource as of v5 */
  ExperienceDataSource as CompositionDataSource,
  ExperienceDataSource,
  /** @deprecated the old type name will be replaced by ExperienceUnboundValue as of v5 */
  ExperienceUnboundValues as CompositionUnboundValues,
  ExperienceUnboundValues,
  ExperienceComponentSettings,
  /** @deprecated the old type name will be replaced by ComponentPropertyValue as of v5 */
  ComponentPropertyValue as CompositionComponentPropValue,
  ComponentPropertyValue,
  /** @deprecated the old type name will be replaced by ExperienceNode as of v5 */
  ComponentTreeNode as CompositionNode,
  ComponentTreeNode,
  /** @deprecated the old type name will be replaced by PrimitiveValue as of v5 */
  PrimitiveValue as CompositionVariableValueType,
  PrimitiveValue,
  ValuesByBreakpoint,
  Breakpoint,
  SchemaVersions,
  DesignValue,
  UnboundValue,
  BoundValue,
  ComponentValue,
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

export type ComponentDefinitionVariableType =
  | 'Text'
  | 'RichText'
  | 'Number'
  | 'Date'
  | 'Boolean'
  | 'Location'
  | 'Media'
  | 'Object'
  | 'ImageOptions';

export type VariableFormats = 'URL'; // | alphaNum | base64 | email | ipAddress

export type ValidationOption<T extends ComponentDefinitionVariableType> = {
  value: T extends 'Text' ? string : T extends 'Number' ? number : never;
  displayName?: string;
};

export type ComponentDefinitionVariableValidation<T extends ComponentDefinitionVariableType> = {
  required?: boolean;
  in?: ValidationOption<T>[];
  format?: VariableFormats;
};

export interface ComponentDefinitionVariableBase<T extends ComponentDefinitionVariableType> {
  type: T;
  validations?: ComponentDefinitionVariableValidation<T>;
  group?: 'style' | 'content';
  description?: string;
  displayName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: string | boolean | number | Record<any, any> | ImageOptions; //todo: fix typings
}

export type ComponentDefinitionVariable<
  T extends ComponentDefinitionVariableType = ComponentDefinitionVariableType,
  // K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
> =
  // T extends 'Link'
  // ? ComponentDefinitionVariableLink
  // : T extends 'Array'
  // ? { items: { type: K } } & ComponentDefinitionVariableArray<K>
  /*:*/ ComponentDefinitionVariableBase<T>;

export type ComponentDefinition<
  T extends ComponentDefinitionVariableType = ComponentDefinitionVariableType,
> = {
  id: string;
  name: string;
  category?: string;
  thumbnailUrl?: string;
  variables: Partial<Record<ContainerStyleVariableName, ComponentDefinitionVariable<T>>> &
    Record<string, ComponentDefinitionVariable<T>>;
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

// TODO: add conditional typing magic to reduce the number of optionals
export type CompositionComponentNode = {
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
    assembly?: {
      id: string;
      componentId: string;
      nodeLocation: string | null;
    };
    props: Record<string, ComponentPropertyValue>;
    dataSource: ExperienceDataSource;
    unboundValues: ExperienceUnboundValues;
    breakpoints: Breakpoint[];
  };
  children: CompositionComponentNode[];
  parentId?: string;
};

export type CompositionTree = {
  root: CompositionComponentNode;
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
  cfGap: string;
  cfBackgroundImageUrl: OptimizedBackgroundImageAsset | string;
  cfBackgroundImageScaling: 'fit' | 'fill' | 'tile';
  cfBackgroundImageAlignment:
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
  cfBackgroundTargetSize: string;
  cfHyperlink: string;
  cfImageAsset: OptimizedImageAsset | string;
  cfImageOptions: ImageOptions;
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

export type Composition = {
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
  border?: Record<string, { width: string; style: 'solid' | 'dashed' | 'dotted'; color: string }>;
  fontSize?: Record<string, string>;
  lineHeight?: Record<string, string>;
  letterSpacing?: Record<string, string>;
  textColor?: Record<string, string>;
} & RecursiveDesignTokenDefinition;

export type ExperienceEntry = {
  sys: Entry['sys'];
  fields: Composition;
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
};

export type OptimizedBackgroundImageAsset = {
  url: string;
  srcSet?: string[];
  file: AssetFile;
};

export type ImageObjectFitOption = 'initial' | 'contain' | 'cover' | 'none';

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

export type ImageOptions = {
  format?: string;
  width: string;
  height: string;
  objectFit: ImageObjectFitOption;
  objectPosition: ImageObjectPositionOption;
  quality: string;
  sizes: string;
};
