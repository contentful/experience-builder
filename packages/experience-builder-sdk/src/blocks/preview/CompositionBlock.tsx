import React, { useMemo } from 'react';

import type { UnresolvedLink } from 'contentful';
import omit from 'lodash.omit';
import { EntityStore } from '../../core/preview/EntityStore';

import {
  CF_STYLE_ATTRIBUTES,
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SECTION_ID,
} from '../../constants';
import {
  createDesignComponentRegistration,
  getComponentRegistration,
} from '../../core/componentRegistry';
import { buildCfStyles } from '../../utils/stylesUtils';
import { ResolveDesignValueType } from '../../hooks/useBreakpoints';
import { useStyleTag } from '../../hooks/useStyleTag';
import type {
  Breakpoint,
  CompositionDataSource,
  CompositionNode,
  CompositionUnboundValues,
  CompositionVariableValueType,
  ExperienceEntry,
  StyleProps,
} from '../../types';
import { ContentfulContainer } from '../../components/ContentfulContainer';
import { transformContentValue } from '../../utils/transformers';
import { resolveDesignComponent } from '../../core/preview/designComponentUtils';
import { DesignComponent } from '../../components/DesignComponent';
import { checkIfDesignComponent } from '../../utils/utils';

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
  const isDesignComponent = useMemo(
    () => checkIfDesignComponent({ componentId: rawNode.definitionId, usedComponents }),
    [rawNode.definitionId, usedComponents]
  );

  const node = useMemo(() => {
    return isDesignComponent
      ? resolveDesignComponent({
          node: rawNode,
          entityStore,
        })
      : rawNode;
  }, [entityStore, isDesignComponent, rawNode]);

  const componentRegistration = useMemo(() => {
    const registration = getComponentRegistration(node.definitionId as string);

    if (isDesignComponent && !registration) {
      return createDesignComponentRegistration({
        definitionId: node.definitionId as string,
        component: DesignComponent,
      });
    }
    return registration;
  }, [isDesignComponent, node.definitionId]);

  const nodeProps = useMemo(() => {
    if (!componentRegistration) {
      return {};
    }

    const propMap: Record<string, CompositionVariableValueType> = {};

    return Object.entries(node.variables).reduce((acc, [variableName, variable]) => {
      switch (variable.type) {
        case 'DesignValue':
          acc[variableName] = resolveDesignValue(variable.valuesByBreakpoint);
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
    node.variables,
    resolveDesignValue,
    dataSource,
    entityStore,
    unboundValues,
  ]);

  const cfStyles = buildCfStyles(nodeProps);
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

  // remove CONTENTFUL_SECTION_ID when all customers are using 2023-09-28 schema version
  if ([CONTENTFUL_CONTAINER_ID, CONTENTFUL_SECTION_ID].includes(node.definitionId)) {
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

  return React.createElement(
    component,
    {
      ...omit(nodeProps, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
      className,
    },
    children
  );
};
