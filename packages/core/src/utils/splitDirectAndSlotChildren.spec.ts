import { ComponentTreeNode, ExperienceTreeNode } from '@/types';
import { splitDirectAndSlotChildren } from './splitDirectAndSlotChildren';
import { createComponentDefinition } from '@/__fixtures__/componentDefinition';

describe('splitDirectAndSlotChildren', () => {
  const createEditorNode = (id: string, slotId?: string): ExperienceTreeNode => ({
    data: { id, slotId } as unknown as ExperienceTreeNode['data'],
    type: 'block',
    children: [],
  });

  const createPreviewNode = (id: string, slotId?: string): ComponentTreeNode => ({
    id,
    slotId,
    children: [],
    definitionId: 'custom',
    variables: {},
  });

  const componentDefinition = createComponentDefinition({
    slots: {
      header: {
        displayName: 'Header',
      },
      footer: {
        displayName: 'Footer',
      },
    },
    children: true,
  });

  describe.each([createEditorNode, createPreviewNode])('when using %p', (createNode) => {
    it('should map nodes to slots and direct children', () => {
      const nodes = [
        createNode('1', 'header'),
        createNode('2', 'footer'),
        createNode('3'),
        createNode('4'),
      ];
      const result = splitDirectAndSlotChildren(nodes, componentDefinition);

      expect(result.slotNodesMap.header).toEqual([nodes[0]]);
      expect(result.slotNodesMap.footer).toEqual([nodes[1]]);
      expect(result.directChildNodes).toEqual([nodes[2], nodes[3]]);
    });

    it('should return undefined for directChildNodes if no children allowed', () => {
      const definition = createComponentDefinition({ slots: {}, children: false });
      const nodes = [createNode('1')];
      const result = splitDirectAndSlotChildren(nodes, definition);

      expect(result.directChildNodes).toBeUndefined();
    });

    it('should return undefined for directChildNodes if no direct children', () => {
      const nodes = [createNode('1', 'header'), createNode('2', 'footer')];
      const result = splitDirectAndSlotChildren(nodes, componentDefinition);

      expect(result.directChildNodes).toBeUndefined();
    });

    it('should set slotNodesMap entry to null if no node for slot', () => {
      const nodes = [createNode('1', 'header')];
      const result = splitDirectAndSlotChildren(nodes, componentDefinition);

      expect(result.slotNodesMap.header).toEqual([nodes[0]]);
      expect(result.slotNodesMap.footer).toBeNull();
    });

    it('should handle empty nodes array', () => {
      const result = splitDirectAndSlotChildren([], componentDefinition);

      expect(result.slotNodesMap.header).toBeNull();
      expect(result.slotNodesMap.footer).toBeNull();
      expect(result.directChildNodes).toBeUndefined();
    });
  });
});
