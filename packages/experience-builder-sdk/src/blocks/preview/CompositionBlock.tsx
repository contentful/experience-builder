import React, { ReactNode, useMemo } from 'react';
import type { UnresolvedLink } from 'contentful';
import { Entry } from 'contentful';
import {
  checkIsAssemblyEntry,
  checkIsAssemblyNode,
  EntityStore,
  resolveHyperlinkPattern,
  sanitizeNodeProps,
  transformBoundContentValue,
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
import {
  Assembly,
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experiences-components-react';
import { resolvePattern } from '../../core/preview/assemblyUtils';
import { resolveMaybePrebindingDefaultValuePath } from '../../utils/prebindingUtils';
import PreviewUnboundImage from './PreviewUnboundImage';
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
  /**
   * Chained IDs to ensure uniqueness across multiple instances of the same pattern
   * when storing & accessing cfSsrClassName.
   */
  patternRootNodeIdsChain?: string;
  wrappingParameters?: Record<string, Parameter>;
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  hyperlinkPattern,
  resolveDesignValue,
  getPatternChildNodeClassName,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
  wrappingParameters: parentWrappingParameters = {},
  patternRootNodeIdsChain: parentPatternRootNodeIdsChain = '',
}: CompositionBlockProps) => {
  const isPatternNode = useMemo(() => {
    return checkIsAssemblyNode({
      componentId: rawNode.definitionId,
      usedComponents: entityStore.usedComponents,
    });
  }, [entityStore.usedComponents, rawNode.definitionId]);

  const isPatternEntry = useMemo(() => {
    return checkIsAssemblyEntry({ fields: entityStore.experienceEntryFields } as unknown as Entry);
  }, [entityStore]);

  const patternRootNodeIdsChain = useMemo(() => {
    if (isPatternNode) {
      // Pattern nodes are chained without a separator (following the format for prebinding/parameters)
      return `${parentPatternRootNodeIdsChain}${rawNode.id}`;
    }
    return parentPatternRootNodeIdsChain;
  }, [isPatternNode, parentPatternRootNodeIdsChain, rawNode.id]);

  const node = useMemo(() => {
    if (isPatternNode) {
      return resolvePattern({
        node: rawNode,
        entityStore,
        parentParameters: parentWrappingParameters,
        patternRootNodeIdsChain,
      });
    } else {
      return rawNode;
    }
  }, [entityStore, isPatternNode, rawNode, parentWrappingParameters, patternRootNodeIdsChain]);

  const wrappingPatternIds = useMemo(() => {
    if (isPatternNode) {
      return new Set([node.definitionId, ...parentWrappingPatternIds]);
    }
    return parentWrappingPatternIds;
  }, [isPatternNode, node, parentWrappingPatternIds]);

  // Merge the pattern properties of the current node with the parent's pattern properties
  // to ensure nested patterns receive relevant pattern properties that were bubbled up
  // during assembly serialization.
  const wrappingParameters = useMemo(() => {
    if (isPatternNode) {
      return { ...parentWrappingParameters, ...(rawNode.parameters || {}) };
    }
    return parentWrappingParameters;
  }, [isPatternNode, rawNode, parentWrappingParameters]);

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
        customDesignProps: {},
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
      resolvePrebindingValue: ({ mappingKey, propertyName, dataType, resolveBoundValue }) => {
        if (isPatternEntry) {
          const path = resolveMaybePrebindingDefaultValuePath({
            componentValueKey: mappingKey,
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
        }
      },
    });

    const slotsProps: Record<string, ReactNode> = {};

    if (componentRegistration.definition.slots) {
      for (const slotId in componentRegistration.definition.slots) {
        const slotNode = node.children.find((child) => child.slotId === slotId);
        if (slotNode) {
          slotsProps[slotId] = (
            <CompositionBlock
              node={slotNode}
              locale={locale}
              hyperlinkPattern={hyperlinkPattern}
              entityStore={entityStore}
              resolveDesignValue={resolveDesignValue}
              wrappingPatternIds={wrappingPatternIds}
              wrappingParameters={wrappingParameters}
              patternRootNodeIdsChain={patternRootNodeIdsChain}
            />
          );
        }
      }
    }

    const props: Record<string, PrimitiveValue> = {
      className: ssrProps.cfSsrClassName ?? mediaQuery?.className,
      ...styleProps,
      ...contentProps,
      ...customDesignProps,
      ...slotsProps,
    };

    return {
      ssrProps,
      contentProps,
      slotsProps,
      styleProps,
      customDesignProps,
      mediaQuery,
      props,
    };
  }, [
    node,
    isPatternEntry,
    entityStore,
    componentRegistration,
    isPatternNode,
    getPatternChildNodeClassName,
    resolveDesignValue,
    hyperlinkPattern,
    locale,
    wrappingPatternIds,
    wrappingParameters,
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
      const nodeIdsChain = `${patternRootNodeIdsChain}-${childNodeId}`;
      // @ts-expect-error -- property cfSsrClassName is a map (id to classNames) that is added during rendering in ssrStyles
      const classesForNode: DesignValue | undefined = node.variables.cfSsrClassName?.[nodeIdsChain];
      if (!classesForNode) return undefined;
      return resolveDesignValue(classesForNode.valuesByBreakpoint) as string;
    }
    return getPatternChildNodeClassName?.(childNodeId);
  };

  const children =
    componentRegistration.definition.children === true
      ? node.children.map((childNode: ComponentTreeNode, index) => {
          return (
            <CompositionBlock
              getPatternChildNodeClassName={
                isPatternNode || getPatternChildNodeClassName
                  ? _getPatternChildNodeClassName
                  : undefined
              }
              node={childNode}
              key={index}
              locale={locale}
              hyperlinkPattern={hyperlinkPattern}
              entityStore={entityStore}
              resolveDesignValue={resolveDesignValue}
              wrappingPatternIds={wrappingPatternIds}
              wrappingParameters={wrappingParameters}
              patternRootNodeIdsChain={patternRootNodeIdsChain}
            />
          );
        })
      : null;

  if (isContainerOrSection(node.definitionId)) {
    return (
      <ContentfulContainer
        cfHyperlink={(contentProps as StyleProps).cfHyperlink}
        cfOpenInNewTab={(contentProps as StyleProps).cfOpenInNewTab}
        className={props.className as string | undefined}>
        {children}
      </ContentfulContainer>
    );
  }

  if (node.definitionId === CONTENTFUL_COMPONENTS.columns.id) {
    return <Columns className={props.className as string | undefined}>{children}</Columns>;
  }

  if (node.definitionId === CONTENTFUL_COMPONENTS.singleColumn.id) {
    return (
      <SingleColumn className={props.className as string | undefined}>{children}</SingleColumn>
    );
  }

  if (
    node.definitionId === CONTENTFUL_COMPONENTS.image.id &&
    node.variables.cfImageAsset?.type === 'UnboundValue'
  ) {
    return (
      <PreviewUnboundImage
        node={node}
        nodeProps={props}
        component={component}
        breakpoints={entityStore.breakpoints}
        patternRootNodeIdsChain={patternRootNodeIdsChain}
      />
    );
  }

  return React.createElement(
    component,
    {
      ...sanitizeNodeProps(props),
    },
    children ?? (typeof props.children === 'string' ? props.children : null),
  );
};

const isContainerOrSection = (
  nodeDefinitionId: string,
): nodeDefinitionId is 'contentful-container' | 'contentful-section' =>
  [CONTENTFUL_COMPONENTS.container.id, CONTENTFUL_COMPONENTS.section.id].includes(
    nodeDefinitionId as 'contentful-container' | 'contentful-section',
  );
