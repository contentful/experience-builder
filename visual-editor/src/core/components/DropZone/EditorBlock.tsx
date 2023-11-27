import { ResolveDesignValueType } from '@/hooks/useBreakpoints';
import {
  ComponentRegistration,
  CompositionComponentNode,
  CompositionDataSource,
  CompositionUnboundValues,
  CompositionVariableValueType,
  Link,
  StyleProps,
} from '@/types';
import { EntityStore } from '@contentful/visual-sdk';
import React, { RefObject, useMemo } from 'react';
import { DropZoneContext, DropZoneProvider } from './context';
import { getClassNameFactory } from '@/core/lib';
import styles from './styles.module.css';
import { getItem } from '@/core/lib/get-item';
import { DropZone } from '.';
import { DraggableComponent } from '../DraggableComponent';
import { useEditorContext } from '@components/editor/useEditorContext';
import { buildCfStyles, calculateNodeDefaultHeight } from '@/utils/stylesUtils';
import { transformContentValue } from '@/utils/transformers';
import { getUnboundValues } from '@/utils/getUnboundValues';
import { sendMessage } from '@/communication/sendMessage';
import { CF_STYLE_ATTRIBUTES, OUTGOING_EVENTS } from '@contentful/experience-builder';
import { useStyleTag } from '@/hooks/useStyleTag';
import { useSelectedInstanceCoordinates } from '@/hooks/useSelectedInstanceCoordinates';
import { omit } from 'lodash';

type PropsType =
  | StyleProps
  | Record<string, CompositionVariableValueType | Link<'Entry'> | Link<'Asset'>>;

type VisualEditorBlockProps = {
  node: CompositionComponentNode;
  index: number;
  userIsDragging: boolean;
  draggingNewComponent: boolean | undefined;
  zoneCompound: string;
  zoneArea: string;
  dataSource: CompositionDataSource;
  unboundValues: CompositionUnboundValues;
  setUserWillDrag: (bool: boolean) => void;
  resolveDesignValue: ResolveDesignValueType;
  entityStore: RefObject<EntityStore>;
  areEntitiesFetched: boolean;
  ctx: DropZoneContext;
};

const getClassName = getClassNameFactory('DropZone', styles);

const EditorBlock: React.FC<VisualEditorBlockProps> = ({
  node,
  dataSource,
  unboundValues,
  resolveDesignValue,
  entityStore,
  areEntitiesFetched,
  draggingNewComponent,
  setUserWillDrag,
  index,
  userIsDragging,
  zoneArea,
  zoneCompound,
  ctx,
}) => {
  const { componentRegistry, setSelectedNodeId } = useEditorContext();
  const {
    // These all need setting via context
    data,
    dispatch = () => null,
    config,
    itemSelector,
    setItemSelector = () => null,
    areaId,
    draggedItem,
    placeholderStyle,
    registerZoneArea,
    registerPath,
    hoveringArea,
    areasWithZones,
    hoveringComponent,
  } = ctx! || {};

  const selectedItem = itemSelector ? getItem(itemSelector, data) : null;

  // console.log(selectedItem, node, node.data.blockId);
  // Todo:
  // 1. look into component registration mapping to render
  // 2. look into add / other crud redux actions

  useSelectedInstanceCoordinates({ node });
  const componentRegistration = useMemo(() => {
    // const registration = getComponentRegistration(node.data.blockId as string);

    const id = node.data.blockId as string;

    return componentRegistry.get(id) as ComponentRegistration;

    // if (node.type === DESIGN_COMPONENT_NODE_TYPE && !registration) {
    //   return createDesignComponentRegistration({
    //     definitionId: node.data.blockId as string,
    //     component: DesignComponent,
    //   });
    // }
  }, [node]);

  const props: PropsType = useMemo(() => {
    if (!componentRegistration) {
      return {};
    }

    return Object.entries(componentRegistration.definition.variables).reduce(
      (acc, [variableName, variableDefinition]) => {
        const variableMapping = node.data.props[variableName];
        if (!variableMapping) {
          return {
            ...acc,
            [variableName]: variableDefinition.defaultValue,
          };
        }

        if (variableMapping.type === 'DesignValue') {
          const valueByBreakpoint = resolveDesignValue(variableMapping.valuesByBreakpoint);
          const designValue =
            variableName === 'cfHeight'
              ? calculateNodeDefaultHeight({
                  blockId: node.data.blockId,
                  children: node.children,
                  value: valueByBreakpoint,
                })
              : valueByBreakpoint;

          return {
            ...acc,
            [variableName]: designValue,
          };
        } else if (variableMapping.type === 'BoundValue') {
          // take value from the datasource for both bound and unbound value types
          const [, uuid, ...path] = variableMapping.path.split('/');
          const binding = dataSource[uuid] as Link<'Entry' | 'Asset'>;

          const boundValue = areEntitiesFetched
            ? entityStore.current?.getValue(binding, path.slice(0, -1))
            : undefined;
          const value = boundValue || variableDefinition.defaultValue;

          return {
            ...acc,
            [variableName]: transformContentValue(value, variableDefinition),
          };
        } else {
          const value = getUnboundValues({
            key: variableMapping.key,
            fallback: variableDefinition.defaultValue,
            unboundValues: unboundValues || {},
          });

          return {
            ...acc,
            [variableName]: value,
          };
        }
      },
      {}
    );
  }, [
    componentRegistration,
    node.data.props,
    node.data.blockId,
    node.children,
    resolveDesignValue,
    dataSource,
    areEntitiesFetched,
    entityStore,
    unboundValues,
  ]);

  const cfStyles = buildCfStyles(props);
  const { className } = useStyleTag({ styles: cfStyles, nodeId: node.data.id });

  const defaultedProps = {
    className,
    puck: { renderDropZone: DropZone },
    editMode: true,
    node,
    dataSource,
    entityStore,
    resolveDesignValue,
    areEntitiesFetched,
    unboundValues,
    'data-cf-node-id': node.data.id,
    'data-cf-node-block-id': node.data.blockId,
    'data-cf-node-block-type': node.type,
    // TODO: do we really need lodash just for this?
    ...omit(props, CF_STYLE_ATTRIBUTES, ['cfHyperlink', 'cfOpenInNewTab']),
  };

  const componentId = node.data.id;
  const isSelected = selectedItem?.data.id === componentId || false;

  const isDragging =
    (draggedItem?.draggableId || 'draggable-').split('draggable-')[1] === componentId;

  const containsZone = areasWithZones ? areasWithZones[componentId] : false;

  // console.log('zone info', containsZone, componentId, areasWithZones);

  const Render = config.components[node.data.blockId!]
    ? config.components[node.data.blockId!].render
    : () => (
        <div style={{ padding: 48, textAlign: 'center' }}>
          No configuration for {node.data.blockId}
        </div>
      );

  if (
    !ctx?.config ||
    !ctx.setHoveringArea ||
    !ctx.setHoveringZone ||
    !ctx.setHoveringComponent ||
    !ctx.setItemSelector ||
    !ctx.registerPath ||
    !ctx.dispatch ||
    !dataSource ||
    !resolveDesignValue ||
    !entityStore ||
    !areEntitiesFetched ||
    !unboundValues
  ) {
    return <div>DropZone requires context to work.</div>;
  }

  const { setHoveringArea, hoveringZone, setHoveringZone, setHoveringComponent } = ctx;

  return (
    <div
      key={node.data.id}
      className={getClassName('item')}
      style={{ zIndex: isDragging ? 1 : undefined }}>
      <DropZoneProvider value={ctx}>
        <DraggableComponent
          label={node.data.blockId?.toString()}
          id={`draggable-${componentId}`}
          index={index}
          isSelected={isSelected}
          isLocked={userIsDragging}
          forceHover={hoveringComponent === componentId && !userIsDragging}
          indicativeHover={userIsDragging && containsZone && hoveringArea === componentId}
          onMount={() => {
            ctx.registerPath!({
              id: node.data.id,
            });
          }}
          onClick={(e) => {
            setItemSelector({
              id: node.data.id,
            });
            e.stopPropagation();

            setSelectedNodeId(node.data.id);
            sendMessage(OUTGOING_EVENTS.ComponentSelected, {
              nodeId: node.data.id,
            });
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setUserWillDrag(true);
          }}
          onMouseUp={(e) => {
            e.stopPropagation();
            setItemSelector({
              id: node.data.id,
            });
            setUserWillDrag(false);
          }}
          onMouseOver={(e) => {
            e.stopPropagation();

            if (containsZone) {
              setHoveringArea(componentId);
            } else {
              setHoveringArea(zoneArea);
            }

            setHoveringComponent(componentId);

            setHoveringZone(zoneCompound);
          }}
          onMouseOut={() => {
            setHoveringArea(null);
            setHoveringZone(null);
            setHoveringComponent(null);
          }}
          onDelete={(e) => {
            dispatch({
              type: 'remove',
              index,
              zone: zoneCompound,
            });

            setItemSelector(null);

            e.stopPropagation();
          }}
          onDuplicate={(e) => {
            dispatch({
              type: 'duplicate',
              sourceIndex: index,
              sourceZone: zoneCompound,
            });

            setItemSelector({
              id: node.data.id,
            });

            e.stopPropagation();
          }}
          style={{
            pointerEvents: userIsDragging && draggingNewComponent ? 'all' : undefined,
          }}>
          <div>
            <Render {...defaultedProps} />
          </div>
        </DraggableComponent>
      </DropZoneProvider>
      {userIsDragging && (
        <div
          className={getClassName('hitbox')}
          onMouseOver={(e) => {
            e.stopPropagation();
            setHoveringArea(zoneArea);
            setHoveringZone(zoneCompound);
          }}
        />
      )}
    </div>
  );
};

export default EditorBlock;
