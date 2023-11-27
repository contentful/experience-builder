import React, { CSSProperties, RefObject, useContext, useEffect, useMemo, useState } from 'react';
import { DraggableComponent } from '../DraggableComponent';
import { Direction, Droppable } from '@hello-pangea/dnd';
import { getItem } from '../../lib/get-item';
import { setupZone } from '../../lib/setup-zone';
import { rootDroppableId } from '../../lib/root-droppable-id';
import { getClassNameFactory } from '../../lib';
import styles from './styles.module.css';
import { DropZoneProvider, dropZoneContext } from './context';
import { getZoneId } from '../../lib/get-zone-id';
import {
  CompositionDataSource,
  CompositionUnboundValues,
} from '@contentful/experience-builder-core';
import { ResolveDesignValueType } from '@/hooks/useBreakpoints';
import { EntityStore } from '@contentful/visual-sdk';
import EditorBlock from './EditorBlock';
import { ComponentData } from '@/core/types/Config';
import { CF_STYLE_ATTRIBUTES, CONTENTFUL_CONTAINER_ID } from '@contentful/experience-builder-core';

const getClassName = getClassNameFactory('DropZone', styles);

export { DropZoneProvider, dropZoneContext } from './context';

type DropZoneProps = {
  zone: string;
  style?: CSSProperties;
  node?: ComponentData;
  dataSource?: CompositionDataSource;
  unboundValues?: CompositionUnboundValues;
  resolveDesignValue?: ResolveDesignValueType;
  entityStore?: RefObject<EntityStore>;
  areEntitiesFetched?: boolean;
  className?: string;
  WrapperComponent?: any;
};

function DropZoneEdit({
  node,
  zone,
  style,
  dataSource,
  unboundValues,
  resolveDesignValue,
  entityStore,
  areEntitiesFetched,
  className,
  WrapperComponent = 'div',
  ...rest
}: DropZoneProps) {
  const ctx = useContext(dropZoneContext);

  const {
    // These all need setting via context
    data,
    itemSelector,
    areaId,
    draggedItem,
    placeholderStyle,
    registerZoneArea,
  } = ctx! || {};

  const content = node?.children || data?.children || [];
  let zoneCompound = rootDroppableId;

  useEffect(() => {
    if (areaId && registerZoneArea) {
      registerZoneArea(areaId);
    }
  }, [areaId]);

  // Register and unregister zone on mount
  useEffect(() => {
    if (ctx?.registerZone) {
      ctx?.registerZone(zoneCompound);
    }

    return () => {
      if (ctx?.unregisterZone) {
        ctx?.unregisterZone(zoneCompound);
      }
    };
  }, []);

  if (areaId) {
    if (zone !== rootDroppableId) {
      zoneCompound = `${areaId}:${zone}`;
      // content = setupZone(data, zoneCompound).zones[zoneCompound];
    }
  }

  const isRootZone =
    zoneCompound === rootDroppableId || zone === rootDroppableId || areaId === 'root';

  const draggedSourceId = draggedItem && draggedItem.source.droppableId;
  const draggedDestinationId = draggedItem && draggedItem.destination?.droppableId;
  const [zoneArea] = getZoneId(zoneCompound);

  // we use the index rather than spread to prevent down-level iteration warnings: https://stackoverflow.com/questions/53441292/why-downleveliteration-is-not-on-by-default
  const [draggedSourceArea] = getZoneId(draggedSourceId);

  const [userWillDrag, setUserWillDrag] = useState(false);

  const userIsDragging = !!draggedItem;
  const draggingOverArea = userIsDragging && zoneArea === draggedSourceArea;
  const draggingNewComponent = draggedSourceId?.startsWith('component-list');

  const direction: Direction = useMemo(() => {
    if (!node) {
      return 'vertical';
    }

    if (node.data.blockId !== CONTENTFUL_CONTAINER_ID) {
      return 'vertical';
    }

    const designValues = node.data.props['cfFlexDirection'];

    if (!designValues || !resolveDesignValue || designValues.type !== 'DesignValue') {
      return 'vertical';
    }

    const direction = resolveDesignValue(designValues.valuesByBreakpoint);

    if (direction === 'row') {
      return 'horizontal';
    }

    return 'vertical';
  }, []);

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

  const { hoveringArea = 'root', setHoveringArea, hoveringZone, setHoveringZone } = ctx;

  const hoveringOverArea = hoveringArea ? hoveringArea === zoneArea : isRootZone;
  const hoveringOverZone = hoveringZone === zoneCompound;

  let isEnabled = userWillDrag;

  /**
   * We enable zones when:
   *
   * 1. This is a new component and the user is dragging over the area. This
   *    check prevents flickering if you move cursor outside of zone
   *    but within the area
   * 2. This is an existing component and the user a) is dragging over the
   *    area (which prevents drags between zone areas, breaking the rules
   *    of @hello-pangea/dnd) and b) has the cursor hovering directly over
   *    the specific zone (which increases robustness when using flex
   *    layouts)
   */
  if (userIsDragging) {
    if (draggingNewComponent) {
      isEnabled = hoveringOverArea;
    } else {
      isEnabled = draggingOverArea && hoveringOverZone;
    }
  }

  const selectedItem = itemSelector ? getItem(itemSelector, data) : null;
  const isAreaSelected = selectedItem && zoneArea === selectedItem.data.id;

  return (
    <div
      className={getClassName({
        isRootZone,
        userIsDragging,
        draggingOverArea,
        hoveringOverArea,
        draggingNewComponent,
        isDestination: draggedDestinationId === zoneCompound,
        isDisabled: !isEnabled,
        isAreaSelected,
        hasChildren: content.length > 0,
      })}>
      <Droppable droppableId={zoneCompound} direction={direction} isDropDisabled={!isEnabled}>
        {(provided, snapshot) => {
          return (
            <WrapperComponent
              {...(provided || { droppableProps: {} }).droppableProps}
              className={`${getClassName('content')} ${className}`}
              ref={provided?.innerRef}
              // style={style}
              id={zoneCompound}
              onMouseOver={(e) => {
                e.stopPropagation();
                setHoveringArea(zoneArea);
                setHoveringZone(zoneCompound);
              }}
              {...rest}>
              {content.map((item, i) => {
                const componentId = item.data.id;

                return (
                  <EditorBlock
                    index={i}
                    userIsDragging={userIsDragging}
                    zoneCompound={zoneCompound}
                    zoneArea={zoneArea}
                    draggingNewComponent={draggingNewComponent}
                    setUserWillDrag={setUserWillDrag}
                    node={item}
                    dataSource={dataSource}
                    unboundValues={unboundValues}
                    resolveDesignValue={resolveDesignValue}
                    entityStore={entityStore}
                    areEntitiesFetched={areEntitiesFetched}
                    ctx={{
                      ...ctx,
                      areaId: componentId,
                    }}
                  />
                );
              })}
              {provided?.placeholder}
              {snapshot?.isDraggingOver && (
                <div
                  data-puck-placeholder
                  style={{
                    ...placeholderStyle,
                    background: 'var(--puck-color-azure-5)',
                    opacity: 0.3,
                    zIndex: 0,
                  }}
                />
              )}
            </WrapperComponent>
          );
        }}
      </Droppable>
    </div>
  );
}

function DropZoneRender({ zone }: DropZoneProps) {
  const ctx = useContext(dropZoneContext);

  const { data, areaId = 'root', config } = ctx || {};

  let zoneCompound = rootDroppableId;
  let content = data?.children || [];

  if (!data || !config) {
    return null;
  }

  if (areaId && zone && zone !== rootDroppableId) {
    zoneCompound = `${areaId}:${zone}`;
    content = setupZone(data, zoneCompound).zones[zoneCompound];
  }

  return (
    <>
      {content.map((item) => {
        const Component = config.components[item.data.blockId!];

        if (Component) {
          return (
            <DropZoneProvider key={item.data.id} value={{ data, config, areaId: item.data.id }}>
              <Component.render {...item.data.props} puck={{ renderDropZone: DropZone }} />
            </DropZoneProvider>
          );
        }

        return null;
      })}
    </>
  );
}

export function DropZone(props: DropZoneProps) {
  const ctx = useContext(dropZoneContext);

  if (ctx?.mode === 'edit') {
    return <DropZoneEdit {...props} />;
  }

  return <DropZoneRender {...props} />;
}
