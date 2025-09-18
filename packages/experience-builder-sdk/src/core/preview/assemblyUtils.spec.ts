import type { Entry } from 'contentful';
import { experienceEntry } from '../../../test/__fixtures__';
import {
  assemblyGeneratedDesignVariableName,
  createAssemblyEntry,
} from '../../../test/__fixtures__';
import { assets, entries } from '../../../test/__fixtures__';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import type { ComponentTreeNode } from '@contentful/experiences-core/types';
import { EntityStore } from '@contentful/experiences-core';
import { resolvePattern } from './assemblyUtils';

describe('resolvePattern', () => {
  it('should return the input node when the entity store is undefined', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    const entityStore = {} as unknown as EntityStore;

    const result = resolvePattern({
      node: containerNode,
      rootPatternParameters: {},
      parentPatternRootNodeIdsChain: [],
      entityStore,
    });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the corresponding component is not found in the entity store', () => {
    const assemblyNode: ComponentTreeNode = {
      definitionId: 'assembly-id',
      variables: {},
      children: [],
    };

    const entityStore = new EntityStore({
      experienceEntry: experienceEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolvePattern({
      node: assemblyNode,
      rootPatternParameters: {},
      parentPatternRootNodeIdsChain: [],
      entityStore,
    });

    expect(result).toBe(assemblyNode);
  });

  describe('when the assembly exists in the entity store', () => {
    const assemblyEntry = createAssemblyEntry({
      id: 'assembly-id',
      schemaVersion: '2023-09-28',
    });

    const entityStore = new EntityStore({
      experienceEntry: {
        ...experienceEntry,
        fields: {
          ...experienceEntry.fields,
          usedComponents: [assemblyEntry],
        },
      } as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    it('should return a assembly node with children', () => {
      const assemblyNode: ComponentTreeNode = {
        definitionId: 'assembly-id',
        variables: {},
        children: [],
      };

      const result = resolvePattern({
        node: assemblyNode,
        rootPatternParameters: {},
        parentPatternRootNodeIdsChain: [],
        entityStore,
      });

      expect(result.children).toHaveLength(1);
      expect(result.children[0].children).toHaveLength(1);
      // This will be exactly like in the definition as the instance doesn't define a value for the ComponentValue
      expect(result.children[0].children[0]).toEqual({
        ...assemblyEntry.fields.componentTree.children[0].children[0],
        displayName: undefined,
        parameters: undefined,
        pattern: {
          nodeIdOnPattern: 'test-custom-component-id',
          parentPatternNodeId: undefined,
          prefixedNodeId: 'test-custom-component-id',
        },
        slotId: undefined,
      });
      expect(entityStore.unboundValues).toEqual({
        ...experienceEntry.fields.unboundValues,
        ...assemblyEntry.fields.unboundValues,
      });
    });

    it('should return an assembly node with parent parameters', () => {
      const parameterId = 'parameterId';
      const parameterId2 = 'parameterId2';
      const assemblyEntry = createAssemblyEntry({
        id: 'assembly-id',
        schemaVersion: '2023-09-28',
      });

      const assemblyNode: ComponentTreeNode = {
        definitionId: 'assembly-id',
        id: 'pattern-node-id',
        variables: {},
        children: [],
        parameters: {},
      };

      assemblyEntry.fields.componentSettings!.prebindingDefinitions = [
        {
          id: 'prebindingDefinition1',
          parameterDefinitions: {
            [parameterId2]: {
              contentTypes: [assemblyEntry.sys.contentType.sys.id],
              defaultSource: {
                type: 'Entry',
                contentTypeId: assemblyEntry.sys.contentType.sys.id,
                link: {
                  sys: {
                    type: 'Link',
                    linkType: 'Entry',
                    id: 'default-prebinding-entry-id',
                  },
                },
              },
              passToNodes: [
                {
                  nodeId: assemblyNode.id!,
                  parameterId: parameterId,
                  prebindingId: 'prebindingDefinition1',
                },
              ],
            },
          },
          variableMappings: {
            testVariable: {
              parameterId: parameterId2,
              type: 'ContentTypeMapping',
              pathsByContentType: {
                [assemblyEntry.sys.contentType.sys.id]: {
                  path: '/fields/title',
                },
              },
            },
          },
        },
      ];

      const entityStore = new EntityStore({
        experienceEntry: {
          ...experienceEntry,
          fields: {
            ...experienceEntry.fields,
            usedComponents: [assemblyEntry],
          },
        } as unknown as Entry,
        entities: [...entries, ...assets],
        locale: 'en-US',
      });

      const result = resolvePattern({
        node: assemblyNode,
        entityStore,
        parentPatternRootNodeIdsChain: ['pattern-node-id'],
        rootPatternParameters: {
          [parameterId2]: {
            path: '/4091203i9',
            type: 'BoundValue',
          },
        },
      });

      expect(result.parameters).toEqual({
        [parameterId2]: {
          path: '/4091203i9',
          type: 'BoundValue',
        },
      });
    });

    it('resolves a style component value by merging the instance value with the default one', () => {
      const assemblyNode: ComponentTreeNode = {
        definitionId: 'assembly-id',
        variables: {
          [assemblyGeneratedDesignVariableName]: {
            type: 'DesignValue',
            valuesByBreakpoint: { desktop: '99px', tablet: '11px' },
          },
        },
        children: [],
      };

      const result = resolvePattern({
        node: assemblyNode,
        entityStore,
        rootPatternParameters: {},
        parentPatternRootNodeIdsChain: [],
      });

      expect(result.children[0].variables.cfWidth).toEqual({
        type: 'DesignValue',
        valuesByBreakpoint: { desktop: '99px', tablet: '11px', mobile: '24px' },
      });
    });

    it('falls back to the defaultValue when a style component value is not defined on the instance', () => {
      const assemblyNode: ComponentTreeNode = {
        definitionId: 'assembly-id',
        variables: {},
        children: [],
      };

      const result = resolvePattern({
        node: assemblyNode,
        entityStore,
        rootPatternParameters: {},
        parentPatternRootNodeIdsChain: [],
      });

      expect(result.children[0].variables.cfWidth).toEqual({
        type: 'DesignValue',
        valuesByBreakpoint: { desktop: '42px', mobile: '24px' },
      });
    });
  });
});
