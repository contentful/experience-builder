import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import type {
  ExperienceTreeNode,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';
import { useEffect } from 'react';
import { useZoneStore } from '@/store/zone';
import { isContentfulStructureComponent } from '@contentful/experiences-core';

interface Params {
  resolveDesignValue: ResolveDesignValueType | undefined;
  node: ExperienceTreeNode | undefined;
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

      if (!isContentfulStructureComponent(node.data.blockId)) {
        return 'vertical';
      }

      if (node.data.blockId === CONTENTFUL_COMPONENTS.columns.id) {
        return 'horizontal';
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
    }

    upsertZone(zoneId, { direction: getDirection() });
  }, [node, resolveDesignValue, zoneId, upsertZone]);

  return zone[zoneId]?.direction || 'vertical';
};
