import React, { ReactNode, useMemo, useEffect } from 'react';
import type { UnresolvedLink } from 'contentful';
import {
  buildCfStyles,
  designTokensRegistry,
  EntityStore,
  flattenDesignTokenRegistry,
  isStructureWithRelativeHeight,
  maybePopulateDesignTokenValue,
  resolveHyperlinkPattern,
  sanitizeNodeProps,
  toCSSAttribute,
  toCSSString,
} from '@contentful/experiences-core';
import {
  CONTENTFUL_COMPONENTS,
  EMPTY_CONTAINER_HEIGHT,
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
import md5 from 'md5';

type CompositionBlockProps = {
  node: ComponentTreeNode;
  locale: string;
  entityStore: EntityStore;
  hyperlinkPattern?: string | undefined;
  resolveDesignValue: ResolveDesignValueType;
  getPatternChildNodeClassName?: (childNodeId: string) => string | undefined;
  wrappingPatternIds?: Set<string>;
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  hyperlinkPattern,
  resolveDesignValue,
  getPatternChildNodeClassName,
  wrappingPatternIds: parentWrappingPatternIds = new Set(),
}: CompositionBlockProps) => {
  const [hasRendered, setHasRendered] = React.useState(false);

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

  const { ssrProps, contentProps, props, styleSheet } = useMemo(() => {
    // In SSR, we store the className under breakpoints[0] which is resolved here to the actual string
    const cfSsrClassNameValues = node.variables.cfSsrClassName as DesignValue | undefined;
    const cfSsrClassName = resolveDesignValue(
      cfSsrClassNameValues?.valuesByBreakpoint,
      'cfSsrClassName',
    ) as string | undefined;

    // Don't enrich the assembly wrapper node with props
    if (!componentRegistration || isAssembly) {
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
      styleSheet = { className: undefined, styleSheet: undefined },
    } = parseComponentProps({
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
        const mapOfDesignVariableKeys = flattenDesignTokenRegistry(designTokensRegistry);
        const breakpoints = entityStore.breakpoints;
        const currentNodeClassNames: string[] = [];

        const result: Array<{
          className: string;
          breakpointCondition: string;
          css: string;
        }> = [];

        // then for each breakpoint
        for (const breakpoint of breakpoints) {
          const designProps = designPropsByBreakpointId[breakpoint.id];
          if (!designProps) {
            continue;
          }

          const propsByBreakpointWithResolvedDesignTokens = Object.entries(designProps).reduce(
            (acc, [propName, propValue]) => {
              return {
                ...acc,
                [propName]: maybePopulateDesignTokenValue(
                  propName,
                  propValue,
                  mapOfDesignVariableKeys,
                ),
              };
            },
            {},
          );

          // We convert cryptic prop keys to css variables
          // Eg: cfMargin to margin
          const stylesForBreakpoint = buildCfStyles(propsByBreakpointWithResolvedDesignTokens);

          if (
            !node.children.length &&
            isStructureWithRelativeHeight(node.definitionId, stylesForBreakpoint.height)
          ) {
            stylesForBreakpoint.minHeight = EMPTY_CONTAINER_HEIGHT;
          }

          const stylesForBreakpointWithoutUndefined: Record<string, string> = Object.fromEntries(
            Object.entries(stylesForBreakpoint)
              .filter(([, value]) => value !== undefined)
              .map(([key, value]) => [toCSSAttribute(key), value]),
          );

          /**
         * stylesForBreakpoint {
            margin: '0 0 0 0',
            padding: '0 0 0 0',
            'background-color': 'rgba(246, 246, 246, 1)',
            width: '100%',
            height: 'fit-content',
            'max-width': 'none',
            border: '0px solid rgba(0, 0, 0, 0)',
            'border-radius': '0px',
            gap: '0px 0px',
            'align-items': 'center',
            'justify-content': 'safe center',
            'flex-direction': 'column',
            'flex-wrap': 'nowrap',
            'font-style': 'normal',
            'text-decoration': 'none',
            'box-sizing': 'border-box'
          }
        */
          // I create a hash of the object above because that would ensure hash stability
          const styleHash = md5(JSON.stringify(stylesForBreakpointWithoutUndefined));

          // and prefix the className to make sure the value can be processed
          const className = `cfstyles-${styleHash}`;

          // I save the generated hashes into an array to later save it in the tree node
          // as cfSsrClassName prop
          // making sure to avoid the duplicates in case styles for > 1 breakpoints are the same
          if (!currentNodeClassNames.includes(className)) {
            currentNodeClassNames.push(className);
          }

          // otherwise, save it to the stylesheet
          result.push({
            className,
            breakpointCondition: breakpoint.query,
            css: toCSSString(stylesForBreakpointWithoutUndefined),
          });
        }

        return result;
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
            />
          );
        }
      }
    }

    const props: Record<string, PrimitiveValue> = {
      className: ssrProps.cfSsrClassName ?? styleSheet?.className?.join(' '),
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
      styleSheet,
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
  ]);

  // do not inject the stylesheet into the dom because it's already been done on the server side
  useInjectStylesheet(ssrProps.cfSsrClassName ? undefined : styleSheet?.styleSheet);

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
              wrappingPatternIds={wrappingPatternIds}
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
    return <PreviewUnboundImage node={node} nodeProps={props} component={component} />;
  }

  return React.createElement(
    component,
    {
      ...sanitizeNodeProps(props),
      key: `${node.id}-${hasRendered}`,
    },
    children ?? (typeof props.children === 'string' ? props.children : null),
  );
};
