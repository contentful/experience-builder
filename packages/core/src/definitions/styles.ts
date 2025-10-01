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
    defaultValue: 'center',
    displayName: 'Horizontal alignment',
  },
  cfVisibility: {
    displayName: 'Visibility toggle',
    type: 'Boolean',
    group: 'style',
    defaultValue: true,
  },
  cfMargin: {
    displayName: 'Margin',
    type: 'Text',
    group: 'style',
    defaultValue: '0 0 0 0',
  },
  cfPadding: {
    displayName: 'Padding',
    type: 'Text',
    group: 'style',
    defaultValue: '0 0 0 0',
  },
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
    defaultValue: 'rgba(0, 0, 0, 0)',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    defaultValue: '100%',
  },
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    defaultValue: 'fit-content',
  },
  cfMaxWidth: {
    displayName: 'Max width',
    type: 'Text',
    group: 'style',
    defaultValue: 'none',
  },
  cfFlexDirection: {
    displayName: 'Direction',
    type: 'Text',
    group: 'style',
    defaultValue: 'column',
  },
  cfFlexReverse: {
    displayName: 'Reverse Direction',
    type: 'Boolean',
    group: 'style',
    defaultValue: false,
  },
  cfFlexWrap: {
    displayName: 'Wrap objects',
    type: 'Text',
    group: 'style',
    defaultValue: 'nowrap',
  },
  cfBorder: {
    displayName: 'Border',
    type: 'Text',
    group: 'style',
    defaultValue: '0px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
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
    defaultValue: '400',
  },
  cfImageAsset: {
    displayName: 'Image',
    type: 'Media',
    validations: {
      bindingSourceType: ['asset', 'entry', 'manual'],
    },
  },
  cfImageOptions: {
    displayName: 'Image options',
    type: 'Object',
    group: 'style',
    defaultValue: {
      width: '100%',
      height: '100%',
      targetSize: 'unset',
    },
  },
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
    defaultValue: 'rgba(0, 0, 0, 0)',
  },
  cfBackgroundImageUrl: {
    displayName: 'Background image',
    type: 'Media',
    validations: {
      bindingSourceType: ['asset', 'entry', 'manual'],
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
    defaultValue: '0px',
  },
  cfLineHeight: {
    displayName: 'Line Height',
    type: 'Text',
    group: 'style',
    defaultValue: '20px',
  },
  cfLetterSpacing: {
    displayName: 'Letter Spacing',
    type: 'Text',
    group: 'style',
    defaultValue: '0px',
  },
  cfTextColor: {
    displayName: 'Text Color',
    type: 'Text',
    group: 'style',
    defaultValue: 'rgba(0, 0, 0, 1)',
  },
  cfTextAlign: {
    validations: {
      in: [
        {
          value: 'start',
          displayName: 'Align start',
        },
        {
          value: 'center',
          displayName: 'Align center',
        },
        {
          value: 'end',
          displayName: 'Align end',
        },
      ],
    },
    displayName: 'Text Align',
    type: 'Text',
    group: 'style',
    defaultValue: 'start',
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
    defaultValue: 'none',
  },
  cfTextBold: {
    displayName: 'Bold',
    type: 'Boolean',
    group: 'style',
    defaultValue: false,
  },
  cfTextItalic: {
    displayName: 'Italic',
    type: 'Boolean',
    group: 'style',
    defaultValue: false,
  },
  cfTextUnderline: {
    displayName: 'Underline',
    type: 'Boolean',
    group: 'style',
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
    // Note: The UI overwrites '0 Auto 0 Auto' as the default value for top-level containers
    defaultValue: '0 0 0 0',
  },
  cfMaxWidth: {
    displayName: 'Max Width',
    type: 'Text',
    group: 'style',
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
    defaultValue: '20px 0px 20px 0px',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    defaultValue: '100%',
  },
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    defaultValue: '1px',
  },
  cfMaxWidth: {
    displayName: 'Max width',
    type: 'Text',
    group: 'style',
    defaultValue: 'none',
  },
  cfBackgroundColor: {
    displayName: 'Background color',
    type: 'Text',
    group: 'style',
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
    defaultValue: 'center',
    displayName: 'Horizontal alignment',
  },
  cfPadding: {
    displayName: 'Padding',
    type: 'Text',
    group: 'style',
    defaultValue: '0 0 0 0',
  },
  cfFlexDirection: {
    displayName: 'Direction',
    type: 'Text',
    group: 'style',
    defaultValue: 'column',
  },
  cfFlexWrap: {
    displayName: 'Wrap objects',
    type: 'Text',
    group: 'style',
    defaultValue: 'nowrap',
  },
  cfBorder: {
    displayName: 'Border',
    type: 'Text',
    group: 'style',
    defaultValue: '0px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
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
    // Note: The UI overwrites '0 Auto 0 Auto' as the default value for top-level columns
    defaultValue: '0 0 0 0',
  },
  cfWidth: {
    displayName: 'Width',
    type: 'Text',
    group: 'style',
    defaultValue: '100%',
  },
  cfMaxWidth: {
    displayName: 'Max width',
    type: 'Text',
    group: 'style',
    defaultValue: '1192px',
  },
  cfPadding: {
    displayName: 'Padding',
    type: 'Text',
    group: 'style',
    defaultValue: '10px 10px 10px 10px',
  },
  cfBorder: {
    displayName: 'Border',
    type: 'Text',
    group: 'style',
    defaultValue: '0px solid rgba(0, 0, 0, 0)',
  },
  cfGap: {
    displayName: 'Gap',
    type: 'Text',
    group: 'style',
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
