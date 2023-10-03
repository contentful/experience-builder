import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Document, BLOCKS } from '@contentful/rich-text-types';
import { Text } from '../Text/Text';
import { combineClasses } from '@/utils/combineClasses';

export interface RichTextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'value'> {
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

export const RichText: React.FC<RichTextProps> = ({ className, value, ...props }) => {
  const classes = combineClasses('cf-richtext', className);

  return documentToReactComponents(value, {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => {
        return (
          <Text className={classes} {...props}>
            {children}
          </Text>
        );
      },
    },
  });
};
