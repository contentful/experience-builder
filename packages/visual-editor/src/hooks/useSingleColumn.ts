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

  const { isWrapped, wrapColumnsCount } = useMemo(() => {
    let isWrapped = false;
    let wrapColumnsCount = 0;

    if (!node.parentId || !isSingleColumn) {
      return { isWrapped, wrapColumnsCount };
    }

    const parentNode = getItem({ id: node.parentId }, tree);

    if (!parentNode || parentNode.data.blockId !== CONTENTFUL_COMPONENTS.columns.id) {
      return { isWrapped, wrapColumnsCount };
    }

    const { cfWrapColumns, cfWrapColumnsCount } = parentNode.data.props;

    if (cfWrapColumns.type === 'DesignValue') {
      isWrapped = resolveDesignValue(cfWrapColumns.valuesByBreakpoint, 'cfWrapColumns') as boolean;
    }

    if (cfWrapColumnsCount.type === 'DesignValue') {
      wrapColumnsCount = resolveDesignValue(
        cfWrapColumnsCount.valuesByBreakpoint,
        'cfWrapColumnsCount',
      ) as number;
    }

    return { isWrapped, wrapColumnsCount };
  }, [tree, node, isSingleColumn, resolveDesignValue]);

  return {
    isSingleColumn,
    isWrapped,
    wrapColumnsCount,
  };
}
