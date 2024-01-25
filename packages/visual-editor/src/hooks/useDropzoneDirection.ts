import {
  CONTENTFUL_CONTAINER_ID,
  CONTENTFUL_SINGLE_COLUMN_ID,
  CONTENTFUL_COLUMNS_ID,
} from '@contentful/experience-builder-core/constants';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import { useEffect } from 'react';
import { useZoneStore } from '@/store/zone';

// refactor to use isContentfulStructureComponent once https://github.com/contentful/experience-builder/pull/279 merges
const isStructureComponent = (blockId: string) => {
  return [CONTENTFUL_COLUMNS_ID, CONTENTFUL_CONTAINER_ID, CONTENTFUL_SINGLE_COLUMN_ID].includes(
    blockId
  );
};
interface Params {
  resolveDesignValue: ResolveDesignValueType | undefined;
  node: CompositionComponentNode | undefined;
  zoneId: string;
}

export const useDropzoneDirection = ({ resolveDesignValue, node, zoneId }: Params) => {
  const zone = useZoneStore((state) => state.zones);
  const upsertZone = useZoneStore((state) => state.upsertZone);

  useEffect(() => {
    function getDirection() {
      if (!node || !node.data.blockId) {
        return 'vertical';
      }

      if (!isStructureComponent(node.data.blockId)) {
        return 'vertical';
      }

      if (node.data.blockId === CONTENTFUL_COLUMNS_ID) {
        return 'horizontal';
      }

      const designValues = node.data.props['cfFlexDirection'];

      if (!designValues || !resolveDesignValue || designValues.type !== 'DesignValue') {
        return 'vertical';
      }

      const direction = resolveDesignValue(designValues.valuesByBreakpoint, 'cfFlexDirection');

      if (direction === 'row') {
        return 'horizontal';
      }

      return 'vertical';
    }

    upsertZone(zoneId, { direction: getDirection() });
  }, [node, resolveDesignValue, zoneId, upsertZone]);

  return zone[zoneId]?.direction || 'vertical';
};
