import type { Entry } from 'contentful';
import { compositionEntry } from '../../../test/__fixtures__/composition';
import { createPatternEntry } from '../../../test/__fixtures__/pattern';
import { assets, entries } from '../../../test/__fixtures__/entities';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import type { ComponentTreeNode } from '@contentful/experiences-core/types';
import { EntityStore } from '@contentful/experiences-core';
import { resolvePattern } from './patternUtils';

describe('resolvePattern', () => {
  it('should return the input node when it is not a pattern', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };
    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolvePattern({ node: containerNode, entityStore });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the entity store is undefined', () => {
    const containerNode: ComponentTreeNode = {
      definitionId: CONTENTFUL_COMPONENTS.container.id,
      variables: {},
      children: [],
    };

    const entityStore = {} as unknown as EntityStore;

    const result = resolvePattern({ node: containerNode, entityStore });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the corresponding component is not found in the entity store', () => {
    const patternNode: ComponentTreeNode = {
      definitionId: 'pattern-id',
      variables: {},
      children: [],
    };

    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolvePattern({ node: patternNode, entityStore });

    expect(result).toBe(patternNode);
  });
  it('should return a pattern node with children', () => {
    const patternNode: ComponentTreeNode = {
      definitionId: 'pattern-id',
      variables: {},
      children: [],
    };

    const patternEntry = createPatternEntry({
      id: 'pattern-id',
      schemaVersion: '2023-09-28',
    });

    const entityStore = new EntityStore({
      experienceEntry: {
        ...compositionEntry,
        fields: {
          ...compositionEntry.fields,
          usedComponents: [patternEntry],
        },
      } as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolvePattern({ node: patternNode, entityStore });

    expect(result).toEqual({
      ...patternNode,
      children: patternEntry.fields.componentTree.children,
    });
    expect(entityStore.unboundValues).toEqual({
      ...compositionEntry.fields.unboundValues,
      ...patternEntry.fields.unboundValues,
    });
  });
});
