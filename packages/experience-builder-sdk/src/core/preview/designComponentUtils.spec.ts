import type { Entry } from 'contentful';
import { compositionEntry } from '../../../test/__fixtures__/composition';
import { createDesignComponentEntry } from '../../../test/__fixtures__/designComponent';
import { assets, entries } from '../../../test/__fixtures__/entities';
import { CONTENTFUL_CONTAINER_ID } from '@contentful/experience-builder-core/constants';
import type { CompositionNode } from '@contentful/experience-builder-core/types';
import { EntityStore } from '@contentful/experience-builder-core';
import { resolveDesignComponent } from './designComponentUtils';

describe('resolveDesignComponent', () => {
  it('should return the input node when it is not a design component', () => {
    const containerNode: CompositionNode = {
      definitionId: CONTENTFUL_CONTAINER_ID,
      variables: {},
      children: [],
    };
    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolveDesignComponent({ node: containerNode, entityStore });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the entity store is undefined', () => {
    const containerNode: CompositionNode = {
      definitionId: CONTENTFUL_CONTAINER_ID,
      variables: {},
      children: [],
    };

    const entityStore = undefined;

    const result = resolveDesignComponent({ node: containerNode, entityStore });

    expect(result).toBe(containerNode);
  });

  it('should return the input node when the corresponding component is not found in the entity store', () => {
    const designComponentNode: CompositionNode = {
      definitionId: 'design-component-id',
      variables: {},
      children: [],
    };

    const entityStore = new EntityStore({
      experienceEntry: compositionEntry as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolveDesignComponent({ node: designComponentNode, entityStore });

    expect(result).toBe(designComponentNode);
  });
  it('should return a design component node with children', () => {
    const designComponentNode: CompositionNode = {
      definitionId: 'design-component-id',
      variables: {},
      children: [],
    };

    const designComponentEntry = createDesignComponentEntry({
      id: 'design-component-id',
      schemaVersion: '2023-09-28',
    });

    const entityStore = new EntityStore({
      experienceEntry: {
        ...compositionEntry,
        fields: {
          ...compositionEntry.fields,
          usedComponents: [designComponentEntry],
        },
      } as unknown as Entry,
      entities: [...entries, ...assets],
      locale: 'en-US',
    });

    const result = resolveDesignComponent({ node: designComponentNode, entityStore });

    expect(result).toEqual({
      ...designComponentNode,
      children: designComponentEntry.fields.componentTree.children,
    });
    expect(entityStore.unboundValues).toEqual({
      ...compositionEntry.fields.unboundValues,
      ...designComponentEntry.fields.unboundValues,
    });
  });
});
