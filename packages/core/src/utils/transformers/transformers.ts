import { BLOCKS, Document as RichTextDocument } from '@contentful/rich-text-types';
import { ComponentDefinitionVariable, CompositionVariableValueType, Link } from '@/types';

export const transformContentValue = (
  value: CompositionVariableValueType | Link<'Asset'>,
  variableDefinition: ComponentDefinitionVariable,
) => {
  if (variableDefinition.type === 'RichText') {
    return transformRichText(value);
  }
  return value;
};

export const transformRichText = (
  value: CompositionVariableValueType,
): RichTextDocument | undefined => {
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
