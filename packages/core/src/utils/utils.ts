import {
  ExperienceTree,
  ExperienceTreeNode,
  StyleProps,
  ExperienceDataSource,
  ExperienceUnboundValues,
  ExperienceEntry,
  ComponentDefinition,
} from '@/types';
import { Entry } from 'contentful';
import { ASSEMBLY_DEFAULT_CATEGORY } from '@/constants';

export const getDataFromTree = (
  tree: ExperienceTree,
): {
  dataSource: ExperienceDataSource;
  unboundValues: ExperienceUnboundValues;
} => {
  let dataSource: ExperienceDataSource = {};
  let unboundValues: ExperienceUnboundValues = {};
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
  dropReceiverNode: ExperienceTreeNode;
  dropReceiverParentNode: ExperienceTreeNode;
  flexDirection?: StyleProps['cfFlexDirection'];
  isMouseAtTopBorder: boolean;
  isMouseAtBottomBorder: boolean;
  isMouseInLeftHalf: boolean;
  isMouseInUpperHalf: boolean;
  isOverTopIndicator: boolean;
  isOverBottomIndicator: boolean;
};

type InsertionData = {
  node: ExperienceTreeNode;
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
      (n) => n.data.id === dropReceiverNode.data.id,
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
      (n) => n.data.id === dropReceiverNode.data.id,
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

  const times = (n: number, callback: () => string) => Array.from({ length: n }, callback);
  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return times(letterCount, () => ALNUM[random(0, ALNUM.length - 1)]).join('');
};

export const checkIsAssemblyNode = ({
  componentId,
  usedComponents,
}: {
  componentId: string;
  usedComponents: ExperienceEntry['fields']['usedComponents'];
}) => {
  if (!usedComponents?.length) return false;

  return usedComponents.some((usedComponent) => usedComponent.sys.id === componentId);
};

/** @deprecated use `checkIsAssemblyNode` instead. Will be removed with SDK v5. */
export const checkIsAssembly = checkIsAssemblyNode;

/**
 * This check assumes that the entry is already ensured to be an experience, i.e. the
 * content type of the entry is an experience type with the necessary annotations.
 **/
export const checkIsAssemblyEntry = (entry: Entry): boolean => {
  return Boolean(entry.fields?.componentSettings);
};

export const checkIsAssemblyDefinition = (component?: ComponentDefinition) =>
  component?.category === ASSEMBLY_DEFAULT_CATEGORY;

interface ParsedValue {
  value: number;
  unit: 'px' | 'em' | 'rem';
}

export function parseCSSValue(input: string): ParsedValue | null {
  const regex = /^(\d+(\.\d+)?)(px|em|rem)$/;
  const match = input.match(regex);

  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[3] as 'px' | 'em' | 'rem',
    };
  }

  return null;
}

export function getTargetValueInPixels(targetWidthObject: ParsedValue) {
  switch (targetWidthObject.unit) {
    case 'px':
      return targetWidthObject.value;
    case 'em':
      return targetWidthObject.value * 16;
    case 'rem':
      return targetWidthObject.value * 16;
    default:
      return targetWidthObject.value;
  }
}
