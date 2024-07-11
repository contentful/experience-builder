import React, { useMemo } from 'react';
import type { UnresolvedLink } from 'contentful';
import { omit } from 'lodash-es';
import { EntityStore, resolveHyperlinkPattern } from '@contentful/experiences-core';
import {
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_COMPONENTS,
  HYPERLINK_DEFAULT_PATTERN,
} from '@contentful/experiences-core/constants';
import type {
  BehaviorDefinition,
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
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experiences-components-react';

import { resolveAssembly } from '../../core/preview/assemblyUtils';
import { Assembly } from '../../components/Assembly';
import { Entry } from 'contentful';
import { withComponentWrapper } from '../../utils/withComponentWrapper';

type CompositionBlockProps = {
  node: ComponentTreeNode;
  locale: string;
  entityStore: EntityStore;
  hyperlinkPattern?: string | undefined;
  resolveDesignValue: ResolveDesignValueType;
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  hyperlinkPattern,
  resolveDesignValue,
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
    const propMap: Record<string, PrimitiveValue> = {
      cfSsrClassName: node.variables.cfSsrClassName
        ? resolveDesignValue(
            (node.variables.cfSsrClassName as DesignValue).valuesByBreakpoint,
            'cfSsrClassName',
          )
        : undefined,
    };
    // Don't enrich the assembly wrapper node with props
    if (!componentRegistration || isAssembly) {
      return propMap;
    }

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
            acc[variableName] = value;
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
            acc[variableName] = entityStore.unboundValues[uuid]?.value;
            break;
          }
          case 'ComponentValue':
            // We're rendering a pattern entry. Content cannot be set for ComponentValue type properties
            // directly in the pattern so we can safely use the default value
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
    componentRegistration,
    isAssembly,
    node.children,
    node.variables,
    resolveDesignValue,
    entityStore,
    hyperlinkPattern,
    locale,
  ]);

  const className = useClassName({ props: nodeProps, node });

  if (!componentRegistration) {
    return null;
  }

  const { component } = componentRegistration;

  const children =
    componentRegistration.definition.children === true
      ? node.children.map((childNode: ComponentTreeNode, index) => {
          return (
            <CompositionBlock
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

  //List explicit style props that will end up being passed to the component
  const stylesToKeep = ['cfImageAsset'];
  const stylesToRemove = CF_STYLE_ATTRIBUTES.filter((style) => !stylesToKeep.includes(style));

  //@ts-ignore
  const behaviors = Object.entries(node.behaviors || {});
  const hasBehaviors = behaviors.length > 0;

  const testBehavior: Record<string, BehaviorDefinition> = {
    cart: {
      id: 'cart',
      name: 'Dyno Shopping Cart Test Behavior',
      description:
        'Dyno hackathon project for injecting behaviors into studio experiences components',
      variables: {
        Text: 'Text',
        cat: 'bye',
      },
      eventType: 'click',
    },
  };

  return React.createElement(
    // eslint-disable-next-line no-constant-condition
    hasBehaviors || true
      ? withComponentWrapper(component, { wrapComponent: false }, testBehavior)
      : component,
    {
      ...omit(nodeProps, stylesToRemove, ['cfHyperlink', 'cfOpenInNewTab', 'cfSsrClassName']),
      className,
    },
    children ?? (typeof nodeProps.children === 'string' ? nodeProps.children : null),
  );
};
