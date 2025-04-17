import React, { ReactNode, useMemo } from 'react';
import type { UnresolvedLink } from 'contentful';
import {
  EntityStore,
  resolveHyperlinkPattern,
  sanitizeNodeProps,
} from '@contentful/experiences-core';
import {
  CONTENTFUL_COMPONENTS,
  HYPERLINK_DEFAULT_PATTERN,
} from '@contentful/experiences-core/constants';
import type {
  ComponentTreeNode,
  DesignValue,
  PatternProperty,
  PrimitiveValue,
  ResolveDesignValueType,
  StyleProps,
} from '@contentful/experiences-core/types';
import { createAssemblyRegistration, getComponentRegistration } from '../../core/componentRegistry';
import { checkIsAssemblyNode, transformBoundContentValue } from '@contentful/experiences-core';
import { useInjectStylesheet } from '../../hooks/useClassName';
import {
  Assembly,
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experiences-components-react';
import { resolveAssembly } from '../../core/preview/assemblyUtils';
import { Entry } from 'contentful';
import PreviewUnboundImage from './PreviewUnboundImage';
import { parseComponentProps } from '../../utils/parseComponentProps';

type CompositionBlockProps = {
  node: ComponentTreeNode;
  locale: string;
  entityStore: EntityStore;
  hyperlinkPattern?: string | undefined;
  resolveDesignValue: ResolveDesignValueType;
  getPatternChildNodeClassName?: (childNodeId: string) => string | undefined;
  wrappingPatternIds?: Set<string>;
  /**
   * Chained IDs to ensure uniqueness across multiple instances of the same pattern
   * when storing & accessing cfSsrClassName.
   */
  patternNodeIdsChain?: string;
  patternRootNodeIdsChain?: string;
  wrappingPatternProperties?: Record<string, PatternProperty>;
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  hyperlinkPattern,
  resolveDesignValue,
  getPatternChildNodeClassName,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
  wrappingPatternProperties: parentWrappingPatternProperties = {},
  patternNodeIdsChain = '',
  patternRootNodeIdsChain: parentPatternRootNodeIdsChain = '',
}: CompositionBlockProps) => {
  patternNodeIdsChain = `${patternNodeIdsChain}${rawNode.id}`;

  const isAssembly = useMemo(
    () =>
      checkIsAssemblyNode({
        componentId: rawNode.definitionId,
        usedComponents: entityStore.usedComponents,
      }),
    [entityStore.usedComponents, rawNode.definitionId],
  );

  const patternRootNodeIdsChain = useMemo(() => {
    if (isAssembly) {
      return `${parentPatternRootNodeIdsChain}${rawNode.id}`;
    }
    return parentPatternRootNodeIdsChain;
  }, [isAssembly, parentPatternRootNodeIdsChain, rawNode.id]);

  const node = useMemo(() => {
    return isAssembly
      ? resolveAssembly({
          node: rawNode,
          entityStore,
          parentPatternProperties: parentWrappingPatternProperties,
          patternNodeIdsChain: patternRootNodeIdsChain,
        })
      : rawNode;
  }, [entityStore, isAssembly, rawNode, parentWrappingPatternProperties, patternRootNodeIdsChain]);

  const wrappingPatternIds = useMemo(() => {
    if (isAssembly) {
      return new Set([node.definitionId, ...parentWrappingPatternIds]);
    }
    return parentWrappingPatternIds;
  }, [isAssembly, node, parentWrappingPatternIds]);

  // Merge the pattern properties of the current node with the parent's pattern properties
  // to ensure nested patterns receive relevant pattern properties that were bubbled up
  // during assembly serialization.
  const wrappingPatternProperties = useMemo(() => {
    if (isAssembly) {
      return { ...parentWrappingPatternProperties, ...(rawNode.patternProperties || {}) };
    }
    return parentWrappingPatternProperties;
  }, [isAssembly, rawNode, parentWrappingPatternProperties]);

  const componentRegistration = useMemo(() => {
    const registration = getComponentRegistration(node.definitionId as string);

    if (isAssembly && !registration) {
      return createAssemblyRegistration({
        definitionId: node.definitionId as string,
        component: Assembly,
      });
    }
    return registration;
  }, [isAssembly, node.definitionId]);

  const { ssrProps, contentProps, props, mediaQuery } = useMemo(() => {
    // In SSR, we store the className under breakpoints[0] which is resolved here to the actual string
    const cfSsrClassNameValues = node.variables.cfSsrClassName as DesignValue | undefined;
    const mainBreakpoint = entityStore.breakpoints[0];
    const cfSsrClassName = cfSsrClassNameValues?.valuesByBreakpoint?.[mainBreakpoint.id] as
      | string
      | undefined;

    // Don't enrich the assembly wrapper node with props
    if (!componentRegistration || isAssembly) {
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
      node,
      resolveCustomDesignValue: ({ propertyName, valuesByBreakpoint }) => {
        return resolveDesignValue(valuesByBreakpoint, propertyName);
      },
      resolveBoundValue: ({ binding, propertyName, dataType }) => {
        const [, uuid] = binding.path.split('/');
        const boundEntityLink = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
        const boundValue = transformBoundContentValue(
          node.variables,
          entityStore,
          boundEntityLink,
          resolveDesignValue,
          propertyName,
          dataType,
          binding.path,
        );

        return boundValue;
      },
      resolveHyperlinkValue: ({ linkTargetKey }) => {
        const boundEntity = entityStore.dataSource[linkTargetKey];
        const hyperlinkEntry = entityStore.getEntryOrAsset(boundEntity, linkTargetKey);

        const value = resolveHyperlinkPattern(
          componentRegistration.definition.hyperlinkPattern ||
            hyperlinkPattern ||
            HYPERLINK_DEFAULT_PATTERN,
          hyperlinkEntry as Entry,
          locale,
        );

        return value;
      },
      resolveUnboundValue: ({ mappingKey, defaultValue }) => {
        return entityStore.unboundValues[mappingKey]?.value ?? defaultValue;
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
              wrappingPatternProperties={wrappingPatternProperties}
              patternNodeIdsChain={patternNodeIdsChain}
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
    entityStore,
    componentRegistration,
    isAssembly,
    getPatternChildNodeClassName,
    resolveDesignValue,
    hyperlinkPattern,
    locale,
    wrappingPatternIds,
    wrappingPatternProperties,
    patternNodeIdsChain,
    patternRootNodeIdsChain,
  ]);

  // do not inject the stylesheet into the dom because it's already been done on the server side
  useInjectStylesheet(ssrProps.cfSsrClassName ? undefined : mediaQuery);

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
    if (isAssembly) {
      const nodeIdsChain = `${patternNodeIdsChain}${childNodeId}`;
      // @ts-expect-error -- property cfSsrClassName is a map (id to classNames) that is added during rendering in ssrStyles
      const classesForNode: DesignValue | undefined = node.variables.cfSsrClassName?.[nodeIdsChain];

      if (!classesForNode) return undefined;
      return resolveDesignValue(classesForNode.valuesByBreakpoint, 'cfSsrClassName') as string;
    }
    return getPatternChildNodeClassName?.(childNodeId);
  };

  const children =
    componentRegistration.definition.children === true
      ? node.children.map((childNode: ComponentTreeNode, index) => {
          return (
            <CompositionBlock
              getPatternChildNodeClassName={
                isAssembly || getPatternChildNodeClassName
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
              wrappingPatternProperties={wrappingPatternProperties}
              patternNodeIdsChain={patternNodeIdsChain}
              patternRootNodeIdsChain={patternRootNodeIdsChain}
            />
          );
        })
      : null;

  if (isContainerOrSection(node.definitionId)) {
    return (
      <ContentfulContainer
        editorMode={false}
        cfHyperlink={(contentProps as StyleProps).cfHyperlink}
        cfOpenInNewTab={(contentProps as StyleProps).cfOpenInNewTab}
        className={props.className as string | undefined}>
        {children}
      </ContentfulContainer>
    );
  }

  if (node.definitionId === CONTENTFUL_COMPONENTS.columns.id) {
    return (
      <Columns editorMode={false} className={props.className as string | undefined}>
        {children}
      </Columns>
    );
  }

  if (node.definitionId === CONTENTFUL_COMPONENTS.singleColumn.id) {
    return (
      <SingleColumn editorMode={false} className={props.className as string | undefined}>
        {children}
      </SingleColumn>
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
      />
    );
  }

  const services = {
    hello() {
      console.log('hello');
    },
    getEntityStore() {
      return entityStore;
    },
    entityStore, // TODO: should we expose it here or just use getter?
    resolveLinksUpToLevel3(shallowEntry: Entry): Entry {
      const resolvedEntry = structuredClone(shallowEntry);
      for (const [field, fieldValue] of Object.entries(resolvedEntry.fields)) {
        if (fieldValue && fieldValue.sys?.type === 'Link') {
          const resolvedEntryOrAsset = entityStore.getEntryOrAsset(fieldValue, ''); // no need for field, as it is only for deep binding
          if (resolvedEntryOrAsset) {
            resolvedEntry.fields[field] = resolvedEntryOrAsset;
          }
        }
      }
      return resolvedEntry;
    },
  };

  return React.createElement(
    component,
    {
      ...sanitizeNodeProps(props),
      services,
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
