import React, { useMemo } from 'react';
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
import { useClassName } from '../../hooks/useClassName';
import {
  Assembly,
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experiences-components-react';

import { resolveAssembly } from '../../core/preview/assemblyUtils';
import { Entry } from 'contentful';
import PreviewUnboundImage from './PreviewUnboundImage';

type CompositionBlockProps = {
  node: ComponentTreeNode;
  locale: string;
  entityStore: EntityStore;
  hyperlinkPattern?: string | undefined;
  resolveDesignValue: ResolveDesignValueType;
  getPatternChildNodeClassName?: (childNodeId: string) => string | undefined;
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  hyperlinkPattern,
  resolveDesignValue,
  getPatternChildNodeClassName,
}: CompositionBlockProps) => {
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

  const nodeProps = useMemo(() => {
    // In SSR, we store the className under breakpoints[0] which is resolved here to the actual string
    const cfSsrClassNameValues = node.variables.cfSsrClassName as DesignValue | undefined;
    const cfSsrClassName = resolveDesignValue(
      cfSsrClassNameValues?.valuesByBreakpoint,
      'cfSsrClassName',
    );

    // Don't enrich the assembly wrapper node with props
    if (!componentRegistration || isAssembly) {
      return { cfSsrClassName };
    }

    const propMap: Record<string, PrimitiveValue> = {
      cfSsrClassName:
        node.id && getPatternChildNodeClassName
          ? getPatternChildNodeClassName(node.id)
          : cfSsrClassName,
    };

    const props = Object.entries(componentRegistration.definition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const variable = node.variables[variableName];
        if (!variable) return acc;

        switch (variable.type) {
          case 'DesignValue':
            acc[variableName] = resolveDesignValue(variable.valuesByBreakpoint, variableName);
            break;
          case 'BoundValue': {
            const [, uuid] = variable.path.split('/');
            const binding = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;

            const value = transformBoundContentValue(
              node.variables,
              entityStore,
              binding,
              resolveDesignValue,
              variableName,
              variableDefinition,
              variable.path,
            );
            acc[variableName] = value ?? variableDefinition.defaultValue;
            break;
          }

          case 'HyperlinkValue': {
            const binding = entityStore.dataSource[variable.linkTargetKey];
            const hyperlinkEntry = entityStore.getEntryOrAsset(binding, variable.linkTargetKey);

            const value = resolveHyperlinkPattern(
              componentRegistration.definition.hyperlinkPattern ||
                hyperlinkPattern ||
                HYPERLINK_DEFAULT_PATTERN,
              hyperlinkEntry as Entry,
              locale,
            );
            if (value) {
              acc[variableName] = value;
            }
            break;
          }
          case 'UnboundValue': {
            const uuid = variable.key;
            acc[variableName] =
              entityStore.unboundValues[uuid]?.value ?? variableDefinition.defaultValue;
            break;
          }
          case 'ComponentValue':
            // We're rendering a pattern entry. Content cannot be set for ComponentValue type properties
            // directly in the pattern so we can safely use the default value
            // This can either a design (style) or a content variable
            acc[variableName] = variableDefinition.defaultValue;
            break;
          default:
            break;
        }
        return acc;
      },
      propMap,
    );

    if (componentRegistration.definition.slots) {
      for (const slotId in componentRegistration.definition.slots) {
        const slotNode = node.children.find((child) => child.slotId === slotId);
        if (slotNode) {
          props[slotId] = (
            <CompositionBlock
              node={slotNode}
              locale={locale}
              hyperlinkPattern={hyperlinkPattern}
              entityStore={entityStore}
              resolveDesignValue={resolveDesignValue}
            />
          );
        }
      }
    }

    return props;
  }, [
    resolveDesignValue,
    node.variables,
    node.id,
    node.children,
    componentRegistration,
    isAssembly,
    getPatternChildNodeClassName,
    entityStore,
    hyperlinkPattern,
    locale,
  ]);

  const className = useClassName({ props: nodeProps, node });

  if (!componentRegistration) {
    return null;
  }

  const { component } = componentRegistration;

  // Retrieves the CSS class name for a given child node ID.
  const _getPatternChildNodeClassName = (childNodeId: string) => {
    if (isAssembly) {
      // @ts-expect-error -- property cfSsrClassName is a map (id to classNames) that is added during rendering in ssrStyles
      const classesForNode: DesignValue | undefined = node.variables.cfSsrClassName?.[childNodeId];
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
        cfHyperlink={(nodeProps as StyleProps).cfHyperlink}
        cfOpenInNewTab={(nodeProps as StyleProps).cfOpenInNewTab}
        className={className}>
        {children}
      </ContentfulContainer>
    );
  }

  if (node.definitionId === CONTENTFUL_COMPONENTS.columns.id) {
    return (
      <Columns editorMode={false} className={className}>
        {children}
      </Columns>
    );
  }

  if (node.definitionId === CONTENTFUL_COMPONENTS.singleColumn.id) {
    return (
      <SingleColumn editorMode={false} className={className}>
        {children}
      </SingleColumn>
    );
  }

  if (
    node.definitionId === CONTENTFUL_COMPONENTS.image.id &&
    node.variables.cfImageAsset?.type === 'UnboundValue'
  ) {
    return <PreviewUnboundImage node={node} nodeProps={nodeProps} component={component} />;
  }

  return React.createElement(
    component,
    {
      ...sanitizeNodeProps(nodeProps),
      className,
    },
    children ?? (typeof nodeProps.children === 'string' ? nodeProps.children : null),
  );
};
