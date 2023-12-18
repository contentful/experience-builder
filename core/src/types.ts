/**
 * danv:
 * NOTE!! The code commented here will be used in future. We commented it out to remove not yet fully unsupported parts
 */

import type { ContentfulClientApi, Entry } from 'contentful';
import type { EntityStore } from '@contentful/visual-sdk';
import { SCROLL_STATES, OUTGOING_EVENTS, INCOMING_EVENTS, INTERNAL_EVENTS } from '@/constants';

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
  | 'Object';
// | 'Link'
// | 'Array'
// export type ComponentDefinitionVariableArrayItemType = 'Link' | 'Symbol' | 'Component'

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
  defaultValue?: string | boolean | number | Record<any, any>; //todo: fix typings
}

// export interface ComponentDefinitionVariableLink extends ComponentDefinitionVariableBase<'Link'> {
//   linkType: 'Entry' | 'Asset'
// }

// export interface ComponentDefinitionVariableArrayOfEntityLinks
//   extends ComponentDefinitionVariableBase<'Array'> {
//   items: {
//     type: 'Link'
//     linkType: 'Entry' | 'Asset'
//   }
// }

// export interface ComponentDefinitionVariableArrayOfPrimitives
//   extends ComponentDefinitionVariableBase<'Array'> {
//   type: 'Array'
// }

// export interface ComponentDefinitionVariableArrayOfComponents {
//   type: 'Array'
//   items: {
//     type: 'Component'
//   }
// }

// export type ComponentDefinitionVariableArray<
//   K extends ComponentDefinitionVariableArrayItemType = ComponentDefinitionVariableArrayItemType
// > = K extends 'Link'
//   ? ComponentDefinitionVariableArrayOfEntityLinks
//   : ComponentDefinitionVariableArrayOfPrimitives

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
};

export type ComponentRegistration = {
  component: React.ElementType;
  definition: ComponentDefinition;
  options?: {
    wrapComponent?: boolean;
    wrapContainerTag?: keyof JSX.IntrinsicElements;
  };
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CompositionVariableValueType = string | boolean | number | Record<any, any> | undefined; //todo: fix typings
type CompositionComponentPropType =
  | 'BoundValue'
  | 'UnboundValue'
  | 'DesignValue'
  | 'ComponentValue';

export type CompositionComponentPropValue<
  T extends CompositionComponentPropType = CompositionComponentPropType,
> = T extends 'DesignValue'
  ? // The keys in valuesByBreakpoint are the breakpoint ids
    { type: T; valuesByBreakpoint: Record<string, CompositionVariableValueType> }
  : T extends 'BoundValue'
    ? { type: T; path: string }
    : { type: T; key: string };

// TODO: add conditional typing magic to reduce the number of optionals
export type CompositionComponentNode = {
  type: 'block' | 'root' | 'editorRoot' | 'designComponent' | 'designComponentBlock';
  data: {
    id: string;
    blockId?: string; // will be undefined in case string node or if root component
    props: Record<string, CompositionComponentPropValue<CompositionComponentPropType>>;
    dataSource: CompositionDataSource;
    unboundValues: CompositionUnboundValues;
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

export enum VisualEditorMode {
  LazyLoad = 'lazyLoad',
  InjectScript = 'injectScript',
}

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
  cfBackgroundImageUrl: string;
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
  cfHyperlink: string;
  cfOpenInNewTab: boolean;
};

// We might need to replace this with Record<string, string | number> when we want to be React-agnostic
export type CSSProperties = React.CSSProperties;

export type ContainerStyleVariableName = keyof StyleProps;

// cda types
export type CompositionNode = {
  definitionId: string;
  children: Array<CompositionNode>;
  variables: Record<string, CompositionComponentPropValue>;
};

export type CompositionDataSource = Record<string, DataSourceEntryValueType>;
export type CompositionUnboundValues = Record<string, { value: CompositionVariableValueType }>;

export type Breakpoint = {
  id: string;
  query: string;
  displayName: string;
  previewSize: string;
};

export type SchemaVersions = '2023-09-28' | '2023-06-27' | '2023-07-26' | '2023-08-23';

export type ExperienceComponentSettings = {
  variableDefinitions: Record<
    string,
    Omit<ComponentDefinitionVariableBase<ComponentDefinitionVariableType>, 'defaultValue'> & {
      defaultValue: CompositionComponentPropValue<'BoundValue' | 'UnboundValue'>;
    }
  >;
};

export type Composition = {
  title: string;
  slug: string;
  componentTree: {
    breakpoints: Array<Breakpoint>;
    children: Array<CompositionNode>;
    schemaVersion: SchemaVersions;
  };
  dataSource: CompositionDataSource;
  unboundValues: CompositionUnboundValues;
  usedComponents?: Array<Link<'Entry'> | ExperienceEntry>;
  componentSettings?: ExperienceComponentSettings;
};

export type DesignTokensDefinition = { [key: string]: Record<string, string> };

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

export interface DeprecatedExperienceStore {
  composition: Composition | undefined;
  entityStore: EntityStore | undefined;
  isLoading: boolean;
  children: Composition['componentTree']['children'];
  breakpoints: Composition['componentTree']['breakpoints'];
  dataSource: Composition['dataSource'];
  unboundValues: Composition['unboundValues'];
  schemaVersion: Composition['componentTree']['schemaVersion'] | undefined;
  fetchBySlug: ({
    experienceTypeId,
    slug,
    localeCode,
  }: {
    experienceTypeId: string;
    slug: string;
    localeCode: string;
  }) => Promise<{ success: boolean; error?: Error }>;
}

export interface Experience<T extends EntityStore = EntityStore> {
  entityStore?: T;
  mode: InternalSDKMode;
}

/**
 * @deprecated please use `Experience` instead
 */
export interface DeprecatedExperience {
  /**
   * @deprecated please don't use
   */
  client: ContentfulClientApi<undefined>;
  /**
   * @deprecated please don't use
   */
  experienceTypeId: string;
  /**
   * @deprecated please don't use
   */
  mode: InternalSDKMode;
}

export type ValuesByBreakpoint =
  | Record<string, CompositionVariableValueType>
  | CompositionVariableValueType;
