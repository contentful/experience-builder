import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document, INLINES, BLOCKS } from '@contentful/rich-text-types';
import { combineClasses } from '@/utils/combineClasses';
import './RichText.css';
export interface RichTextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'value'> {
  /**
   * Renders the text in a specific HTML tag.
   * @default p
   * @optional
   * @example
   * ```tsx
   * <RichText as="span" value={document}/>
   * ```
   */
  as?: 'p' | 'span' | 'div' | 'label' | 'caption' | 'small' | 'strong' | 'em';
  /**
   * The document to display
   * @example
   * ```tsx
   * <RichText value={{
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [{ nodeType: 'text', value: 'abc', marks: [], data: {} }],
        },
      ],
    }} />
   * ```
   */
  value: Document;
}

export const RichText: React.FC<RichTextProps> = ({ as = 'p', className, value, ...props }) => {
  const Tag = as;

  return (
    <div
      className={combineClasses('cf-richtext', className)}
      style={{ background: 'red' }}
      {...props}>
      {documentToReactComponents(value, {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (_node, children) => <Tag>{children}</Tag>,
          [INLINES.ASSET_HYPERLINK]: (node, children) => {
            const url = node.data.target.fields.file.url;
            return (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                {INLINES.ASSET_HYPERLINK} {children}
              </a>
            );
          },
          [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
            const url = node.data.target.fields.file.url;
            return (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'green' }}>
                {BLOCKS.EMBEDDED_ASSET} {children}
              </a>
            );
          },
        },
      })}
    </div>
  );
};
