import React, { ReactNode, useEffect, useMemo, useState } from 'react';
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
import { resolveClassNamesFromBuiltInStyles } from '../../hooks/useMediaQuery';

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
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  hyperlinkPattern,
  resolveDesignValue,
  getPatternChildNodeClassName,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
  patternNodeIdsChain = '',
}: CompositionBlockProps) => {
  const [hasRendered, setHasRendered] = useState(false);
  patternNodeIdsChain = `${patternNodeIdsChain}${rawNode.id}`;

  useEffect(() => {
    setHasRendered(true);
  }, []);

  const isAssembly = useMemo(
    () =>
      checkIsAssemblyNode({
        componentId: rawNode.definitionId,
        usedComponents: entityStore.usedComponents,
      }),
    [entityStore.usedComponents, rawNode.definitionId],
  );

  const node = useMemo(() => {
    return isAssembly
      ? resolveAssembly({
          node: rawNode,
          entityStore,
        })
      : rawNode;
  }, [entityStore, isAssembly, rawNode]);

  const wrappingPatternIds = useMemo(() => {
    if (isAssembly) {
      return new Set([node.definitionId, ...parentWrappingPatternIds]);
    }
    return parentWrappingPatternIds;
  }, [isAssembly, node, parentWrappingPatternIds]);

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

  const { ssrProps, customDesignProps, contentProps, props, mediaQuery } = useMemo(() => {
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
      resolveClassNamesFromBuiltInStyles: (designPropsByBreakpointId) => {
        return resolveClassNamesFromBuiltInStyles({
          designPropsByBreakpointId,
          breakpoints: entityStore.breakpoints,
          node,
        });
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
              patternNodeIdsChain={patternNodeIdsChain}
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
    node.variables,
    node.id,
    node.children,
    resolveDesignValue,
    componentRegistration,
    isAssembly,
    getPatternChildNodeClassName,
    entityStore,
    hyperlinkPattern,
    locale,
    wrappingPatternIds,
    patternNodeIdsChain,
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

  const { component } = componentRegistration;

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
              patternNodeIdsChain={patternNodeIdsChain}
            />
          );
        })
      : null;

  if (
    [CONTENTFUL_COMPONENTS.container.id, CONTENTFUL_COMPONENTS.section.id].includes(
      node.definitionId,
    )
  ) {
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

  return React.createElement(
    component,
    {
      key: Object.keys(customDesignProps).length ? `${node.id}-${hasRendered}` : node.id,
      ...sanitizeNodeProps(props),
    },
    children ?? (typeof props.children === 'string' ? props.children : null),
  );
};
