import { BLOCKS, Document as RichTextDocument } from '@contentful/rich-text-types';
import { getBoundValue } from './getBoundValue';
import { Asset, Entry } from 'contentful';
import { EntityStoreBase } from '@/entity';

export const transformRichText = (
  entryOrAsset: Entry | Asset,
  entityStore: EntityStoreBase,
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
    //resolve any embedded links
    const richTextDocument = value as RichTextDocument;
    richTextDocument.content.forEach((node) => {
      if (
        (node.nodeType === BLOCKS.EMBEDDED_ENTRY || node.nodeType === BLOCKS.EMBEDDED_ASSET) &&
        node.data.target.sys.type === 'Link'
      ) {
        const entity = entityStore.getEntityFromLink(node.data.target);
        if (entity) {
          node.data.target = entity;
        }
      }
    });
    return value as RichTextDocument;
  }
  return undefined;
};
