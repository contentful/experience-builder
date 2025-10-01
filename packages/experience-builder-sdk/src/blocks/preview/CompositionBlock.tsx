import React, { useMemo } from 'react';
import type { UnresolvedLink } from 'contentful';
import { Entry } from 'contentful';
import {
  checkIsAssemblyNode,
  EntityStore,
  resolveHyperlinkPattern,
  sanitizeNodeProps,
  transformBoundContentValue,
  splitDirectAndSlotChildren,
  getSdkOptions,
} from '@contentful/experiences-core';
import {
  CONTENTFUL_COMPONENTS,
  HYPERLINK_DEFAULT_PATTERN,
} from '@contentful/experiences-core/constants';
import type {
  ComponentTreeNode,
  DesignValue,
  Parameter,
  PrimitiveValue,
  ResolveDesignValueType,
  StyleProps,
} from '@contentful/experiences-core/types';
import { createAssemblyRegistration, getComponentRegistration } from '../../core/componentRegistry';
import { useInjectStylesheet } from '../../hooks/useInjectStylesheet';
import { Assembly, ContentfulContainer } from '@contentful/experiences-components-react';
import { resolvePattern } from '../../core/preview/assemblyUtils';
import { resolveMaybePrebindingDefaultValuePath } from '../../utils/prebindingUtils';
import { parseComponentProps } from '../../utils/parseComponentProps';

type CompositionBlockProps = {
  node: ComponentTreeNode;
  locale: string;
  entityStore: EntityStore;
  hyperlinkPattern?: string | undefined;
  resolveDesignValue: ResolveDesignValueType;
  getPatternChildNodeClassName?: (childNodeId: string) => string | undefined;
  /** Set of definition IDs of wrapping patterns to prevent circular dependencies. */
  wrappingPatternIds?: Set<string>;
  rootPatternParameters?: Record<string, Parameter>;
  /**
   * Chained IDs to ensure uniqueness across multiple instances of the same pattern
   * when storing & accessing cfSsrClassName.
   */
  patternRootNodeIdsChain?: Array<string>;
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  hyperlinkPattern,
  resolveDesignValue,
  getPatternChildNodeClassName,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
  patternRootNodeIdsChain: parentPatternRootNodeIdsChain = [],
  rootPatternParameters,
}: CompositionBlockProps) => {
  const isPatternNode = useMemo(() => {
    return checkIsAssemblyNode({
      componentId: rawNode.definitionId,
      usedComponents: entityStore.usedComponents,
    });
  }, [entityStore.usedComponents, rawNode.definitionId]);

  const patternRootNodeIdsChain = useMemo(() => {
    if (isPatternNode) {
      // Pattern nodes are chained without a separator (following the format for prebinding/parameters)
      return [...parentPatternRootNodeIdsChain, rawNode.id!];
    }
    return parentPatternRootNodeIdsChain;
  }, [isPatternNode, parentPatternRootNodeIdsChain, rawNode.id]);

  const rootParameters = useMemo(() => {
    // covers the case when previewing a pattern
    // all parameters are defined on the tree root node and will be provided from the start
    if (rootPatternParameters) {
      return rootPatternParameters;
    }

    // covers the case when previewing an experience
    // parameters here are stored in CMA, so we retrieve them from the pattern's node and pass it down
    if (isPatternNode && rawNode.parameters && Object.keys(rawNode.parameters).length) {
      return rawNode.parameters;
    }

    // in case none exist - it is likely a non-pattern component, or just a pattern that has no parameters
    return undefined;
  }, [rawNode, rootPatternParameters, isPatternNode]);

  const node = useMemo(() => {
    if (isPatternNode) {
      return resolvePattern({
        node: rawNode,
        entityStore,
        parentPatternRootNodeIdsChain: patternRootNodeIdsChain,
        rootPatternParameters: rootParameters!,
      });
    } else {
      return rawNode;
    }
  }, [entityStore, isPatternNode, rawNode, patternRootNodeIdsChain, rootParameters]);

  const wrappingPatternIds = useMemo(() => {
    if (isPatternNode) {
      return new Set([node.definitionId, ...parentWrappingPatternIds]);
    }
    return parentWrappingPatternIds;
  }, [isPatternNode, node, parentWrappingPatternIds]);

  const componentRegistration = useMemo(() => {
    const registration = getComponentRegistration(node.definitionId as string);

    if (isPatternNode && !registration) {
      return createAssemblyRegistration({
        definitionId: node.definitionId as string,
        component: Assembly,
      });
    }
    return registration;
  }, [isPatternNode, node.definitionId]);

  const { ssrProps, contentProps, props, mediaQuery } = useMemo(() => {
    // In SSR, we store the className under breakpoints[0] which is resolved here to the actual string
    const cfSsrClassNameValues = node.variables.cfSsrClassName as DesignValue | undefined;
    const mainBreakpoint = entityStore.breakpoints[0];
    const cfSsrClassName = cfSsrClassNameValues?.valuesByBreakpoint?.[mainBreakpoint.id] as
      | string
      | undefined;

    // Don't enrich the assembly wrapper node with props
    if (!componentRegistration || isPatternNode) {
      const ssrProps = { cfSsrClassName };
      const props: Record<string, PrimitiveValue> = { className: cfSsrClassName };
      return {
        ssrProps,
        props,
      };
    }

    const ssrProps: Record<string, string | undefined> = {
      cfSsrClassName:
        node.id && getPatternChildNodeClassName
          ? getPatternChildNodeClassName(node.id)
          : cfSsrClassName,
    };

    const {
      contentProps = {},
      styleProps = {},
      customDesignProps = {},
      mediaQuery,
    } = parseComponentProps({
      breakpoints: entityStore.breakpoints,
      mainBreakpoint,
      componentDefinition: componentRegistration.definition,
      patternRootNodeIdsChain,
      node,
      resolveDesignValue,
      resolveBoundValue: ({ binding, propertyName, dataType }) => {
        const [, uuid] = binding.path.split('/');
        const boundEntityLink = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
        // TODO: Temporary fix while we look into SPA-3212 it occurs where we have prebound props but data source link is missing
        // this only occurs after live updates of nested patterns.
        if (!boundEntityLink) return;
        return transformBoundContentValue(
          node.variables,
          entityStore,
          boundEntityLink,
          resolveDesignValue,
          propertyName,
          dataType,
          binding.path,
        );
      },
      resolveHyperlinkValue: ({ linkTargetKey }) => {
        const boundEntity = entityStore.dataSource[linkTargetKey];
        const hyperlinkEntry = entityStore.getEntryOrAsset(boundEntity, linkTargetKey);

        return resolveHyperlinkPattern(
          componentRegistration.definition.hyperlinkPattern ||
            hyperlinkPattern ||
            HYPERLINK_DEFAULT_PATTERN,
          hyperlinkEntry as Entry,
          locale,
        );
      },
      resolveUnboundValue: ({ mappingKey, defaultValue }) => {
        return entityStore.unboundValues[mappingKey]?.value ?? defaultValue;
      },
      resolveComponentValue: ({ mappingKey, propertyName, dataType, resolveBoundValue }) => {
        if (!entityStore.isExperienceAPatternEntry) {
          return;
        }

        const path = resolveMaybePrebindingDefaultValuePath({
          componentValueKey: mappingKey,
          patternRootNodeIdsChain,
          entityStore,
        });

        if (path) {
          return resolveBoundValue({
            propertyName,
            dataType,
            binding: {
              type: 'BoundValue',
              path,
            },
          });
        }
      },
    });

    const props: Record<string, PrimitiveValue> = {
      className: ssrProps.cfSsrClassName ?? mediaQuery?.className,
      ...styleProps,
      ...contentProps,
      ...customDesignProps,
    };

    return {
      ssrProps,
      contentProps,
      mediaQuery,
      props,
    };
  }, [
    node,
    entityStore,
    componentRegistration,
    isPatternNode,
    getPatternChildNodeClassName,
    resolveDesignValue,
    hyperlinkPattern,
    locale,
    patternRootNodeIdsChain,
  ]);

  // do not inject the stylesheet into the dom because it's already been done on the server side
  useInjectStylesheet(ssrProps.cfSsrClassName ? undefined : mediaQuery?.css);

  if (!componentRegistration) {
    return null;
  }

  // When detecting a circular dependency, we stop silently. The editor mode will render an actionable error.
  if (parentWrappingPatternIds.has(node.definitionId)) {
    return null;
  }

  const { component: component } = componentRegistration;

  // Retrieves the CSS class name for a given child node ID.
  const _getPatternChildNodeClassName = (childNodeId: string) => {
    if (isPatternNode) {
      const nodeIdsChain = [...patternRootNodeIdsChain, childNodeId].join('-');
      // @ts-expect-error -- property cfSsrClassName is a map (id to classNames) that is added during rendering in ssrStyles
      const classesForNode: DesignValue | undefined = node.variables.cfSsrClassName?.[nodeIdsChain];
      if (!classesForNode) return undefined;
      return resolveDesignValue(classesForNode.valuesByBreakpoint) as string;
    }
    return getPatternChildNodeClassName?.(childNodeId);
  };

  const { slotNodesMap, directChildNodes } = splitDirectAndSlotChildren(
    node.children,
    componentRegistration.definition,
  );

  const renderChildNode = (childNode: ComponentTreeNode, index: number) => (
    <CompositionBlock
      getPatternChildNodeClassName={
        isPatternNode || getPatternChildNodeClassName ? _getPatternChildNodeClassName : undefined
      }
      node={childNode}
      key={childNode.id ?? index}
      locale={locale}
      hyperlinkPattern={hyperlinkPattern}
      entityStore={entityStore}
      resolveDesignValue={resolveDesignValue}
      wrappingPatternIds={wrappingPatternIds}
      patternRootNodeIdsChain={patternRootNodeIdsChain}
      rootPatternParameters={rootParameters}
    />
  );

  const renderedSlotNodesMap = Object.entries(slotNodesMap).reduce(
    (acc, [slotId, nodes]) => {
      if (nodes?.length) {
        acc[slotId] = <>{nodes.map(renderChildNode)}</>;
      }
      return acc;
    },
    {} as Record<string, React.JSX.Element>,
  );

  const renderedChildren = directChildNodes?.map(renderChildNode);

  const sdkOptions = getSdkOptions();

  // TODO: we might be able to remove this special case as well by not dropping the two props in the sanitizeNodeProps function
  // We allow custom container rendering through a new sdk option (not introducing a breaking change for existing customers).
  if (
    isContainerOrSection(node.definitionId) &&
    !sdkOptions.__unsafe__enableBuiltInStructureOverwrites
  ) {
    return (
      <ContentfulContainer
        cfHyperlink={(contentProps as StyleProps).cfHyperlink}
        cfOpenInNewTab={(contentProps as StyleProps).cfOpenInNewTab}
        className={props.className as string | undefined}>
        {renderedChildren}
      </ContentfulContainer>
    );
  }

  return React.createElement(
    component,
    {
      ...sanitizeNodeProps(props),
      ...renderedSlotNodesMap,
    },
    // If there are no children, a custom property called `children` can be passed through to the custom component
    ...(renderedChildren ?? []),
  );
};

const isContainerOrSection = (
  nodeDefinitionId: string,
): nodeDefinitionId is 'contentful-container' | 'contentful-section' =>
  [CONTENTFUL_COMPONENTS.container.id, CONTENTFUL_COMPONENTS.section.id].includes(
    nodeDefinitionId as 'contentful-container' | 'contentful-section',
  );
