import {
  ComponentDefinitionVariable,
  ContainerStyleVariableName,
} from '@contentful/experiences-sdk-react/dist/types';

export const builtInStyles: Record<
  ContainerStyleVariableName,
  ComponentDefinitionVariable<'Text' | 'Boolean'>
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
    defaultValue: '100%',
  },
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    description: 'The height of the section',
    defaultValue: '100%',
  },
  cfMaxWidth: {
    displayName: 'Max Width',
    type: 'Text',
    group: 'style',
    description: 'The max-width of the section',
    defaultValue: '100%',
  },
  cfFlexDirection: {
    displayName: 'Direction',
    type: 'Text',
    group: 'style',
    description: 'The orientation of the section',
    defaultValue: 'row',
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
    defaultValue: '1px solid rgba(0,0,0,0)',
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

export const containerBuiltInStyles = {
  ...builtInStyles,
  cfHeight: {
    displayName: 'Height',
    type: 'Text',
    group: 'style',
    description: 'The height of the section',
    defaultValue: 'Auto',
  } as ComponentDefinitionVariable<'Text'>,
};
