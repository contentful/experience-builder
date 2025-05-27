import { useTreeStore } from '@/store/tree';
import { getItem } from '@/utils/getItem';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { ExperienceTreeNode, ResolveDesignValueType } from '@contentful/experiences-core/types';
import { useMemo } from 'react';

export default function useSingleColumn(
  node: ExperienceTreeNode,
  resolveDesignValue: ResolveDesignValueType,
) {
  const tree = useTreeStore((store) => store.tree);
  const isSingleColumn = node.data.blockId === CONTENTFUL_COMPONENTS.singleColumn.id;

  const isWrapped = useMemo(() => {
    if (!node.parentId || !isSingleColumn) {
      return false;
    }

    const parentNode = getItem({ id: node.parentId }, tree);
    if (!parentNode || parentNode.data.blockId !== CONTENTFUL_COMPONENTS.columns.id) {
      return false;
    }

    const { cfWrapColumns } = parentNode.data.props;
    if (cfWrapColumns.type !== 'DesignValue') {
      return false;
    }

    return resolveDesignValue(cfWrapColumns.valuesByBreakpoint) as boolean;
  }, [tree, node, isSingleColumn, resolveDesignValue]);

  return {
    isSingleColumn,
    isWrapped,
  };
}
