import { useEditorStore } from '@/store/editor';
import {
  buildCfStyles,
  calculateNodeDefaultHeight,
  isLinkToAsset,
  isContentfulStructureComponent,
  transformBoundContentValue,
  resolveHyperlinkPattern,
  isStructureWithRelativeHeight,
  sanitizeNodeProps,
  EntityStoreBase,
  transformVisibility,
} from '@contentful/experiences-core';
import { ASSEMBLY_NODE_TYPE, EMPTY_CONTAINER_SIZE } from '@contentful/experiences-core/constants';
import type {
  StyleProps,
  PrimitiveValue,
  ExperienceTreeNode,
  ResolveDesignValueType,
  ComponentRegistration,
  Link,
  DesignValue,
  StructureComponentProps,
  ComponentPropertyValue,
} from '@contentful/experiences-core/types';
import { useMemo } from 'react';
import { useEditorModeClassName } from './useEditorModeClassName';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { maybeMergePatternDefaultDesignValues } from '@/utils/maybeMergePatternDefaultDesignValues';

import { Entry } from 'contentful';
import { HYPERLINK_DEFAULT_PATTERN } from '@contentful/experiences-core/constants';
import { useTreeStore } from '@/store/tree';

type BaseComponentProps = Partial<StyleProps> &
  Record<string, PrimitiveValue | Link<'Entry'> | Link<'Asset'>>;

type ResolvedComponentProps = StructureComponentProps<
  BaseComponentProps & {
    className: string;
    isInExpEditorMode?: boolean;
  }
>;

type PreboundVariable = {
  type: 'BoundValue';
  path: string;
  isPrebound: boolean;
  pathsByContentType?: Record<string, { path: string }>;
};

const isPreboundProp = (variable: ComponentPropertyValue): variable is PreboundVariable => {
  return (
    variable.type === 'BoundValue' && typeof (variable as PreboundVariable).isPrebound === 'boolean'
  );
};

type UseComponentProps = {
  node: ExperienceTreeNode;
  entityStore: EntityStoreBase;
  areEntitiesFetched: boolean;
  resolveDesignValue: ResolveDesignValueType;
  definition?: ComponentRegistration['definition'];
  options?: ComponentRegistration['options'];
  slotId?: string;
};

export const useComponentProps = ({
  node,
  entityStore,
  areEntitiesFetched,
  resolveDesignValue,
  definition,
  options,
}: UseComponentProps): { componentProps: ResolvedComponentProps } => {
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const hyperlinkPattern = useEditorStore((state) => state.hyperLinkPattern);
  const locale = useEditorStore((state) => state.locale);
  const dataSource = useEditorStore((state) => state.dataSource);
  const findNodeById = useTreeStore((state) => state.findNodeById);

  const props: BaseComponentProps = useMemo(() => {
    const propsBase = {
      cfSsrClassName: node.data.props.cfSsrClassName
        ? (resolveDesignValue(
            (node.data.props.cfSsrClassName as DesignValue).valuesByBreakpoint,
          ) as string)
        : undefined,
    };

    // Don't enrich the assembly wrapper node with props
    if (!definition || node.type === ASSEMBLY_NODE_TYPE) {
      return propsBase;
    }

    // Note, that here we iterate over DEFINITION variables, not the actual node variables
    // this means that node may have "orphan" props, or some "newborn" props will be initialized
    // with the default values.
    const extractedProps = Object.entries(definition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const variableMapping = node.data.props[variableName];

        if (!variableMapping) {
          return {
            ...acc,
            [variableName]: variableDefinition.defaultValue,
          };
        }

        if (variableMapping.type === 'DesignValue') {
          const value = maybeMergePatternDefaultDesignValues({
            variableName,
            variableMapping,
            node,
            findNodeById,
          });
          const valuesByBreakpoint = resolveDesignValue(value, variableName);
          const designValue =
            variableName === 'cfHeight'
              ? calculateNodeDefaultHeight({
                  blockId: node.data.blockId,
                  children: node.children,
                  value: valuesByBreakpoint,
                })
              : valuesByBreakpoint;

          return {
            ...acc,
            [variableName]: designValue,
          };
        } else if (variableMapping.type === 'HyperlinkValue') {
          const binding = dataSource[variableMapping.linkTargetKey];

          const hyperlinkEntry = entityStore.getEntryOrAsset(
            binding,
            variableMapping.linkTargetKey,
          );
          return {
            ...acc,
            [variableName]: resolveHyperlinkPattern(
              definition.hyperlinkPattern || hyperlinkPattern || HYPERLINK_DEFAULT_PATTERN,
              hyperlinkEntry as Entry,
              locale,
            ),
          };
        } else if (variableMapping.type === 'BoundValue') {
          // maybePath, because prebound props would have the type 'BoundValue' but the path would be incomplete
          // eg: "/uuid" vs "/uuid/fields/[fileName]/~locale" as the regular BoundValue would have
          const [, uuid, maybePath] = variableMapping.path.split('/');
          const link = dataSource[uuid] as Link<'Entry' | 'Asset'>;

          let boundValue: ReturnType<typeof transformBoundContentValue>;

          // starting from here, if the prop is of type 'BoundValue', and has prebinding
          // we are going to resolve the incomplete path
          if (link && isPreboundProp(variableMapping) && variableMapping.isPrebound) {
            let prebindingPath: string = variableMapping.path;
            // we get the entry by the dataSource key in the incomplete path
            const boundEntity = entityStore.getEntityFromLink(link);
            // if it points at an entry, it allows us to reduce the set of prebound content types to the one we target
            if (boundEntity?.sys.type === 'Entry') {
              const contentTypeId = boundEntity.sys.contentType.sys.id;
              // so we replace the incomplete path with the complete, relative to the content type of the source entry
              prebindingPath =
                variableMapping.pathsByContentType?.[contentTypeId]?.path ?? prebindingPath;
            }
            // this allows us to resolve it regularly
            boundValue = transformBoundContentValue(
              node.data.props,
              entityStore,
              link,
              resolveDesignValue,
              variableName,
              variableDefinition.type,
              prebindingPath,
            );
          } else {
            // here we resolve the regular bound value
            const variableDefinition = definition.variables[variableName];
            boundValue = transformBoundContentValue(
              node.data.props,
              entityStore,
              link,
              resolveDesignValue,
              variableName,
              variableDefinition.type,
              variableMapping.path,
            );
          }

          // In some cases, there may be an asset linked in the path, so we need to consider this scenario:
          // If no 'boundValue' is found, we also attempt to extract the value associated with the second-to-last item in the path.
          // If successful, it means we have identified the linked asset.
          if (!boundValue && maybePath) {
            const maybeBoundAsset = areEntitiesFetched
              ? entityStore.getValue(link, maybePath.split('/').slice(0, -2))
              : undefined;

            if (isLinkToAsset(maybeBoundAsset)) {
              boundValue = maybeBoundAsset;
            }
          }

          const value = boundValue || variableDefinition.defaultValue;

          return {
            ...acc,
            [variableName]: value,
          };
        } else if (variableMapping.type === 'UnboundValue') {
          const value = getUnboundValues({
            key: variableMapping.key,
            fallback: variableDefinition.defaultValue,
            unboundValues: unboundValues || {},
          });

          return {
            ...acc,
            [variableName]: value,
          };
        } else if (variableMapping.type === 'ComponentValue') {
          // We are rendering a pattern (assembly) entry. Content properties cannot be edited in this,
          // so we always render the default value
          return {
            ...acc,
            // This can either a design (style) or a content variable
            [variableName]: variableDefinition.defaultValue,
          };
        } else {
          return { ...acc };
        }
      },
      {},
    );

    return {
      ...propsBase,
      ...extractedProps,
    };
  }, [
    hyperlinkPattern,
    node,
    locale,
    definition,
    resolveDesignValue,
    dataSource,
    areEntitiesFetched,
    unboundValues,
    entityStore,
    findNodeById,
  ]);

  const cfStyles = useMemo(
    () => ({
      ...buildCfStyles(props as StyleProps),
      // The visibility needs to be transformed separately as it requires
      // a special handling for preview & SSR rendering (not here though).
      ...transformVisibility(props.cfVisibility),
    }),
    [props],
  );

  const shouldRenderEmptySpaceWithMinSize = useMemo(() => {
    if (node.children.length) return false;

    // Render with minimum height and with in those two scenarios:
    if (isStructureWithRelativeHeight(node.data.blockId, cfStyles.height)) return true;
    if (definition?.children) return true;

    return false;
  }, [cfStyles.height, definition?.children, node.children.length, node.data.blockId]);

  // Styles that will be applied to the component element
  const componentStyles = useMemo(
    () => ({
      ...cfStyles,
      ...(shouldRenderEmptySpaceWithMinSize && {
        minHeight: EMPTY_CONTAINER_SIZE,
        minWidth: EMPTY_CONTAINER_SIZE,
      }),
    }),
    [cfStyles, shouldRenderEmptySpaceWithMinSize],
  );

  const cfCsrClassName = useEditorModeClassName({
    styles: componentStyles,
    nodeId: node.data.id,
  });

  const componentProps = useMemo(() => {
    const sharedProps = {
      'data-cf-node-id': node.data.id,
      'data-cf-node-block-id': node.data.blockId,
      'data-cf-node-block-type': node.type,
      className: (props.cfSsrClassName as string | undefined) ?? cfCsrClassName,
    };

    // Only pass `editorMode` and `node` to structure components and assembly root nodes.
    const isStructureComponent = isContentfulStructureComponent(node.data.blockId);
    if (isStructureComponent) {
      return {
        ...sharedProps,
        editorMode: true as const,
        node,
      };
    }

    return {
      ...sharedProps,
      // Allows custom components to render differently in the editor. This needs to be activated
      // through options as the component has to be aware of this prop to not cause any React warnings.
      ...(options?.enableCustomEditorView ? { isInExpEditorMode: true } : {}),
      ...sanitizeNodeProps(props),
    };
  }, [cfCsrClassName, node, options?.enableCustomEditorView, props]);

  return { componentProps };
};
