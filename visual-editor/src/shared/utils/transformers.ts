import { BLOCKS, Document as RichTextDocument } from '@contentful/rich-text-types';

import {
  StyleProps,
  CSSProperties,
  ComponentDefinitionVariable,
  CompositionVariableValueType,
} from '@contentful/experience-builder-core';

export const transformFill = (value?: string) => (value === 'fill' ? '100%' : value);
export const transformBorderStyle = (value?: string): CSSProperties => {
  if (!value) return {};
  const parts = value.split(' ');
  // Just accept the passed value
  if (parts.length < 3) return { border: value };
  // Replace the second part always with `solid` and set the box sizing accordingly
  const [borderSize, borderPlacement, ...borderColorParts] = parts;
  const borderColor = borderColorParts.join(' ');
  return {
    border: `${borderSize} solid ${borderColor}`,
    boxSizing: borderPlacement === 'inside' ? 'border-box' : 'content-box',
  };
};

export const transformAlignment = (
  cfHorizontalAlignment?: string,
  cfVerticalAlignment?: string,
  cfFlexDirection = 'column'
): CSSProperties =>
  cfFlexDirection === 'row'
    ? {
        alignItems: cfHorizontalAlignment,
        justifyContent:
          cfVerticalAlignment === 'center' ? `safe ${cfVerticalAlignment}` : cfVerticalAlignment,
      }
    : {
        alignItems: cfVerticalAlignment,
        justifyContent:
          cfHorizontalAlignment === 'center'
            ? `safe ${cfHorizontalAlignment}`
            : cfHorizontalAlignment,
      };

interface CSSPropertiesForBackground extends CSSProperties {
  backgroundImage: string;
  backgroundRepeat: 'repeat' | 'no-repeat';
  backgroundSize?: 'cover' | 'contain';

  backgroundPosition?:
    | 'left top'
    | 'left center'
    | 'left bottom'
    | 'right top'
    | 'right center'
    | 'right bottom'
    | 'center top'
    | 'center center'
    | 'center bottom';
}

export const transformBackgroundImage = (
  cfBackgroundImageUrl: string | null | undefined,
  cfBackgroundImageScaling?: StyleProps['cfBackgroundImageScaling'],
  cfBackgroundImageAlignment?: StyleProps['cfBackgroundImageAlignment']
): CSSPropertiesForBackground | undefined => {
  const matchBackgroundSize = (
    backgroundImageScaling?: StyleProps['cfBackgroundImageScaling']
  ): 'cover' | 'contain' | undefined => {
    if ('fill' === backgroundImageScaling) return 'cover';
    if ('fit' === backgroundImageScaling) return 'contain';
    return undefined;
  };

  const matchBackgroundPosition = (
    cfBackgroundImageAlignment?: StyleProps['cfBackgroundImageAlignment']
  ): CSSPropertiesForBackground['backgroundPosition'] | undefined => {
    if (!cfBackgroundImageAlignment) {
      return undefined;
    }
    if ('string' !== typeof cfBackgroundImageAlignment) {
      return undefined;
    }
    let [horizontalAlignment, verticalAlignment] = cfBackgroundImageAlignment
      .trim()
      .split(/\s+/, 2);

    // Special case for handling single values
    // for backwards compatibility with single values 'right','left', 'center', 'top','bottom'
    if (horizontalAlignment && !verticalAlignment) {
      const singleValue = horizontalAlignment;
      switch (singleValue) {
        case 'left':
          horizontalAlignment = 'left';
          verticalAlignment = 'center';
          break;
        case 'right':
          horizontalAlignment = 'right';
          verticalAlignment = 'center';
          break;
        case 'center':
          horizontalAlignment = 'center';
          verticalAlignment = 'center';
          break;
        case 'top':
          horizontalAlignment = 'center';
          verticalAlignment = 'top';
          break;
        case 'bottom':
          horizontalAlignment = 'center';
          verticalAlignment = 'bottom';
          break;
        default:
        // just fall down to the normal validation logic for horiz and vert
      }
    }

    const isHorizontalValid = ['left', 'right', 'center'].includes(horizontalAlignment);
    const isVerticalValid = ['top', 'bottom', 'center'].includes(verticalAlignment);

    horizontalAlignment = isHorizontalValid ? horizontalAlignment : 'left';
    verticalAlignment = isVerticalValid ? verticalAlignment : 'top';

    return `${horizontalAlignment} ${verticalAlignment}` as CSSPropertiesForBackground['backgroundPosition'];
  };

  if (!cfBackgroundImageUrl) {
    return undefined;
  }

  return {
    backgroundImage: `url(${cfBackgroundImageUrl})`,
    backgroundRepeat: cfBackgroundImageScaling === 'tile' ? 'repeat' : 'no-repeat',
    backgroundPosition: matchBackgroundPosition(cfBackgroundImageAlignment),
    backgroundSize: matchBackgroundSize(cfBackgroundImageScaling),
  };
};

export const transformContentValue = (
  value: CompositionVariableValueType,
  variableDefinition: ComponentDefinitionVariable
) => {
  if (variableDefinition.type === 'RichText') {
    return transformRichText(value);
  }
  return value;
};

export const transformRichText = (
  value: CompositionVariableValueType
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

export const transformWidthSizing = ({
  value,
  cfMargin,
}: {
  value: string | undefined;
  cfMargin: string | undefined;
}) => {
  if (!value || !cfMargin) return undefined;

  const transformedValue = transformFill(value);
  const marginValues = cfMargin.split(' ');

  const rightMargin = marginValues[1] || '0px';
  const leftMargin = marginValues[3] || '0px';

  return `calc(${transformedValue} - ${leftMargin} - ${rightMargin})`;
};
