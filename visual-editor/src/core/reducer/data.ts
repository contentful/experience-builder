import { Config, Content, Data, DropZoneMap } from '../types/Config';
import { reorder } from '../lib/reorder';
import { rootDroppableId } from '../lib/root-droppable-id';
import { insert } from '../lib/insert';
import { remove } from '../lib/remove';
import { setupZone } from '../lib/setup-zone';
import { replace } from '../lib/replace';
import { getItem } from '../lib/get-item';
import { duplicateRelatedZones, removeRelatedZones } from '../lib/reduce-related-zones';
import { generateId } from '../lib/generate-id';
import { Action, ReplaceAction } from './actions';
import { CompositionComponentNode } from '@/types';
import { onComponentDropped } from '@/communication/onComponentDrop';
import { getZoneId } from '../lib/get-zone-id';

// Restore unregistered zones when re-registering in same session
export const zoneCache = {};

export const addToZoneCache = (key: string, data: Content) => {
  zoneCache[key] = data;
};

export const replaceAction = (data: Data, action: ReplaceAction) => {
  if (action.destinationZone === rootDroppableId) {
    return {
      ...data,
      children: replace(data.children, action.destinationIndex, action.data),
    };
  }

  const newData = setupZone(data, action.destinationZone);

  return {
    ...newData,
    zones: {
      ...newData.zones,
      [action.destinationZone]: replace(
        newData.zones[action.destinationZone],
        action.destinationIndex,
        action.data
      ),
    },
  };
};

export const reduceDropZones = (
  dropZones: DropZoneMap,
  action: Action,
  config: Config
): DropZoneMap => {
  if (action.type === 'dropzone_update_direction') {
    const zone = dropZones.get(action.id);

    dropZones.set(action.id, { ...(zone || {}), ...action.data } as any);

    return dropZones;
  }

  return dropZones;
};

export const reduceData = (data: Data, action: Action, config: Config): Data => {
  if (action.type === 'insert') {
    const isRoot = !data.children.length;

    const [areaId, zoneId] = getZoneId(action.destinationZone);

    const parentId = zoneId || areaId;

    const parentNode = getItem({ id: parentId }, data);

    const parentIsRoot = parentId === rootDroppableId;

    const emptyComponentData: CompositionComponentNode = {
      type: isRoot ? 'root' : 'block',
      parentId,
      children: [],
      data: {
        blockId: !isRoot ? action.componentType : undefined,
        id: isRoot ? 'root' : generateId(action.componentType),
        breakpoints: [],
        dataSource: {},
        props: {},
        unboundValues: {},
      },
    };

    onComponentDropped({
      node: emptyComponentData,
      index: action.destinationIndex,
      parentType: parentIsRoot ? 'root' : parentNode?.type,
      parentBlockId: parentNode?.data.blockId,
    });

    if (action.destinationZone === rootDroppableId) {
      return {
        ...data,
        children: insert(data.children, action.destinationIndex, emptyComponentData),
      };
    }

    const newData = setupZone(data, action.destinationZone);

    return {
      ...data,
      zones: {
        ...newData.zones,
        [action.destinationZone]: insert(
          newData.zones[action.destinationZone],
          action.destinationIndex,
          emptyComponentData
        ),
      },
    };
  }

  if (action.type === 'duplicate') {
    const item = getItem({ id: action.sourceZone }, data)!;

    const newItem = {
      ...item,
      props: {
        ...item.data,
        id: generateId(item.type),
      },
    };

    const dataWithRelatedDuplicated = duplicateRelatedZones(item, data, newItem.data.id);

    if (action.sourceZone === rootDroppableId) {
      return {
        ...dataWithRelatedDuplicated,
        children: insert(data.children, action.sourceIndex + 1, newItem),
      };
    }

    return {
      ...dataWithRelatedDuplicated,
      zones: {
        ...dataWithRelatedDuplicated.zones,
        [action.sourceZone]: insert(
          dataWithRelatedDuplicated.zones[action.sourceZone],
          action.sourceIndex + 1,
          newItem
        ),
      },
    };
  }

  if (action.type === 'reorder') {
    if (action.destinationZone === rootDroppableId) {
      return {
        ...data,
        children: reorder(data.children, action.sourceIndex, action.destinationIndex),
      };
    }

    const newData = setupZone(data, action.destinationZone);

    return {
      ...data,
      zones: {
        ...newData.zones,
        [action.destinationZone]: reorder(
          newData.zones[action.destinationZone],
          action.sourceIndex,
          action.destinationIndex
        ),
      },
    };
  }

  if (action.type === 'move') {
    const newData = setupZone(setupZone(data, action.sourceZone), action.destinationZone);

    const item = getItem({ id: action.sourceZone }, newData);

    if (action.sourceZone === rootDroppableId) {
      return {
        ...newData,
        children: remove(newData.children, action.sourceIndex),
        zones: {
          ...newData.zones,

          [action.destinationZone]: insert(
            newData.zones[action.destinationZone],
            action.destinationIndex,
            item
          ),
        },
      };
    }

    if (action.destinationZone === rootDroppableId) {
      return {
        ...newData,
        children: insert(newData.children, action.destinationIndex, item),
        zones: {
          ...newData.zones,
          [action.sourceZone]: remove(newData.zones[action.sourceZone], action.sourceIndex),
        },
      };
    }

    return {
      ...newData,
      zones: {
        ...newData.zones,
        [action.sourceZone]: remove(newData.zones[action.sourceZone], action.sourceIndex),
        [action.destinationZone]: insert(
          newData.zones[action.destinationZone],
          action.destinationIndex,
          item
        ),
      },
    };
  }

  if (action.type === 'replace') {
    return replaceAction(data, action);
  }

  if (action.type === 'remove') {
    const item = getItem({ id: action.zone }, data);

    // Remove any related zones
    const dataWithRelatedRemoved = setupZone(removeRelatedZones(item, data), action.zone);

    if (action.zone === rootDroppableId) {
      return {
        ...dataWithRelatedRemoved,
        children: remove(data.children, action.index),
      };
    }

    return {
      ...dataWithRelatedRemoved,
      zones: {
        ...dataWithRelatedRemoved.zones,
        [action.zone]: remove(dataWithRelatedRemoved.zones[action.zone], action.index),
      },
    };
  }

  if (action.type === 'registerZone') {
    if (zoneCache[action.zone]) {
      return {
        ...data,
        zones: {
          ...data.zones,
          [action.zone]: zoneCache[action.zone],
        },
      };
    }

    return setupZone(data, action.zone);
  }

  if (action.type === 'unregisterZone') {
    const _zones = { ...(data.zones || {}) };

    if (_zones[action.zone]) {
      zoneCache[action.zone] = _zones[action.zone];

      delete _zones[action.zone];
    }

    return { ...data, zones: _zones };
  }

  if (action.type === 'setData') {
    if (typeof action.data === 'object') {
      return {
        ...data,
        ...action.data,
      };
    }

    return { ...data, ...action.data(data) };
  }

  return data;
};
