import { DEFAULT_IMAGE_WIDTH } from '@/constants';
import { DesignVariableMap } from '../types';

// These styles get added to every component, user custom or contentful provided
export const builtInStyles: Partial<DesignVariableMap> = {
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
        {
          value: 'stretch',
          displayName: 'Stretch',
        },
      ],
    },
    type: 'Text',
    group: 'style',
    description: 'The vertical alignment of the section',
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
        {
          value: 'stretch',
          displayName: 'Stretch',
        },
      ],
    },
    type: 'Text',
    group: 'style',
    description: 'The horizontal alignment of the section',
    defaultValue: 'center',
    displayName: 'Horizontal alignment',
  },
  cfVisibility: {
    displayName: 'Visibility toggle',
    type: 'Boolean',
    group: 'style',
    defaultValue: true,
    description: 'The visibility of the component',
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
    defaultValue: 'rgba(0, 0, 0, 0)',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    description: 'The width of the section',
    defaultValue: '100%',
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
  cfFlexReverse: {
    displayName: 'Reverse Direction',
    type: 'Boolean',
    group: 'style',
    description: 'Toggle the flex direction to be reversed',
    defaultValue: false,
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
    displayName: 'URL',
    type: 'Hyperlink',
    defaultValue: '',
    validations: {
      format: 'URL',
      bindingSourceType: ['entry', 'experience', 'manual'],
    },
    description: 'hyperlink for section or container',
  },
  cfOpenInNewTab: {
    displayName: 'URL behaviour',
    type: 'Boolean',
    defaultValue: false,
    description: 'Open in new tab',
  },
};

export const optionalBuiltInStyles: Partial<DesignVariableMap> = {
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
    validations: {
      bindingSourceType: ['entry', 'asset', 'manual'],
    },
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
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
    description: 'The background color of the element',
    defaultValue: 'rgba(0, 0, 0, 0)',
  },
  cfBackgroundImageUrl: {
    displayName: 'Background image',
    type: 'Media',
    description: 'Background image for component',
    validations: {
      bindingSourceType: ['entry', 'asset', 'manual'],
    },
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

export const sectionBuiltInStyles: Partial<DesignVariableMap> = {
  ...builtInStyles,
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundImageUrl: optionalBuiltInStyles.cfBackgroundImageUrl,
  cfBackgroundImageOptions: optionalBuiltInStyles.cfBackgroundImageOptions,
};

export const containerBuiltInStyles: Partial<DesignVariableMap> = {
  ...builtInStyles,
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundImageUrl: optionalBuiltInStyles.cfBackgroundImageUrl,
  cfBackgroundImageOptions: optionalBuiltInStyles.cfBackgroundImageOptions,
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    description: 'The margin of the container',
    // Note: The UI overwrites '0 Auto 0 Auto' as the default value for top-level containers
    defaultValue: '0 0 0 0',
  },
  cfMaxWidth: {
    displayName: 'Max Width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the section',
    defaultValue: '1192px',
  },
};

export const dividerBuiltInStyles: Partial<DesignVariableMap> = {
  cfVisibility: builtInStyles.cfVisibility,
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
    defaultValue: '100%',
  },
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    description: 'The height of the divider',
    defaultValue: '1px',
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
    defaultValue: 'rgba(204, 204, 204, 1)',
  },
};

export const singleColumnBuiltInStyles: Partial<DesignVariableMap> = {
  cfVisibility: builtInStyles.cfVisibility,
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundColor: optionalBuiltInStyles.cfBackgroundColor,
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
        {
          value: 'stretch',
          displayName: 'Stretch',
        },
      ],
    },
    type: 'Text',
    group: 'style',
    description: 'The vertical alignment of the column',
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
        {
          value: 'stretch',
          displayName: 'Stretch',
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

export const columnsBuiltInStyles: Partial<DesignVariableMap> = {
  cfVisibility: builtInStyles.cfVisibility,
  cfBorderRadius: optionalBuiltInStyles.cfBorderRadius,
  cfBackgroundColor: optionalBuiltInStyles.cfBackgroundColor,
  cfBackgroundImageUrl: optionalBuiltInStyles.cfBackgroundImageUrl,
  cfBackgroundImageOptions: optionalBuiltInStyles.cfBackgroundImageOptions,
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    description: 'The margin of the columns',
    // Note: The UI overwrites '0 Auto 0 Auto' as the default value for top-level columns
    defaultValue: '0 0 0 0',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    description: 'The width of the columns',
    defaultValue: '100%',
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
