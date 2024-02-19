import React, { useMemo } from 'react';
import type { Asset, AssetFile, UnresolvedLink } from 'contentful';
import { omit } from 'lodash-es';
import {
  EntityStore,
  isEmptyStructureWithRelativeHeight,
  transformImageAsset,
} from '@contentful/experience-builder-core';
import {
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_COMPONENTS,
  EMPTY_CONTAINER_HEIGHT,
} from '@contentful/experience-builder-core/constants';
import type {
  BoundComponentPropertyTypes,
  CompositionNode,
  CompositionVariableValueType,
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

    const propMap: Record<string, CompositionVariableValueType> = {};

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = resolveDesignValue(variable.valuesByBreakpoint, variableName);
          break;
        case 'BoundValue': {
          const [, uuid, ...path] = variable.path.split('/');
          const binding = entityStore.dataSource[uuid] as UnresolvedLink<'Entry' | 'Asset'>;
          const isMediaType =
            componentRegistration.definition.variables[variableName]?.type === 'Media';

          let value: BoundComponentPropertyTypes;

          if (isMediaType && binding.sys.linkType === 'Asset') {
            const asset = entityStore.getEntryOrAsset(binding) as Asset;
            value = transformImageAsset(asset.fields.file as AssetFile, '100vw', 60, 'jpg');
          } else {
            value = entityStore.getValue(binding, path.slice(0, -1));
            if (value) {
              value =
                typeof value == 'object' && (value as AssetFile).url && !isMediaType
                  ? (value as AssetFile).url
                  : value;
            } else {
              const foundAssetValue = entityStore.getValue(binding, [
                ...path.slice(0, -2),
                'fields',
                'file',
              ]);
              if (foundAssetValue) {
                value = foundAssetValue;
              }
            }
            const variableDefinition = componentRegistration.definition.variables[variableName];
            value = transformContentValue(value, variableDefinition) as any;
          }

          acc[variableName] = value;
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
      ? node.children.map((childNode: CompositionNode, index) => {
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
