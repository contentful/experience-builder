import times from 'lodash-es/times';
import random from 'lodash-es/random';
import {
  CompositionTree,
  CompositionComponentNode,
  StyleProps,
  CompositionDataSource,
  CompositionUnboundValues,
  ExperienceEntry,
} from '@/types';

export const getDataFromTree = (
  tree: CompositionTree
): {
  dataSource: CompositionDataSource;
  unboundValues: CompositionUnboundValues;
} => {
  let dataSource: CompositionDataSource = {};
  let unboundValues: CompositionUnboundValues = {};
  const queue = [...tree.root.children];

  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      continue;
    }

    dataSource = { ...dataSource, ...node.data.dataSource };
    unboundValues = { ...unboundValues, ...node.data.unboundValues };

    if (node.children.length) {
      queue.push(...node.children);
    }
  }

  return {
    dataSource,
    unboundValues,
  };
};

type GetInsertionDataParams = {
  dropReceiverNode: CompositionComponentNode;
  dropReceiverParentNode: CompositionComponentNode;
  flexDirection?: StyleProps['cfFlexDirection'];
  isMouseAtTopBorder: boolean;
  isMouseAtBottomBorder: boolean;
  isMouseInLeftHalf: boolean;
  isMouseInUpperHalf: boolean;
  isOverTopIndicator: boolean;
  isOverBottomIndicator: boolean;
};

type InsertionData = {
  node: CompositionComponentNode;
  index: number;
};

/**
 * Gets calculates the index to drop the dragged component based on the mouse position
 * @returns {InsertionData} a object containing a node that will become a parent for dragged component and index at which it must be inserted
 */
export const getInsertionData = ({
  dropReceiverParentNode,
  dropReceiverNode,
  flexDirection,
  isMouseAtTopBorder,
  isMouseAtBottomBorder,
  isMouseInLeftHalf,
  isMouseInUpperHalf,
  isOverTopIndicator,
  isOverBottomIndicator,
}: GetInsertionDataParams): InsertionData => {
  const APPEND_INSIDE = dropReceiverNode.children.length;
  const PREPEND_INSIDE = 0;

  if (isMouseAtTopBorder || isMouseAtBottomBorder) {
    const indexOfSectionInParentChildren = dropReceiverParentNode.children.findIndex(
      (n) => n.data.id === dropReceiverNode.data.id
    );
    const APPEND_OUTSIDE = indexOfSectionInParentChildren + 1;
    const PREPEND_OUTSIDE = indexOfSectionInParentChildren;

    return {
      // when the mouse is around the border we want to drop the new component as a new section onto the root node
      node: dropReceiverParentNode,
      index: isMouseAtBottomBorder ? APPEND_OUTSIDE : PREPEND_OUTSIDE,
    };
  }

  // if over one of the section indicators
  if (isOverTopIndicator || isOverBottomIndicator) {
    const indexOfSectionInParentChildren = dropReceiverParentNode.children.findIndex(
      (n) => n.data.id === dropReceiverNode.data.id
    );
    const APPEND_OUTSIDE = indexOfSectionInParentChildren + 1;
    const PREPEND_OUTSIDE = indexOfSectionInParentChildren;

    return {
      // when the mouse is around the border we want to drop the new component as a new section onto the root node
      node: dropReceiverParentNode,
      index: isOverBottomIndicator ? APPEND_OUTSIDE : PREPEND_OUTSIDE,
    };
  }

  if (flexDirection === undefined || flexDirection === 'row') {
    return {
      node: dropReceiverNode,
      index: isMouseInLeftHalf ? PREPEND_INSIDE : APPEND_INSIDE,
    };
  } else {
    return {
      node: dropReceiverNode,
      index: isMouseInUpperHalf ? PREPEND_INSIDE : APPEND_INSIDE,
    };
  }
};

export const generateRandomId = (letterCount: number): string => {
  const LETTERS = 'abcdefghijklmnopqvwxyzABCDEFGHIJKLMNOPQVWXYZ';
  const NUMS = '0123456789';
  const ALNUM = NUMS + LETTERS;

  return times(letterCount, () => ALNUM[random(0, ALNUM.length - 1)]).join('');
};

export const checkIfDesignComponent = ({
  componentId,
  usedComponents,
}: {
  componentId: string;
  usedComponents: ExperienceEntry['fields']['usedComponents'];
}) => {
  if (!usedComponents?.length) return false;

  return usedComponents.some((usedComponent) => usedComponent.sys.id === componentId);
};
