import type { Entry } from 'contentful';
import { compositionEntry } from '../../../test/__fixtures__/composition';
import { createAssemblyEntry } from '../../../test/__fixtures__/assembly';
import { assets, entries } from '../../../test/__fixtures__/entities';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import type { CompositionNode } from '@contentful/experiences-core/types';
import { EntityStore } from '@contentful/experiences-core';
import { resolveAssembly } from './assemblyUtils';

describe('resolveAssembly', () => {
  it('should return the input node when it is not a assembly', () => {
    const containerNode: CompositionNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };
    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolveAssembly({ node: containerNode, entityStore });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the entity store is undefined', () => {
    const containerNode: CompositionNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    const entityStore = {} as unknown as EntityStore;

    const result = resolveAssembly({ node: containerNode, entityStore });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the corresponding component is not found in the entity store', () => {
    const assemblyNode: CompositionNode = {
      definitionId: 'assembly-id',
      variables: {},
      children: [],
    };

    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolveAssembly({ node: assemblyNode, entityStore });

    expect(result).toBe(assemblyNode);
  });
  it('should return a assembly node with children', () => {
    const assemblyNode: CompositionNode = {
      definitionId: 'assembly-id',
      variables: {},
      children: [],
    };

    const assemblyEntry = createAssemblyEntry({
      id: 'assembly-id',
      schemaVersion: '2023-09-28',
    });

    const entityStore = new EntityStore({
      experienceEntry: {
        ...compositionEntry,
        fields: {
          ...compositionEntry.fields,
          usedComponents: [assemblyEntry],
        },
      } as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolveAssembly({ node: assemblyNode, entityStore });

    expect(result).toEqual({
      ...assemblyNode,
      children: assemblyEntry.fields.componentTree.children,
    });
    expect(entityStore.unboundValues).toEqual({
      ...compositionEntry.fields.unboundValues,
      ...assemblyEntry.fields.unboundValues,
    });
  });
});
