import { describe, it, expect } from 'vitest';
import { CompositionComponentNode } from '@/types';
import { getInsertionData } from '@/utils';

const dropReceiverChildNode: CompositionComponentNode = {
  type: 'block',
  data: {
    id: 'drop-receiver-node-child',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
  },
  children: [],
};

const dropReceiverNode: CompositionComponentNode = {
  type: 'block',
  data: {
    id: 'drop-receiver-node',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
  },
  children: [dropReceiverChildNode],
};

const childFillerNode1: CompositionComponentNode = {
  type: 'block',
  data: {
    id: 'random-child-node-1',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
  },
  children: [],
};

const childFillerNode2: CompositionComponentNode = {
  type: 'block',
  data: {
    id: 'random-child-node-1',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
  },
  children: [],
};

const dropReceiverParentNode: CompositionComponentNode = {
  type: 'root',
  data: {
    id: 'tree-root',
    props: {},
    dataSource: {},
    unboundValues: {},
    breakpoints: [],
  },
  children: [childFillerNode1, dropReceiverNode, childFillerNode2],
};

describe('getInsertionData', () => {
  it('should prepend outside of the drop receiver node if mouse at the top border', () => {
    expect(
      getInsertionData({
        dropReceiverNode,
        dropReceiverParentNode,
        flexDirection: 'row',
        isMouseAtTopBorder: true,
        isMouseAtBottomBorder: false,
        isMouseInLeftHalf: false,
        isMouseInUpperHalf: false,
        isOverTopIndicator: false,
        isOverBottomIndicator: false,
      })
    ).toEqual({
      node: dropReceiverParentNode,
      index: 1, // dropped before the dropReceiverNode within the dropReceiverParentNode
    });
  });

  it('should append outside of the drop receiver node if mouse at the bottom border', () => {
    expect(
      getInsertionData({
        dropReceiverNode,
        dropReceiverParentNode,
        flexDirection: 'row',
        isMouseAtTopBorder: false,
        isMouseAtBottomBorder: true,
        isMouseInLeftHalf: false,
        isMouseInUpperHalf: false,
        isOverTopIndicator: false,
        isOverBottomIndicator: false,
      })
    ).toEqual({
      node: dropReceiverParentNode,
      index: 2, // dropped after the dropReceiverNode within the dropReceiverParentNode
    });
  });

  it('should prepend outside of the drop receiver node if mouse over the top section indicator', () => {
    expect(
      getInsertionData({
        dropReceiverNode,
        dropReceiverParentNode,
        flexDirection: 'row',
        isMouseAtTopBorder: false,
        isMouseAtBottomBorder: false,
        isMouseInLeftHalf: false,
        isMouseInUpperHalf: false,
        isOverTopIndicator: true,
        isOverBottomIndicator: false,
      })
    ).toEqual({
      node: dropReceiverParentNode,
      index: 1, // dropped before the dropReceiverNode within the dropReceiverParentNode
    });
  });

  it('should append outside of the drop receiver node if mouse over the bottom section indicator', () => {
    expect(
      getInsertionData({
        dropReceiverNode,
        dropReceiverParentNode,
        flexDirection: 'row',
        isMouseAtTopBorder: false,
        isMouseAtBottomBorder: false,
        isMouseInLeftHalf: false,
        isMouseInUpperHalf: false,
        isOverTopIndicator: false,
        isOverBottomIndicator: true,
      })
    ).toEqual({
      node: dropReceiverParentNode,
      index: 2, // dropped after the dropReceiverNode within the dropReceiverParentNode
    });
  });

  describe('if flex direction != column', () => {
    it('should prepend inside the drop receiver node if mouse is in the left half', () => {
      expect(
        getInsertionData({
          dropReceiverNode,
          dropReceiverParentNode,
          flexDirection: 'row',
          isMouseAtTopBorder: false,
          isMouseAtBottomBorder: false,
          isMouseInLeftHalf: true,
          isMouseInUpperHalf: false,
          isOverTopIndicator: false,
          isOverBottomIndicator: false,
        })
      ).toEqual({
        node: dropReceiverNode,
        index: 0, // dropped as the new first child within the dropReceiverNode
      });
    });

    it('should append inside the drop receiver node if mouse is not in left half', () => {
      expect(
        getInsertionData({
          dropReceiverNode,
          dropReceiverParentNode,
          flexDirection: 'row',
          isMouseAtTopBorder: false,
          isMouseAtBottomBorder: false,
          isMouseInLeftHalf: false,
          isMouseInUpperHalf: false,
          isOverTopIndicator: false,
          isOverBottomIndicator: false,
        })
      ).toEqual({
        node: dropReceiverNode,
        index: 1, // dropped as the new last child within the dropReceiverNode
      });
    });
  });

  describe('if flex direction = column', () => {
    it('should prepend inside the drop receiver node if mouse is in upper half', () => {
      expect(
        getInsertionData({
          dropReceiverNode,
          dropReceiverParentNode,
          flexDirection: 'column',
          isMouseAtTopBorder: false,
          isMouseAtBottomBorder: false,
          isMouseInLeftHalf: false,
          isMouseInUpperHalf: true,
          isOverTopIndicator: false,
          isOverBottomIndicator: false,
        })
      ).toEqual({
        node: dropReceiverNode,
        index: 0, // dropped as the new first child within the dropReceiverNode
      });
    });

    it('should append inside the drop receiver node if mouse is not in upper half', () => {
      expect(
        getInsertionData({
          dropReceiverNode,
          dropReceiverParentNode,
          flexDirection: 'column',
          isMouseAtTopBorder: false,
          isMouseAtBottomBorder: false,
          isMouseInLeftHalf: false,
          isMouseInUpperHalf: false,
          isOverTopIndicator: false,
          isOverBottomIndicator: false,
        })
      ).toEqual({
        node: dropReceiverNode,
        index: 1, // dropped as the new last child within the dropReceiverNode
      });
    });
  });
});
