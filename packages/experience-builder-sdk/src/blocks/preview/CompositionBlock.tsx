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
import { store } from '@contentful/experiences-core';
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
    // Don't enrich the assembly wrapper node with props
    if (!componentRegistration || isAssembly) {
      return {
        cfSsrClassName: node.variables.cfSsrClassName
          ? resolveDesignValue(
              (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint,
              'cfSsrClassName',
            )
          : undefined,
      };
    }

    const propMap: Record<string, PrimitiveValue> = {
      // @ts-expect-error -- node id is being generated in ssrStyles.ts, currently missing ComponentTreeNode type
      cfSsrClassName: node.id
        ? // @ts-expect-error -- node id is being generated in ssrStyles.ts, currently missing ComponentTreeNode type
          getPatternChildNodeClassName?.(node.id)
        : node.variables.cfSsrClassName
          ? resolveDesignValue(
              (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint,
              'cfSsrClassName',
            )
          : undefined,
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

    const storeProps = Object.entries(componentRegistration.definition.store || {}).reduce(
      (acc, [variableName]) => {
        const value = store.getState(variableName);

        return { ...acc, [variableName]: value };
      },
      {} as Record<string, unknown>,
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

    return { ...props, ...storeProps } as typeof propMap;
  }, [
    componentRegistration,
    isAssembly,
    node.children,
    node.variables,
    resolveDesignValue,
    entityStore,
    hyperlinkPattern,
    locale,
    getPatternChildNodeClassName,
  ]);

  const className = useClassName({ props: nodeProps, node });

  if (!componentRegistration) {
    return null;
  }

  const { component } = componentRegistration;

  const _getPatternChildNodeClassName = (childNodeId: string) => {
    if (isAssembly) {
      // @ts-expect-error -- property cfSsrClassName is a map (id to classNames) that is added during rendering in ssrStyles
      const classesForNode = node.variables.cfSsrClassName[childNodeId];
      if (classesForNode) {
        return resolveDesignValue(
          (classesForNode as DesignValue).valuesByBreakpoint,
          'cfSsrClassName',
        ) as string;
      }
      return;
    }
    return getPatternChildNodeClassName?.(childNodeId);
  };

  const children =
    componentRegistration.definition.children === true
      ? node.children.map((childNode: ComponentTreeNode, index) => {
          return (
            <CompositionBlock
              getPatternChildNodeClassName={_getPatternChildNodeClassName}
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
