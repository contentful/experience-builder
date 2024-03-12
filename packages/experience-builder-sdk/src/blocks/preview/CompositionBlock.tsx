import React, { useMemo } from 'react';
import type { UnresolvedLink } from 'contentful';
import { omit } from 'lodash-es';
import {
  EntityStore,
  isEmptyStructureWithRelativeHeight,
  isDeepPath,
} from '@contentful/experiences-core';
import {
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_COMPONENTS,
  EMPTY_CONTAINER_HEIGHT,
} from '@contentful/experiences-core/constants';
import type {
  ComponentTreeNode,
  PrimitiveValue,
  ResolveDesignValueType,
  StyleProps,
} from '@contentful/experiences-core/types';
import { createAssemblyRegistration, getComponentRegistration } from '../../core/componentRegistry';
import {
  buildCfStyles,
  checkIsAssemblyNode,
  transformContentValue,
} from '@contentful/experiences-core';
import { useStyleTag } from '../../hooks/useStyleTag';
import {
  Columns,
  ContentfulContainer,
  SingleColumn,
} from '@contentful/experiences-components-react';

import { resolveAssembly } from '../../core/preview/assemblyUtils';
import { Assembly } from '../../components/Assembly';

type CompositionBlockProps = {
  node: ComponentTreeNode;
  locale: string;
  entityStore: EntityStore;
  resolveDesignValue: ResolveDesignValueType;
};

export const CompositionBlock = ({
  node: rawNode,
  locale,
  entityStore,
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
    // Don't enrich the assembly wrapper node with props
    if (!componentRegistration || isAssembly) {
      return {};
    }

    const propMap: Record<string, PrimitiveValue> = {};

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = resolveDesignValue(variable.valuesByBreakpoint, variableName);
          break;
        case 'BoundValue': {
          const variableDefinition = componentRegistration.definition.variables[variableName];
          if (isDeepPath(variable.path)) {
            const [, uuid] = variable.path.split('/');
            const link = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
            const boundValue = entityStore.getValueDeep(link, variable.path);
            const value = boundValue || variableDefinition.defaultValue;
            acc[variableName] = transformContentValue(value, variableDefinition);
            break;
          }
          const [, uuid, ...path] = variable.path.split('/');
          const binding = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
          let value = entityStore.getValue(binding, path.slice(0, -1));
          if (!value) {
            const foundAssetValue = entityStore.getValue(binding, [
              ...path.slice(0, -2),
              'fields',
              'file',
            ]);
            if (foundAssetValue) {
              value = foundAssetValue;
            }
          }
          acc[variableName] = transformContentValue(value, variableDefinition);
          break;
        }
        case 'UnboundValue': {
          const uuid = variable.key;
          acc[variableName] = entityStore.unboundValues[uuid]?.value;
          break;
        }
        default:
          break;
      }
      return acc;
    }, propMap);
  }, [componentRegistration, isAssembly, node.variables, resolveDesignValue, entityStore]);

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
      ? node.children.map((childNode: ComponentTreeNode, index) => {
          return (
            <CompositionBlock
              node={childNode}
              key={index}
              locale={locale}
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

  return React.createElement(
    component,
    {
      ...omit(nodeProps, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
      className,
    },
    children,
  );
};
