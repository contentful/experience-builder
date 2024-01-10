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
    defaultValue: '0px',
  },
  cfPadding: {
    displayName: 'Padding',
    type: 'Text',
    group: 'style',
    description: 'The padding of the section',
    defaultValue: '0px',
  },
  cfBackgroundColor: {
    displayName: 'Background',
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
    defaultValue: 'fill',
  },
  cfMaxWidth: {
    displayName: 'Max Width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the section',
    defaultValue: 'initial',
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
    defaultValue: '0px',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
    description: 'The spacing between the elements of the section',
    defaultValue: '0px',
  },
  cfBackgroundImageUrl: {
    displayName: 'Background Image',
    type: 'Text',
    defaultValue: '',
    description: 'Background image for section or container',
  },
  cfBackgroundImageScaling: {
    displayName: 'Image Scaling',
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
    displayName: 'Image Alignment',
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
    description: 'The font size of the section',
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
    description: 'The font weight of the section',
    defaultValue: '400',
  },
  cfLineHeight: {
    displayName: 'Line Height',
    type: 'Text',
    group: 'style',
    description: 'The line height of the section',
    defaultValue: '20px',
  },
  cfLetterSpacing: {
    displayName: 'Letter Spacing',
    type: 'Text',
    group: 'style',
    description: 'The letter spacing of the section',
    defaultValue: '0px',
  },
  cfTextColor: {
    displayName: 'Text Color',
    type: 'Text',
    group: 'style',
    description: 'The text color of the section',
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
    description: 'The text alignment of the section',
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
    description: 'The text transform of the section',
    defaultValue: 'none',
  },
  cfTextBold: {
    displayName: 'Bold',
    type: 'Boolean',
    group: 'style',
    description: 'The text bold of the section',
    defaultValue: false,
  },
  cfTextItalic: {
    displayName: 'Italic',
    type: 'Boolean',
    group: 'style',
    description: 'The text italic of the section',
    defaultValue: false,
  },
  cfTextUnderline: {
    displayName: 'Underline',
    type: 'Boolean',
    group: 'style',
    description: 'The text underline of the section',
    defaultValue: false,
  },
};

export const containerBuiltInStyles = {
  ...builtInStyles,
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    description: 'The height of the section',
    defaultValue: 'auto',
  } as ComponentDefinitionVariable<'Text'>,
};
