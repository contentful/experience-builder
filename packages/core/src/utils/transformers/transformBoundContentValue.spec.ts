import { EditorModeEntityStore } from '@/entity';
import { transformBoundContentValue } from './transformBoundContentValue';
import { entities, assets } from '@/test/__fixtures__/entities';
import {
  BoundValue,
  ComponentDefinition,
  ComponentTreeNode,
  OptimizedBackgroundImageAsset,
} from '@/types';
import { vitest, it, describe } from 'vitest';
import { UnresolvedLink } from 'contentful';

const entityStore = new EditorModeEntityStore({
  entities,
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
    image: {
      type: 'Media',
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

      it.only('when the component doesnt have a width variable, it should still transform value to OptimizedBackgroundImageAsset', () => {
        const binding: UnresolvedLink<'Asset'> = {
          sys: { type: 'Link', linkType: 'Asset', id: 'asset1' },
        };
        const resolveDesignValue = vitest.fn((_, variableName) => {
          if (variableName === 'cfBackgroundImageOptions') {
            return {
              quality: '100%',
              format: 'jpg',
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
          variableType as any,
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
  });
});
