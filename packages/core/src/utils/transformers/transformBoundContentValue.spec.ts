import { EditorModeEntityStore } from '@/entity/EditorModeEntityStore';
import { transformBoundContentValue } from './transformBoundContentValue';
import {
  entities,
  assets,
  entries,
  entityIds,
  entryWithEmbeddedAssetInRichText,
  entryWithEmbeddedEntryInRichText,
  entryWithEmbeddedEntry,
  entryWithAnotherEmbeddedEntry,
  entryWithEmbeddedEntries,
  entryWithDeeplyEmbeddedEntitiesInRichText,
} from '@/test/__fixtures__/entities';
import {
  BoundValue,
  ComponentDefinition,
  ComponentTreeNode,
  OptimizedBackgroundImageAsset,
} from '@/types';
import { vitest, it, describe } from 'vitest';
import { UnresolvedLink } from 'contentful';

const entityStore = new EditorModeEntityStore({
  entities: [
    ...entities,
    entryWithEmbeddedEntry,
    entryWithEmbeddedEntries,
    entryWithAnotherEmbeddedEntry,
    entryWithEmbeddedEntryInRichText,
    entryWithEmbeddedAssetInRichText,
    entryWithDeeplyEmbeddedEntitiesInRichText,
    ...assets,
  ],
  locale: 'en-US',
});

const componentDefinition: ComponentDefinition = {
  id: 'custom-component',
  name: 'Custom Component',
  variables: {
    title: {
      type: 'Text',
    },
    description: {
      type: 'RichText',
    },
    referencedEntry: {
      type: 'Link',
    },
    image: {
      type: 'Media',
    },
    referencedEntries: {
      type: 'Array',
    },
  },
};

const variables: ComponentTreeNode['variables'] = {
  title: {
    type: 'BoundValue',
    path: '/uuid1/fields/title/~locale',
  },
  description: {
    type: 'BoundValue',
    path: '/uuid1/fields/title/~locale',
  },
  image: {
    type: 'BoundValue',
    path: '/uuid2/fields/file/~locale',
  },
  body: {
    type: 'BoundValue',
    path: '/uuid3/fields/body/~locale',
  },
  referencedEntry: {
    type: 'BoundValue',
    path: '/uuid4/fields/referencedEntry/~locale',
  },
  referencedEntries: {
    type: 'BoundValue',
    path: '/uuid5/fields/referencedEntries/~locale',
  },
};

describe('transformBoundContentValue', () => {
  describe('when variable type is a bound value', () => {
    it('should transform bound content value', () => {
      const binding: UnresolvedLink<'Entry'> = {
        sys: { type: 'Link', linkType: 'Entry', id: 'entry1' },
      };
      const resolveDesignValue = vitest.fn();
      const variableName = 'title';

      const path = (variables.title as BoundValue).path;
      const result = transformBoundContentValue(
        variables,
        entityStore,
        binding,
        resolveDesignValue,
        variableName,
        componentDefinition.variables.title,
        path,
      );
      expect(result).toEqual(entities[0].fields.title);
    });
  });

  describe('when variable type is "Media"', () => {
    const variableType = componentDefinition.variables.image;

    describe('when the variable is a cfBackgroundImageOptions', () => {
      const variablesWithImageOptions = {
        ...variables,
      };
      it('should transform value to OptimizedBackgroundImageAsset', () => {
        const binding: UnresolvedLink<'Asset'> = {
          sys: { type: 'Link', linkType: 'Asset', id: 'asset1' },
        };
        const resolveDesignValue = vitest.fn((_, variableName) => {
          if (variableName === 'cfBackgroundImageOptions') {
            return {
              quality: '100%',
              format: 'jpg',
              targetSize: '1060px',
            };
          }
          if (variableName === 'cfWidth') {
            return '1024px';
          }
        });
        const variableName = 'cfBackgroundImageUrl';

        const path = (variables.image as BoundValue).path;
        const result = transformBoundContentValue(
          variablesWithImageOptions,
          entityStore,
          binding,
          resolveDesignValue,
          variableName,
          variableType,
          path,
        ) as OptimizedBackgroundImageAsset;
        expect(result.url).toEqual(assets[0].fields.file?.url + '?w=1024&fm=jpg');
      });

      it('should transform value to OptimizedBackgroundImageAsset to targetValue when targetValue is lower than asset width', () => {
        const binding: UnresolvedLink<'Asset'> = {
          sys: { type: 'Link', linkType: 'Asset', id: 'asset1' },
        };
        const resolveDesignValue = vitest.fn((_, variableName) => {
          if (variableName === 'cfBackgroundImageOptions') {
            return {
              quality: '100%',
              format: 'jpg',
              targetSize: '300px',
            };
          }
          if (variableName === 'cfWidth') {
            return '1024px';
          }
        });
        const variableName = 'cfBackgroundImageUrl';

        const path = (variables.image as BoundValue).path;
        const result = transformBoundContentValue(
          variablesWithImageOptions,
          entityStore,
          binding,
          resolveDesignValue,
          variableName,
          variableType,
          path,
        ) as OptimizedBackgroundImageAsset;
        expect(result.url).toEqual(assets[0].fields.file?.url + '?w=600&fm=jpg');
      });

      it('when the component doesnt have a width variable, it should still transform value to OptimizedBackgroundImageAsset', () => {
        const binding: UnresolvedLink<'Asset'> = {
          sys: { type: 'Link', linkType: 'Asset', id: 'asset1' },
        };
        const resolveDesignValue = vitest.fn((_, variableName) => {
          if (variableName === 'cfBackgroundImageOptions') {
            return {
              quality: '100%',
              format: 'jpg',
              targetSize: '1060px',
            };
          }
          if (variableName === 'cfWidth') {
            return undefined; // cfWidth is not defined
          }
        });
        const variableName = 'cfBackgroundImageUrl';

        const path = (variables.image as BoundValue).path;
        const result = transformBoundContentValue(
          variablesWithImageOptions,
          entityStore,
          binding,
          resolveDesignValue,
          variableName,
          variableType,
          path,
        ) as OptimizedBackgroundImageAsset;
        expect(result.url).toEqual(assets[0].fields.file?.url + '?w=1024&fm=jpg');
      });
    });

    describe('when the variable is not a cfImageAsset', () => {
      it('should transform value if variable type is "Media"', () => {
        const binding: UnresolvedLink<'Asset'> = {
          sys: { type: 'Link', linkType: 'Asset', id: 'asset1' },
        };
        const resolveDesignValue = vitest.fn();
        const variableName = 'image';

        const path = (variables.image as BoundValue).path;
        const result = transformBoundContentValue(
          variables,
          entityStore,
          binding,
          resolveDesignValue,
          variableName,
          variableType,
          path,
        );
        expect(result).toEqual(assets[0].fields.file?.url);
      });
    });
  });

  describe('when variable type is "RichText"', () => {
    it('should transform text to rich text if variable type is "RichText"', () => {
      const variableName = 'description';
      const resolveDesignValue = vitest.fn();
      const binding: UnresolvedLink<'Entry'> = {
        sys: { type: 'Link', linkType: 'Entry', id: 'entry1' },
      };

      const path = (variables.description as BoundValue).path;
      const result = transformBoundContentValue(
        variables,
        entityStore,
        binding,
        resolveDesignValue,
        variableName,
        componentDefinition.variables.description,
        path,
      );
      expect(result).toEqual({
        content: [
          {
            content: [
              {
                data: {},
                marks: [],
                nodeType: 'text',
                value: 'Entry 1',
              },
            ],
            data: {},
            nodeType: 'paragraph',
          },
        ],
        data: {},
        nodeType: 'document',
      });
    });

    it('when rich text has a deeply embedded entry in the document node tree, it should transform the rich text and resolve the entry', () => {
      const variableName = 'richText';
      const resolveDesignValue = vitest.fn();
      const binding: UnresolvedLink<'Entry'> = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: entityIds.ENTRY_WITH_DEEPLY_EMBEDDED_ENTITIES_IN_RICH_TEXT,
        },
      };

      const path = (variables.body as BoundValue).path;
      const result = transformBoundContentValue(
        variables,
        entityStore,
        binding,
        resolveDesignValue,
        variableName,
        componentDefinition.variables.description,
        path,
      );
      expect(result).toEqual({
        content: [
          {
            nodeType: 'unordered-list',
            data: {},
            content: [
              {
                nodeType: 'list-item',
                data: {},
                content: [
                  {
                    nodeType: 'embedded-asset-block',
                    data: {
                      target: assets.find((asset) => asset.sys.id === entityIds.ASSET1)!,
                    },
                    content: [],
                  },
                ],
              },
              {
                nodeType: 'list-item',
                data: {},
                content: [
                  {
                    nodeType: 'embedded-entry-block',
                    data: {
                      target: entries.find((entry) => entry.sys.id === entityIds.ENTRY1)!,
                    },
                    content: [],
                  },
                ],
              },
              {
                nodeType: 'list-item',
                data: {},
                content: [
                  {
                    nodeType: 'asset-hyperlink',
                    data: {
                      target: assets.find((entry) => entry.sys.id === entityIds.ASSET1)!,
                    },
                    content: [],
                  },
                ],
              },
              {
                nodeType: 'list-item',
                data: {},
                content: [
                  {
                    nodeType: 'entry-hyperlink',
                    data: {
                      target: entries.find((entry) => entry.sys.id === entityIds.ENTRY2)!,
                    },
                    content: [],
                  },
                ],
              },
            ],
          },
        ],
        data: {},
        nodeType: 'document',
      });
    });

    it('when rich text has an embedded entry, it should transform the rich text and resolve the entry', () => {
      const variableName = 'richText';
      const resolveDesignValue = vitest.fn();
      const binding: UnresolvedLink<'Entry'> = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: entityIds.ENTRY_WITH_EMBEDDED_ENTRY_IN_RICH_TEXT,
        },
      };

      const path = (variables.body as BoundValue).path;
      const result = transformBoundContentValue(
        variables,
        entityStore,
        binding,
        resolveDesignValue,
        variableName,
        componentDefinition.variables.description,
        path,
      );
      expect(result).toEqual({
        content: [
          {
            content: [],
            data: {
              target: entries.find((entry) => entry.sys.id === entityIds.ENTRY1)!,
            },
            nodeType: 'embedded-entry-block',
          },
        ],
        data: {},
        nodeType: 'document',
      });
    });

    it('when rich text has an embedded asset, it should transform the rich text and resolve the asset', () => {
      const variableName = 'richText';
      const resolveDesignValue = vitest.fn();
      const binding: UnresolvedLink<'Entry'> = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: entityIds.ENTRY_WITH_EMBEDDED_ASSET_IN_RICH_TEXT,
        },
      };

      const path = (variables.body as BoundValue).path;
      const result = transformBoundContentValue(
        variables,
        entityStore,
        binding,
        resolveDesignValue,
        variableName,
        componentDefinition.variables.description,
        path,
      );
      expect(result).toEqual({
        content: [
          {
            content: [],
            data: {
              target: assets.find((entry) => entry.sys.id === entityIds.ASSET1)!,
            },
            nodeType: 'embedded-asset-block',
          },
        ],
        data: {},
        nodeType: 'document',
      });
    });
  });

  describe('when the variable type is a "Link"', () => {
    it('it should resolve an entry that has a reference to another entry', () => {
      const variableName = 'referencedEntry';
      const resolveDesignValue = vitest.fn();
      const binding: UnresolvedLink<'Entry'> = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: entityIds.ENTRY_WITH_EMBEDDED_ENTRY,
        },
      };

      const path = (variables.referencedEntry as BoundValue).path;
      const result = transformBoundContentValue(
        variables,
        entityStore,
        binding,
        resolveDesignValue,
        variableName,
        componentDefinition.variables.referencedEntry,
        path,
      );
      // @ts-expect-error -- deep referenced entry doesn't type well
      expect(result?.fields.referencedEntry.fields.title).toEqual('Entry 2');
    });
  });

  describe('when the variable type is an "Array"', () => {
    it('referenced entries in the array should have their references resolved', () => {
      const variableName = 'referencedEntries';
      const resolveDesignValue = vitest.fn();
      const binding: UnresolvedLink<'Entry'> = {
        sys: {
          type: 'Link',
          linkType: 'Entry',
          id: entityIds.ENTRY_WITH_EMBEDDED_ENTRIES,
        },
      };

      const path = (variables.referencedEntries as BoundValue).path;
      const result = transformBoundContentValue(
        variables,
        entityStore,
        binding,
        resolveDesignValue,
        variableName,
        componentDefinition.variables.referencedEntries,
        path,
      );
      // @ts-expect-error -- deep referenced entry doesn't type well
      expect(result[0]?.fields.referencedEntry.fields.referencedEntry.fields.title).toEqual(
        'Entry 2',
      );
      // @ts-expect-error -- deep referenced entry doesn't type well
      expect(result[1]?.fields.referencedEntry.fields.title).toEqual('Entry 2');
    });
  });
});
