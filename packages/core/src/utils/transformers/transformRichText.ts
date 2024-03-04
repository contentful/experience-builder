import { BLOCKS, Document as RichTextDocument } from '@contentful/rich-text-types';
import { getBoundValue } from './getBoundValue';
// import { EntityStoreBase } from '@/entity';
import { Asset, Entry } from 'contentful';

export const transformRichText = (
  entryOrAsset: Entry | Asset,
  // entityStore: EntityStoreBase,
  // binding: UnresolvedLink<'Entry' | 'Asset'>,
  path,
): RichTextDocument | undefined => {
  const value = getBoundValue(entryOrAsset, path);
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
