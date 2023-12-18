import { entities, entityIds } from '../test/__fixtures__/entities';
import { EditorModeEntityStore } from './EditorModeEntityStore';
import { describe, it, expect } from 'vitest';

describe('ExperienceBuilderEditorEntityStore', () => {
  const locale = 'en-US';

  it('should be defined', () => {
    expect(EditorModeEntityStore).toBeDefined();
  });

  it('should create a new instance', () => {
    const store = new EditorModeEntityStore({ entities: [], locale });
    expect(store).toBeDefined();
  });

  it('should create a new instance with initial state', () => {
    const store = new EditorModeEntityStore({ entities, locale });
    expect(store.entities).toEqual(entities);
  });

  describe('getValue', () => {
    it('should return the value based on entityId and path', () => {
      const store = new EditorModeEntityStore({ entities, locale });

      expect(
        store.getValue({ sys: { id: entityIds.ENTRY1, linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toEqual('Entry 1');
      expect(
        store.getValue({ sys: { id: entityIds.ASSET1, linkType: 'Asset', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toEqual('Asset 1');
    });

    it('should return undefined if entity id does not exist', () => {
      const store = new EditorModeEntityStore({ entities, locale });
      expect(store).toBeDefined();

      expect(
        store.getValue({ sys: { id: 'test', linkType: 'Entry', type: 'Link' } }, [
          'fields',
          'title',
        ])
      ).toBeUndefined();
    });

    it('should return the url if entityType=Asset and field=file', () => {
      const store = new EditorModeEntityStore({ entities, locale });
      expect(store).toBeDefined();

      expect(
        store.getValue({ sys: { id: entityIds.ASSET1, linkType: 'Asset', type: 'Link' } }, [
          'fields',
          'file',
        ])
      ).toEqual('https://test.com/test.jpg');
    });
  });
});
