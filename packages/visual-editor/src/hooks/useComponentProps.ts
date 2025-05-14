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
  transformVisibility,
} from '@contentful/experiences-core';
import {
  ASSEMBLY_NODE_TYPE,
  EMPTY_CONTAINER_HEIGHT,
  CONTENTFUL_COMPONENTS,
  ASSEMBLY_BLOCK_NODE_TYPE,
} from '@contentful/experiences-core/constants';
import type {
  StyleProps,
  PrimitiveValue,
  ExperienceTreeNode,
  ResolveDesignValueType,
  ComponentRegistration,
  Link,
  DesignValue,
} from '@contentful/experiences-core/types';
import { CSSProperties, useMemo } from 'react';
import { useEditorModeClassName } from '@/hooks/useEditorModeClassName';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { useDraggedItemStore } from '@/store/draggedItem';
import { useEntityStore } from '@/store/entityStore';
import type { RenderDropzoneFunction } from '@/components/DraggableBlock/Dropzone.types';
import { maybeMergePatternDefaultDesignValues } from '@/utils/maybeMergePatternDefaultDesignValues';

import { Entry } from 'contentful';
import { HYPERLINK_DEFAULT_PATTERN } from '@contentful/experiences-core/constants';
import { DRAG_PADDING } from '@/types/constants';
import { useTreeStore } from '@/store/tree';

type ComponentProps = StyleProps | Record<string, PrimitiveValue | Link<'Entry'> | Link<'Asset'>>;

export type ResolvedComponentProps = ComponentProps & {
  children?: React.JSX.Element | undefined;
  className: string;
  editorMode?: boolean;
  node?: ExperienceTreeNode;
  renderDropzone?: RenderDropzoneFunction;
  isInExpEditorMode?: boolean;
};

type UseComponentProps = {
  node: ExperienceTreeNode;
  resolveDesignValue: ResolveDesignValueType;
  areEntitiesFetched: boolean;
  definition?: ComponentRegistration['definition'];
  options?: ComponentRegistration['options'];
  renderDropzone: RenderDropzoneFunction;
  userIsDragging: boolean;
  slotId?: string;
  requiresDragWrapper?: boolean;
};

export const useComponentProps = ({
  node,
  areEntitiesFetched,
  resolveDesignValue,
  renderDropzone,
  definition,
  options,
  userIsDragging,
  requiresDragWrapper,
}: UseComponentProps) => {
  const unboundValues = useEditorStore((state) => state.unboundValues);
  const hyperlinkPattern = useEditorStore((state) => state.hyperLinkPattern);
  const locale = useEditorStore((state) => state.locale);
  const dataSource = useEditorStore((state) => state.dataSource);
  const entityStore = useEntityStore((state) => state.entityStore);
  const draggingId = useDraggedItemStore((state) => state.onBeforeCaptureId);
  const nodeRect = useDraggedItemStore((state) => state.domRect);
  const findNodeById = useTreeStore((state) => state.findNodeById);

  const isEmptyZone = !node.children.length;

  const props: ComponentProps = useMemo(() => {
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
          const [, uuid, path] = variableMapping.path.split('/');
          const binding = dataSource[uuid] as Link<'Entry' | 'Asset'>;

          const variableDefinition = definition.variables[variableName];
          let boundValue = transformBoundContentValue(
            node.data.props,
            entityStore,
            binding,
            resolveDesignValue,
            variableName,
            variableDefinition.type,
            variableMapping.path,
          );

          // In some cases, there may be an asset linked in the path, so we need to consider this scenario:
          // If no 'boundValue' is found, we also attempt to extract the value associated with the second-to-last item in the path.
          // If successful, it means we have identified the linked asset.

          if (!boundValue) {
            const maybeBoundAsset = areEntitiesFetched
              ? entityStore.getValue(binding, path.split('/').slice(0, -2))
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

    const slotProps: Record<string, React.JSX.Element> = {};
    if (definition.slots) {
      for (const slotId in definition.slots) {
        slotProps[slotId] = renderDropzone(node, {
          zoneId: [node.data.id, slotId].join('|'),
        });
      }
    }

    return {
      ...propsBase,
      ...extractedProps,
      ...slotProps,
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
    renderDropzone,
    findNodeById,
  ]);

  const cfStyles = useMemo(
    () => ({
      ...buildCfStyles(props as StyleProps),
      // This is not handled by buildCfStyles as it requires separate disjunct media queries in preview mode
      ...transformVisibility((props as StyleProps).cfVisibility),
    }),
    [props],
  );
  const cfVisibility: boolean = props['cfVisibility'] as boolean;

  const isAssemblyBlock = node.type === ASSEMBLY_BLOCK_NODE_TYPE;
  const isSingleColumn = node?.data.blockId === CONTENTFUL_COMPONENTS.columns.id;
  const isStructureComponent = isContentfulStructureComponent(node?.data.blockId);
  const isPatternNode = node.type === ASSEMBLY_NODE_TYPE;

  const { overrideStyles, wrapperStyles } = useMemo(() => {
    // Move size styles to the wrapping div and override the component styles
    const overrideStyles: CSSProperties = {};
    const wrapperStyles: CSSProperties = { width: options?.wrapContainerWidth };

    if (requiresDragWrapper) {
      // when element is marked by user as not-visible, on that element the node `display: none !important`
      // will be set and it will disappear. However, when such a node has a wrapper div, the wrapper
      // should not have any css properties (at least not ones which force size), as such div should
      // simply be a zero height wrapper around element with `display: none !important`.
      // Hence we guard all wrapperStyles with `cfVisibility` check.
      if (cfVisibility && cfStyles.width) wrapperStyles.width = cfStyles.width;
      if (cfVisibility && cfStyles.height) wrapperStyles.height = cfStyles.height;
      if (cfVisibility && cfStyles.maxWidth) wrapperStyles.maxWidth = cfStyles.maxWidth;
      if (cfVisibility && cfStyles.margin) wrapperStyles.margin = cfStyles.margin;
    }

    // Override component styles to fill the wrapper
    if (wrapperStyles.width) overrideStyles.width = '100%';
    if (wrapperStyles.height) overrideStyles.height = '100%';
    if (wrapperStyles.margin) overrideStyles.margin = '0';
    if (wrapperStyles.maxWidth) overrideStyles.maxWidth = 'none';

    // Prevent the dragging element from changing sizes when it has a percentage width or height
    if (draggingId === node.data.id && nodeRect) {
      if (requiresDragWrapper) {
        if (isPercentValue(cfStyles.width)) wrapperStyles.maxWidth = nodeRect.width;
        if (isPercentValue(cfStyles.height)) wrapperStyles.maxHeight = nodeRect.height;
      } else {
        if (isPercentValue(cfStyles.width)) overrideStyles.maxWidth = nodeRect.width;
        if (isPercentValue(cfStyles.height)) overrideStyles.maxHeight = nodeRect.height;
      }
    }

    return { overrideStyles, wrapperStyles };
  }, [
    cfStyles,
    options?.wrapContainerWidth,
    requiresDragWrapper,
    node.data.id,
    draggingId,
    nodeRect,
    cfVisibility,
  ]);

  // Styles that will be applied to the component element
  // This has to be memoized to avoid recreating the styles in useEditorModeClassName on every render
  const componentStyles = useMemo(
    () => ({
      ...cfStyles,
      ...overrideStyles,
      ...(isEmptyZone &&
        isStructureWithRelativeHeight(node?.data.blockId, cfStyles.height) && {
          minHeight: EMPTY_CONTAINER_HEIGHT,
        }),
      ...(userIsDragging &&
        isStructureComponent &&
        !isSingleColumn &&
        !isAssemblyBlock && {
          padding: addExtraDropzonePadding(cfStyles.padding?.toString() || '0 0 0 0'),
        }),
    }),
    [
      cfStyles,
      isAssemblyBlock,
      isEmptyZone,
      isSingleColumn,
      isStructureComponent,
      node?.data.blockId,
      overrideStyles,
      userIsDragging,
    ],
  );

  const componentClass = useEditorModeClassName({
    styles: componentStyles,
    nodeId: node.data.id,
  });

  const sharedProps: ResolvedComponentProps = {
    'data-cf-node-id': node.data.id,
    'data-cf-node-block-id': node.data.blockId,
    'data-cf-node-block-type': node.type,
    className: (props.cfSsrClassName as string | undefined) ?? componentClass,
    ...(definition?.children ? { children: renderDropzone(node) } : {}),
  };

  const customComponentProps: ResolvedComponentProps = {
    ...sharedProps,
    // Allows custom components to render differently in the editor. This needs to be activated
    // through options as the component has to be aware of this prop to not cause any React warnings.
    ...(options?.enableCustomEditorView ? { isInExpEditorMode: true } : {}),
    ...sanitizeNodeProps(props),
  };

  const structuralOrPatternComponentProps: ResolvedComponentProps = {
    ...sharedProps,
    editorMode: true,
    node,
    renderDropzone,
  };

  return {
    componentProps:
      isStructureComponent || isPatternNode
        ? structuralOrPatternComponentProps
        : customComponentProps,
    componentStyles,
    wrapperStyles,
  };
};

const addExtraDropzonePadding = (padding: string) =>
  padding
    .split(' ')
    .map((value) =>
      parseFloat(value) === 0 ? `${DRAG_PADDING}px` : `calc(${value} + ${DRAG_PADDING}px)`,
    )
    .join(' ');

const isPercentValue = (value?: string | number) =>
  typeof value === 'string' && value.endsWith('%');
