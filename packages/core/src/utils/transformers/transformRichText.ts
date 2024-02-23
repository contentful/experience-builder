import { BLOCKS, Document as RichTextDocument } from '@contentful/rich-text-types';
import { getBoundValue } from './getBoundValue';
import { EntityStoreBase } from '@/entity';
import { UnresolvedLink } from 'contentful';

export const transformRichText = (
  entityStore: EntityStoreBase,
  binding: UnresolvedLink<'Entry' | 'Asset'>,
  path: string[],
): RichTextDocument | undefined => {
  const value = getBoundValue(entityStore, binding, path);
  if (typeof value === 'string') {
    return {
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              data: {},
              nodeType: 'text',
              value: value,
              marks: [],
            },
          ],
        },
      ],
      nodeType: BLOCKS.DOCUMENT,
    };
  }
  if (typeof value === 'object' && value.nodeType === BLOCKS.DOCUMENT) {
    return value as RichTextDocument;
  }
  return undefined;
};
