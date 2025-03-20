import type { Entry } from 'contentful';
import { experienceEntry } from '../../../test/__fixtures__/composition';
import {
  assemblyGeneratedDesignVariableName,
  createAssemblyEntry,
} from '../../../test/__fixtures__/assembly';
import { assets, entries } from '../../../test/__fixtures__/entities';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import type { ComponentTreeNode } from '@contentful/experiences-core/types';
import { EntityStore } from '@contentful/experiences-core';
import { resolveAssembly } from './assemblyUtils';

describe('resolveAssembly', () => {
  it('should return the input node when it is not a assembly', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };
    const entityStore = new EntityStore({
      experienceEntry: experienceEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolveAssembly({
      node: containerNode,
      entityStore,
      parentPatternProperties: {},
    });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the entity store is undefined', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    const entityStore = {} as unknown as EntityStore;

    const result = resolveAssembly({
      node: containerNode,
      entityStore,
      parentPatternProperties: {},
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

    const result = resolveAssembly({
      node: assemblyNode,
      entityStore,
      parentPatternProperties: {},
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

      const result = resolveAssembly({
        node: assemblyNode,
        entityStore,
        parentPatternProperties: {},
      });

      expect(result.children).toHaveLength(1);
      expect(result.children[0].children).toHaveLength(1);
      // This will be exactly like in the definition as the instance doesn't define a value for the ComponentValue
      expect(result.children[0].children[0]).toEqual(
        assemblyEntry.fields.componentTree.children[0].children[0],
      );
      expect(entityStore.unboundValues).toEqual({
        ...experienceEntry.fields.unboundValues,
        ...assemblyEntry.fields.unboundValues,
      });
    });

    it('resolves a style component value with the value of the assembly instance', () => {
      const assemblyNode: ComponentTreeNode = {
        definitionId: 'assembly-id',
        variables: {
          [assemblyGeneratedDesignVariableName]: {
            type: 'DesignValue',
            valuesByBreakpoint: { desktop: '99px' },
          },
        },
        children: [],
      };

      const result = resolveAssembly({
        node: assemblyNode,
        entityStore,
        parentPatternProperties: {},
      });

      expect(result.children[0].variables.cfWidth).toEqual({
        type: 'DesignValue',
        valuesByBreakpoint: { desktop: '99px' },
      });
    });

    it('falls back to the defaultValue when a style component value is not defined on the instance', () => {
      const assemblyNode: ComponentTreeNode = {
        definitionId: 'assembly-id',
        variables: {},
        children: [],
      };

      const result = resolveAssembly({
        node: assemblyNode,
        entityStore,
        parentPatternProperties: {},
      });

      expect(result.children[0].variables.cfWidth).toEqual({
        type: 'DesignValue',
        valuesByBreakpoint: { desktop: '42px' },
      });
    });
  });
});
