import { DEFAULT_IMAGE_WIDTH } from '@/constants';
import { ComponentDefinitionVariable, ContainerStyleVariableName } from '../types';

type VariableDefinitions = Partial<
  Record<
    ContainerStyleVariableName,
    ComponentDefinitionVariable<'Text' | 'Boolean' | 'Media' | 'Object' | 'Hyperlink'>
  >
>;

// These styles get added to every component, user custom or contentful provided
export const builtInStyles: VariableDefinitions = {
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
    defaultValue: '0px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
    description: 'The spacing between the elements of the section',
    defaultValue: '0px',
  },
  cfHyperlink: {
    displayName: 'Hyperlink',
    type: 'Hyperlink',
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

export const optionalBuiltInStyles: VariableDefinitions = {
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
  cfImageAsset: {
    displayName: 'Image',
    type: 'Media',
    description: 'Image to display',
  },
  cfImageOptions: {
    displayName: 'Image options',
    type: 'Object',
    group: 'style',
    defaultValue: {
      width: DEFAULT_IMAGE_WIDTH,
      height: '100%',
      targetSize: DEFAULT_IMAGE_WIDTH,
    },
  },
  cfBackgroundImageUrl: {
    displayName: 'Background image',
    type: 'Media',
    description: 'Background image for component',
  },
  cfBackgroundImageOptions: {
    displayName: 'Background image options',
    type: 'Object',
    group: 'style',
    defaultValue: {
      scaling: 'fill',
      alignment: 'left top',
      targetSize: '2000px',
    },
  },
  cfBorderRadius: {
    displayName: 'Border Radius',
    type: 'Text',
    group: 'style',
    description: 'The border radius of the section',
    defaultValue: '0px',
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

export const sectionBuiltInStyles: VariableDefinitions = {
  ...builtInStyles,
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundImageUrl: optionalBuiltInStyles.cfBackgroundImageUrl,
  cfBackgroundImageOptions: optionalBuiltInStyles.cfBackgroundImageOptions,
};

export const containerBuiltInStyles: VariableDefinitions = {
  ...builtInStyles,
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundImageUrl: optionalBuiltInStyles.cfBackgroundImageUrl,
  cfBackgroundImageOptions: optionalBuiltInStyles.cfBackgroundImageOptions,
  cfMaxWidth: {
    displayName: 'Max Width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the section',
    defaultValue: '1192px',
  },
};

export const dividerBuiltInStyles: VariableDefinitions = {
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    description: 'The margin of the divider',
    defaultValue: '20px 0px 20px 0px',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    description: 'The width of the divider',
    defaultValue: 'fill',
  },
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    description: 'The height of the divider',
    defaultValue: '2px',
  },
  cfMaxWidth: {
    displayName: 'Max width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the divider',
    defaultValue: 'none',
  },
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
    description: 'The background color of the divider',
    defaultValue: 'rgba(0, 0, 0, 1)',
  },
};

export const singleColumnBuiltInStyles: VariableDefinitions = {
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundImageUrl: optionalBuiltInStyles.cfBackgroundImageUrl,
  cfBackgroundImageOptions: optionalBuiltInStyles.cfBackgroundImageOptions,
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
    defaultValue: '0px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
    description: 'The spacing between the elements of the column',
    defaultValue: '0px',
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

export const columnsBuiltInStyles: VariableDefinitions = {
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundImageUrl: optionalBuiltInStyles.cfBackgroundImageUrl,
  cfBackgroundImageOptions: optionalBuiltInStyles.cfBackgroundImageOptions,
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    description: 'The margin of the columns',
    defaultValue: '0 0 0 0',
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
    defaultValue: '0px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
    description: 'The spacing between the elements of the columns',
    defaultValue: '10px 10px',
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
