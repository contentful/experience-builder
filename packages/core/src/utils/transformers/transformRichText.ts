import {
  BLOCKS,
  Document as RichTextDocument,
  Block,
  Inline,
  Text,
} from '@contentful/rich-text-types';
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
    // resolve any links to assets/entries/hyperlinks
    // we need to clone, as we want to keep the original Entity in the EntityStore intact,
    // and resolveLinks() is mutating the node object.
    const richTextDocument = structuredClone(value) as RichTextDocument;
    resolveLinks(richTextDocument, entityStore);
    return richTextDocument;
  }
  return undefined;
};

type Node = Block | Inline | Text;

const isLinkTarget = (node: Node): boolean => {
  return node?.data?.target?.sys?.type === 'Link';
};

const resolveLinks = (node: Node, entityStore: EntityStoreBase): void => {
  if (!node) return;

  // Resolve link if current node has one
  if (isLinkTarget(node)) {
    const entity = entityStore.getEntityFromLink(node.data.target);
    if (entity) {
      node.data.target = entity;
    }
  }

  // Process content array if it exists
  if ('content' in node && Array.isArray(node.content)) {
    node.content.forEach((childNode) => resolveLinks(childNode, entityStore));
  }
};
