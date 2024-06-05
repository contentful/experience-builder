import { EditorModeEntityStore } from '@/entity';
import { transformBoundContentValue } from './transformBoundContentValue';
import { entities, assets } from '@/test/__fixtures__/entities';
import { BoundValue, ComponentDefinition, ComponentTreeNode } from '@/types';
import { vitest } from 'vitest';
import { UnresolvedLink } from 'contentful';

const entityStore = new EditorModeEntityStore({
  entities,
  locale: 'en-US',
});

const ComponentDefinition: ComponentDefinition = {
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
      ComponentDefinition.variables.title,
      path,
    );
    expect(result).toEqual(entities[0].fields.title);
  });

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
      ComponentDefinition.variables.image,
      path,
    );
    expect(result).toEqual(assets[0].fields.file?.url);
  });

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
      ComponentDefinition.variables.description,
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
