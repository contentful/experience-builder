import {
  ExperienceTree,
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
