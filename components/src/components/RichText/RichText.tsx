import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document, BLOCKS } from '@contentful/rich-text-types';
import { combineClasses } from '@/utils/combineClasses';

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
  const classes = combineClasses('cf-richtext', className);
  const Tag = as;

  return documentToReactComponents(value, {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => {
        return (
          <Tag className={classes} {...props}>
            {children}
          </Tag>
        );
      },
    },
  });
};
