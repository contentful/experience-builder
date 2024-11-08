import React from 'react';
import {
  createExperience,
  EntityStore,
  getNodeProps,
  getValueForBreakpoint,
  sanitizeNodeProps,
} from '@contentful/experiences-core';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import type {
  ComponentTreeNode,
  DesignValue,
  Experience,
  PrimitiveValue,
  StyleProps,
  ValuesByBreakpoint,
} from '@contentful/experiences-core/types';
import { checkIsAssemblyNode } from '@contentful/experiences-core';
import {
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experiences-components-react';

import { resolveAssembly } from '../../core/preview/assemblyUtils';
import PreviewUnboundImage from './PreviewUnboundImage';
import { getRegistration } from '../../utils/getComponentRegistration';
import CompositionBlockWrapper from './CompositionBlockWrapper';

type CompositionBlockProps = {
  experience?: Experience<EntityStore> | string | null;
  node: ComponentTreeNode;
  locale: string;
  hyperlinkPattern?: string | undefined;
  getPatternChildNodeClassName?: (childNodeId: string) => string | undefined;
};

export const CompositionBlockServer = ({
  node: rawNode,
  experience,
  locale,
  hyperlinkPattern,
  getPatternChildNodeClassName,
}: CompositionBlockProps) => {
  const experienceObject =
    typeof experience === 'string' ? createExperience(experience) : experience;

  const entityStore = experienceObject?.entityStore;

  // hacky, just to get the poc to run
  if (!entityStore) throw new Error('EntityStore is required');

  const breakpoints = entityStore.breakpoints ?? [];

  const isAssembly = checkIsAssemblyNode({
    componentId: rawNode.definitionId,
    usedComponents: entityStore.usedComponents,
  });

  const node = isAssembly
    ? resolveAssembly({
        node: rawNode,
        entityStore,
      })
    : rawNode;

  const componentRegistration = getRegistration(node, isAssembly);

  if (!componentRegistration) {
    return null;
  }

  const { component } = componentRegistration;

  const resolveDesignValue = (
    valuesByBreakpoint: ValuesByBreakpoint,
    variableName: string,
  ): PrimitiveValue => {
    return getValueForBreakpoint(valuesByBreakpoint, breakpoints, 0, variableName);
  };

  const nodeProps = getNodeProps({
    node,
    componentRegistration,
    isAssembly,
    entityStore,
    locale,
    hyperlinkPattern,
    getPatternChildNodeClassName,
    resolveDesignValue,
  });

  const populateNodeSlots = () => {
    if (!componentRegistration.definition.slots) return;

    for (const slotId in componentRegistration.definition.slots) {
      const slotNode = node.children.find((child) => child.slotId === slotId);

      if (!slotNode) continue;

      nodeProps[slotId] = (
        <CompositionBlockWrapper
          node={slotNode}
          locale={locale}
          hyperlinkPattern={hyperlinkPattern}
          experience={experience}
        />
      );
    }
  };

  populateNodeSlots();

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

  // Hardcode the className to the SSR class name for server component
  const className = nodeProps.cfSsrClassName as string;

  const children =
    componentRegistration.definition.children === true
      ? node.children.map((childNode: ComponentTreeNode, index) => {
          return (
            <CompositionBlockWrapper
              experience={experience}
              getPatternChildNodeClassName={_getPatternChildNodeClassName}
              node={childNode}
              key={index}
              locale={locale}
              hyperlinkPattern={hyperlinkPattern}
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
