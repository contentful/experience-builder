import type { Entry } from 'contentful';
import { experienceEntry } from '../../../test/__fixtures__/experience';
import { createAssemblyEntry } from '../../../test/__fixtures__/assembly';
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

    const result = resolveAssembly({ node: containerNode, entityStore });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the entity store is undefined', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    const entityStore = {} as unknown as EntityStore;

    const result = resolveAssembly({ node: containerNode, entityStore });

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

    const result = resolveAssembly({ node: assemblyNode, entityStore });

    expect(result).toBe(assemblyNode);
  });
  it('should return a assembly node with children', () => {
    const assemblyNode: ComponentTreeNode = {
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
        ...experienceEntry,
        fields: {
          ...experienceEntry.fields,
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
      ...experienceEntry.fields.unboundValues,
      ...assemblyEntry.fields.unboundValues,
    });
  });
});
