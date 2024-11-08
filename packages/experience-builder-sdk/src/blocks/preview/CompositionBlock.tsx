import React, { useMemo } from 'react';
import { EntityStore, getNodeProps, sanitizeNodeProps } from '@contentful/experiences-core';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import type {
  ComponentTreeNode,
  DesignValue,
  ResolveDesignValueType,
  StyleProps,
} from '@contentful/experiences-core/types';
import { createAssemblyRegistration, getComponentRegistration } from '../../core/componentRegistry';
import { checkIsAssemblyNode } from '@contentful/experiences-core';
import { useClassName } from '../../hooks/useClassName';
import {
  Assembly,
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experiences-components-react';

import { resolveAssembly } from '../../core/preview/assemblyUtils';
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
    const props = getNodeProps({
      node,
      componentRegistration,
      isAssembly,
      getPatternChildNodeClassName,
      entityStore,
      locale,
      hyperlinkPattern,
      resolveDesignValue,
    });

    if (!componentRegistration?.definition.slots) return props;

    for (const slotId in componentRegistration.definition.slots) {
      const slotNode = node.children.find((child) => child.slotId === slotId);

      if (!slotNode) continue;

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

    return props;
  }, [
    componentRegistration,
    isAssembly,
    resolveDesignValue,
    entityStore,
    hyperlinkPattern,
    locale,
    getPatternChildNodeClassName,
    node,
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
