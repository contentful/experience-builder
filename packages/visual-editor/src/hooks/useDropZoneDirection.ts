import { CONTENTFUL_CONTAINER_ID } from '@contentful/experience-builder-core/constants';
import type {
  CompositionComponentNode,
  ResolveDesignValueType,
} from '@contentful/experience-builder-core/types';
import { useEffect } from 'react';
import { useZoneStore } from '@/store/zone';

interface Params {
  resolveDesignValue: ResolveDesignValueType | undefined;
  node: CompositionComponentNode | undefined;
  zoneId: string;
}

export const useDropZoneDirection = ({ resolveDesignValue, node, zoneId }: Params) => {
  const zone = useZoneStore((state) => state.zones);
  const upsertZone = useZoneStore((state) => state.upsertZone);

  useEffect(() => {
    function getDirection() {
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
