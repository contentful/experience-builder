import { ComponentDefinitionVariable, ContainerStyleVariableName } from '@/types';

export const builtInStyles: Partial<
  Record<ContainerStyleVariableName, ComponentDefinitionVariable<'Text' | 'Boolean'>>
> = {
  cfVerticalAlignment: {
    validations: {
      in: [
        {
          value: 'start',
          displayName: 'Align left',
        },
        {
          value: 'center',
          displayName: 'Align center',
        },
        {
          value: 'end',
          displayName: 'Align right',
        },
      ],
    },
    type: 'Text',
    group: 'style',
    description: 'The horizontal alignment of the section',
    defaultValue: 'center',
    displayName: 'Vertical alignment',
  },
  cfHorizontalAlignment: {
    validations: {
      in: [
        {
          value: 'start',
          displayName: 'Align top',
        },
        {
          value: 'center',
          displayName: 'Align center',
        },
        {
          value: 'end',
          displayName: 'Align bottom',
        },
      ],
    },
    type: 'Text',
    group: 'style',
    description: 'The horizontal alignment of the section',
    defaultValue: 'center',
    displayName: 'Horizontal alignment',
  },
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    description: 'The margin of the section',
    defaultValue: '0 0 0 0',
  },
  cfPadding: {
    displayName: 'Padding',
    type: 'Text',
    group: 'style',
    description: 'The padding of the section',
    defaultValue: '0 0 0 0',
  },
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
    description: 'The background color of the section',
    defaultValue: 'rgba(255, 255, 255, 0)',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    description: 'The width of the section',
    defaultValue: 'fill',
  },
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    description: 'The height of the section',
    defaultValue: 'fit-content',
  },
  cfMaxWidth: {
    displayName: 'Max width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the section',
    defaultValue: 'none',
  },
  cfFlexDirection: {
    displayName: 'Direction',
    type: 'Text',
    group: 'style',
    description: 'The orientation of the section',
    defaultValue: 'column',
  },
  cfFlexWrap: {
    displayName: 'Wrap objects',
    type: 'Text',
    group: 'style',
    description: 'Wrap objects',
    defaultValue: 'nowrap',
  },
  cfBorder: {
    displayName: 'Border',
    type: 'Text',
    group: 'style',
    description: 'The border of the section',
    defaultValue: '1px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
    description: 'The spacing between the elements of the section',
    defaultValue: '0px',
  },
  cfBackgroundImageUrl: {
    displayName: 'Background image',
    type: 'Text',
    defaultValue: '',
    description: 'Background image for section or container',
  },
  cfBackgroundImageScaling: {
    displayName: 'Image scaling',
    type: 'Text',
    group: 'style',
    description: 'Adjust background image to fit, fill or tile the container',
    defaultValue: 'fit',
    validations: {
      in: [
        {
          value: 'fill',
          displayName: 'Fill',
        },
        {
          value: 'fit',
          displayName: 'Fit',
        },
        {
          value: 'tile',
          displayName: 'Tile',
        },
      ],
    },
  },
  cfBackgroundImageAlignment: {
    displayName: 'Image alignment',
    type: 'Text',
    group: 'style',
    description: 'Align background image to the edges of the container',
    defaultValue: 'left top',
  },
  cfHyperlink: {
    displayName: 'Hyperlink',
    type: 'Text',
    defaultValue: '',
    validations: {
      format: 'URL',
    },
    description: 'hyperlink for section or container',
  },
  cfOpenInNewTab: {
    displayName: 'Hyperlink behaviour',
    type: 'Boolean',
    defaultValue: false,
    description: 'To open hyperlink in new Tab or not',
  },
};

export const optionalBuiltInStyles: Partial<
  Record<ContainerStyleVariableName, ComponentDefinitionVariable<'Text' | 'Boolean'>>
> = {
  cfFontSize: {
    displayName: 'Font Size',
    type: 'Text',
    group: 'style',
    description: 'The font size of the element',
    defaultValue: '16px',
  },
  cfFontWeight: {
    validations: {
      in: [
        {
          value: '400',
          displayName: 'Normal',
        },
        {
          value: '500',
          displayName: 'Medium',
        },
        {
          value: '600',
          displayName: 'Semi Bold',
        },
      ],
    },
    displayName: 'Font Weight',
    type: 'Text',
    group: 'style',
    description: 'The font weight of the element',
    defaultValue: '400',
  },
  cfLineHeight: {
    displayName: 'Line Height',
    type: 'Text',
    group: 'style',
    description: 'The line height of the element',
    defaultValue: '20px',
  },
  cfLetterSpacing: {
    displayName: 'Letter Spacing',
    type: 'Text',
    group: 'style',
    description: 'The letter spacing of the element',
    defaultValue: '0px',
  },
  cfTextColor: {
    displayName: 'Text Color',
    type: 'Text',
    group: 'style',
    description: 'The text color of the element',
    defaultValue: 'rgba(0, 0, 0, 1)',
  },
  cfTextAlign: {
    validations: {
      in: [
        {
          value: 'left',
          displayName: 'Align left',
        },
        {
          value: 'center',
          displayName: 'Align center',
        },
        {
          value: 'right',
          displayName: 'Align right',
        },
      ],
    },
    displayName: 'Text Align',
    type: 'Text',
    group: 'style',
    description: 'The text alignment of the element',
    defaultValue: 'left',
  },
  cfTextTransform: {
    validations: {
      in: [
        {
          value: 'none',
          displayName: 'Normal',
        },
        {
          value: 'capitalize',
          displayName: 'Capitalize',
        },
        {
          value: 'uppercase',
          displayName: 'Uppercase',
        },
        {
          value: 'lowercase',
          displayName: 'Lowercase',
        },
      ],
    },
    displayName: 'Text Transform',
    type: 'Text',
    group: 'style',
    description: 'The text transform of the element',
    defaultValue: 'none',
  },
  cfTextBold: {
    displayName: 'Bold',
    type: 'Boolean',
    group: 'style',
    description: 'The text bold of the element',
    defaultValue: false,
  },
  cfTextItalic: {
    displayName: 'Italic',
    type: 'Boolean',
    group: 'style',
    description: 'The text italic of the element',
    defaultValue: false,
  },
  cfTextUnderline: {
    displayName: 'Underline',
    type: 'Boolean',
    group: 'style',
    description: 'The text underline of the element',
    defaultValue: false,
  },
};

export const containerBuiltInStyles: Partial<
  Record<ContainerStyleVariableName, ComponentDefinitionVariable<'Text' | 'Boolean'>>
> = {
  ...builtInStyles,
  cfMaxWidth: {
    displayName: 'Max Width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the section',
    defaultValue: '1192px',
  },
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    description: 'The margin of the container',
    defaultValue: '0 Auto 0 Auto',
  },
};

export const singleColumnBuiltInStyles: Partial<
  Record<ContainerStyleVariableName, ComponentDefinitionVariable<'Text' | 'Boolean'>>
> = {
  cfVerticalAlignment: {
    validations: {
      in: [
        {
          value: 'start',
          displayName: 'Align left',
        },
        {
          value: 'center',
          displayName: 'Align center',
        },
        {
          value: 'end',
          displayName: 'Align right',
        },
      ],
    },
    type: 'Text',
    group: 'style',
    description: 'The horizontal alignment of the column',
    defaultValue: 'center',
    displayName: 'Vertical alignment',
  },
  cfHorizontalAlignment: {
    validations: {
      in: [
        {
          value: 'start',
          displayName: 'Align top',
        },
        {
          value: 'center',
          displayName: 'Align center',
        },
        {
          value: 'end',
          displayName: 'Align bottom',
        },
      ],
    },
    type: 'Text',
    group: 'style',
    description: 'The horizontal alignment of the column',
    defaultValue: 'center',
    displayName: 'Horizontal alignment',
  },
  cfPadding: {
    displayName: 'Padding',
    type: 'Text',
    group: 'style',
    description: 'The padding of the column',
    defaultValue: '0 0 0 0',
  },
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
    description: 'The background color of the column',
    defaultValue: 'rgba(255, 255, 255, 0)',
  },
  cfFlexDirection: {
    displayName: 'Direction',
    type: 'Text',
    group: 'style',
    description: 'The orientation of the column',
    defaultValue: 'column',
  },
  cfFlexWrap: {
    displayName: 'Wrap objects',
    type: 'Text',
    group: 'style',
    description: 'Wrap objects',
    defaultValue: 'nowrap',
  },
  cfBorder: {
    displayName: 'Border',
    type: 'Text',
    group: 'style',
    description: 'The border of the column',
    defaultValue: '1px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
    description: 'The spacing between the elements of the column',
    defaultValue: '0px',
  },
  cfBackgroundImageUrl: {
    displayName: 'Background image',
    type: 'Text',
    defaultValue: '',
    description: 'Background image for section or container',
  },
  cfBackgroundImageScaling: {
    displayName: 'Image scaling',
    type: 'Text',
    group: 'style',
    description: 'Adjust background image to fit, fill or tile the column',
    defaultValue: 'fit',
    validations: {
      in: [
        {
          value: 'fill',
          displayName: 'Fill',
        },
        {
          value: 'fit',
          displayName: 'Fit',
        },
        {
          value: 'tile',
          displayName: 'Tile',
        },
      ],
    },
  },
  cfBackgroundImageAlignment: {
    displayName: 'Image alignment',
    type: 'Text',
    group: 'style',
    description: 'Align background image to the edges of the column',
    defaultValue: 'left top',
  },
  cfColumnSpan: {
    type: 'Text',
    defaultValue: '6',
    group: 'style',
  },
  cfColumnSpanLock: {
    type: 'Boolean',
    defaultValue: false,
    group: 'style',
  },
};

export const columnsBuiltInStyles: Partial<
  Record<ContainerStyleVariableName, ComponentDefinitionVariable<'Text' | 'Boolean'>>
> = {
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    description: 'The margin of the columns',
    defaultValue: '0 Auto 0 Auto',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    description: 'The width of the columns',
    defaultValue: 'fill',
  },
  cfMaxWidth: {
    displayName: 'Max width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the columns',
    defaultValue: '1192px',
  },
  cfPadding: {
    displayName: 'Padding',
    type: 'Text',
    group: 'style',
    description: 'The padding of the columns',
    defaultValue: '10px 10px 10px 10px',
  },
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
    description: 'The background color of the columns',
    defaultValue: 'rgba(255, 255, 255, 0)',
  },
  cfBorder: {
    displayName: 'Border',
    type: 'Text',
    group: 'style',
    description: 'The border of the columns',
    defaultValue: '1px solid rgba(0, 0, 0, 0)',
  },
  cfBackgroundImageUrl: {
    displayName: 'Background image',
    type: 'Text',
    defaultValue: '',
    description: 'Background image for section or container',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
    description: 'The spacing between the elements of the columns',
    defaultValue: '10px 10px',
  },
  cfBackgroundImageScaling: {
    displayName: 'Image scaling',
    type: 'Text',
    group: 'style',
    description: 'Adjust background image to fit, fill or tile the columns',
    defaultValue: 'fit',
    validations: {
      in: [
        {
          value: 'fill',
          displayName: 'Fill',
        },
        {
          value: 'fit',
          displayName: 'Fit',
        },
        {
          value: 'tile',
          displayName: 'Tile',
        },
      ],
    },
  },
  cfBackgroundImageAlignment: {
    displayName: 'Image alignment',
    type: 'Text',
    group: 'style',
    description: 'Align background image to the edges of the columns',
    defaultValue: 'left top',
  },
  cfColumns: {
    type: 'Text',
    defaultValue: '[6,6]',
    group: 'style',
  },
  cfWrapColumns: {
    type: 'Boolean',
    defaultValue: false,
    group: 'style',
  },
  cfWrapColumnsCount: {
    type: 'Text',
    defaultValue: '2',
    group: 'style',
  },
};
