import React, { useMemo } from 'react';
import type { UnresolvedLink } from 'contentful';
import { omit } from 'lodash-es';
import {
  EntityStore,
  isEmptyStructureWithRelativeHeight,
} from '@contentful/experience-builder-core';
import {
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_COMPONENTS,
  EMPTY_CONTAINER_HEIGHT,
} from '@contentful/experience-builder-core/constants';
import type {
  Breakpoint,
  CompositionDataSource,
  CompositionNode,
  CompositionUnboundValues,
  CompositionVariableValueType,
  ExperienceEntry,
  ResolveDesignValueType,
  StyleProps,
} from '@contentful/experience-builder-core/types';
import { createAssemblyRegistration, getComponentRegistration } from '../../core/componentRegistry';
import {
  buildCfStyles,
  checkIsAssemblyNode,
  transformContentValue,
} from '@contentful/experience-builder-core';
import { useStyleTag } from '../../hooks/useStyleTag';
import {
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experience-builder-components';

import { resolveAssembly } from '../../core/preview/assemblyUtils';
import { Assembly } from '../../components/Assembly';

type CompositionBlockProps = {
  node: CompositionNode;
  locale: string;
  dataSource: CompositionDataSource;
  unboundValues: CompositionUnboundValues;
  entityStore?: EntityStore;
  breakpoints: Breakpoint[];
  resolveDesignValue: ResolveDesignValueType;
  usedComponents: ExperienceEntry['fields']['usedComponents'];
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
  dataSource,
  unboundValues,
  breakpoints,
  resolveDesignValue,
  usedComponents,
}: CompositionBlockProps) => {
  const isAssembly = useMemo(
    () => checkIsAssemblyNode({ componentId: rawNode.definitionId, usedComponents }),
    [rawNode.definitionId, usedComponents],
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
      return {};
    }

    const propMap: Record<string, CompositionVariableValueType> = {};

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = resolveDesignValue(variable.valuesByBreakpoint, variableName);
          break;
        case 'BoundValue': {
          const [, uuid, ...path] = variable.path.split('/');
          const binding = dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
          let value = entityStore?.getValue(binding, path.slice(0, -1));
          if (!value) {
            const foundAssetValue = entityStore?.getValue(binding, [
              ...path.slice(0, -2),
              'fields',
              'file',
            ]);
            if (foundAssetValue) {
              value = foundAssetValue;
            }
          }
          const variableDefinition = componentRegistration.definition.variables[variableName];
          acc[variableName] = transformContentValue(value, variableDefinition);
          break;
        }
        case 'UnboundValue': {
          const uuid = variable.key;
          acc[variableName] = (entityStore?.unboundValues || unboundValues)[uuid]?.value;
          break;
        }
        default:
          break;
      }
      return acc;
    }, propMap);
  }, [
    componentRegistration,
    isAssembly,
    node.variables,
    resolveDesignValue,
    dataSource,
    entityStore,
    unboundValues,
  ]);

  const cfStyles = buildCfStyles(nodeProps);

  if (
    isEmptyStructureWithRelativeHeight(node.children.length, node.definitionId, cfStyles.height)
  ) {
    cfStyles.minHeight = EMPTY_CONTAINER_HEIGHT;
  }

  const { className } = useStyleTag({ styles: cfStyles });

  if (!componentRegistration) {
    return null;
  }

  const { component } = componentRegistration;

  const children =
    componentRegistration.definition.children === true
      ? node.children.map((childNode: CompositionNode, index) => {
          return (
            <CompositionBlock
              node={childNode}
              key={index}
              locale={locale}
              dataSource={dataSource}
              unboundValues={unboundValues}
              entityStore={entityStore}
              breakpoints={breakpoints}
              resolveDesignValue={resolveDesignValue}
              usedComponents={usedComponents}
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

  return React.createElement(
    component,
    {
      ...omit(nodeProps, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
      className,
    },
    children,
  );
};
