import { checkIsNodeVisible } from './checkIsNodeVisible';
import { ASSEMBLY_NODE_TYPE } from '@contentful/experiences-core/constants';
import {
  ExperienceTreeNode,
  ValuesByBreakpoint,
  ResolveDesignValueType,
} from '@contentful/experiences-core/types';

describe('checkIsNodeVisible', () => {
  const baseBreakpoint = 'desktop';
  const resolveDesignValue = ((valuesByBreakpoint: ValuesByBreakpoint) =>
    valuesByBreakpoint[baseBreakpoint]) as ResolveDesignValueType;

  const nodeVisible = {
    type: 'block',
    data: {
      props: {
        cfVisibility: { type: 'DesignValue', valuesByBreakpoint: { [baseBreakpoint]: true } },
      },
    },
    children: [],
  } as unknown as ExperienceTreeNode;

  const nodeHidden = {
    type: 'block',
    data: {
      props: {
        cfVisibility: { type: 'DesignValue', valuesByBreakpoint: { [baseBreakpoint]: false } },
      },
    },
    children: [],
  } as unknown as ExperienceTreeNode;

  describe('when node is a block', () => {
    it('returns true if node is visible', () => {
      expect(checkIsNodeVisible(nodeVisible, resolveDesignValue)).toBe(true);
    });

    it('returns false if node is hidden', () => {
      expect(checkIsNodeVisible(nodeHidden, resolveDesignValue)).toBe(false);
    });
  });

  describe('when node is an assembly', () => {
    it('returns true if node has visible children', () => {
      const node = {
        type: ASSEMBLY_NODE_TYPE,
        data: {},
        children: [nodeVisible],
      } as unknown as ExperienceTreeNode;
      expect(checkIsNodeVisible(node, resolveDesignValue)).toBe(true);
    });

    it('returns false if node has no visible children', () => {
      const node = {
        type: ASSEMBLY_NODE_TYPE,
        data: {},
        children: [nodeHidden],
      } as unknown as ExperienceTreeNode;
      expect(checkIsNodeVisible(node, resolveDesignValue)).toBe(false);
    });

    it('returns true if node has children with cfVisibility being undefined', () => {
      const nodeWithUndefinedVisibility = {
        type: 'block',
        data: {
          props: {
            cfVisibility: {
              type: 'DesignValue',
              valuesByBreakpoint: { 'invalid-breakpoint': true },
            },
          },
        },
        children: [],
      } as unknown as ExperienceTreeNode;

      const node = {
        type: ASSEMBLY_NODE_TYPE,
        data: {},
        children: [nodeWithUndefinedVisibility],
      } as unknown as ExperienceTreeNode;
      expect(checkIsNodeVisible(node, resolveDesignValue)).toBe(true);
    });
  });
});
