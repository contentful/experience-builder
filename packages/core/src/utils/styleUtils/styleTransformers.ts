import {
  StyleProps,
  CSSProperties,
  OptimizedBackgroundImageAsset,
  BackgroundImageScalingOption,
  BackgroundImageAlignmentOption,
} from '@/types';

export const transformFill = (value?: string) => (value === 'fill' ? '100%' : value);

export const transformGridColumn = (span?: string): CSSProperties => {
  if (!span) {
    return {};
  }

  return {
    gridColumn: `span ${span}`,
  };
};

export const transformBorderStyle = (value?: string): CSSProperties => {
  if (!value) return {};
  const parts = value.split(' ');
  // Just accept the passed value
  if (parts.length < 3) return { border: value };
  // Replace the second part always with `solid` and set the box sizing accordingly
  const [borderSize, borderStyle, ...borderColorParts] = parts;
  const borderColor = borderColorParts.join(' ');
  return {
    border: `${borderSize} ${borderStyle} ${borderColor}`,
  };
};

export const transformAlignment = (
  cfHorizontalAlignment?: string,
  cfVerticalAlignment?: string,
  cfFlexDirection = 'column',
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
  backgroundImage2?: string;
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
  cfBackgroundImageUrl: string | OptimizedBackgroundImageAsset | null | undefined,
  cfBackgroundImageOptions?: StyleProps['cfBackgroundImageOptions'],
): CSSPropertiesForBackground | undefined => {
  const matchBackgroundSize = (scaling?: BackgroundImageScalingOption) => {
    if ('fill' === scaling) return 'cover';
    if ('fit' === scaling) return 'contain';
  };

  const matchBackgroundPosition = (
    alignment?: BackgroundImageAlignmentOption,
  ): CSSPropertiesForBackground['backgroundPosition'] | undefined => {
    if (!alignment || 'string' !== typeof alignment) {
      return;
    }
    let [horizontalAlignment, verticalAlignment] = alignment.trim().split(/\s+/, 2);

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
    return;
  }

  let backgroundImage: string;
  let backgroundImageSet: string | undefined;

  if (typeof cfBackgroundImageUrl === 'string') {
    backgroundImage = `url(${cfBackgroundImageUrl})`;
  } else {
    const imgSet = cfBackgroundImageUrl.srcSet?.join(',');
    backgroundImage = `url(${cfBackgroundImageUrl.url})`;
    backgroundImageSet = `image-set(${imgSet})`;
  }

  return {
    backgroundImage,
    backgroundImage2: backgroundImageSet,
    backgroundRepeat: cfBackgroundImageOptions?.scaling === 'tile' ? 'repeat' : 'no-repeat',
    backgroundPosition: matchBackgroundPosition(cfBackgroundImageOptions?.alignment),
    backgroundSize: matchBackgroundSize(cfBackgroundImageOptions?.scaling),
  };
};
export const transformWidthSizing = ({
  value,
  cfMargin,
}: {
  value: string | undefined;
  cfMargin: string | undefined;
}) => {
  if (!value || !cfMargin) return;

  const transformedValue = transformFill(value);
  const marginValues = cfMargin.split(' ');

  const rightMargin = marginValues[1] || '0px';
  const leftMargin = marginValues[3] || '0px';

  const calcValue = `calc(${transformedValue} - ${leftMargin} - ${rightMargin})`;

  /**
   * We want to check if the calculated value is valid CSS. If this fails,
   * this means the `transformedValue` is not a calculable value (not a px, rem, or %).
   * The value may instead be a string such as `min-content` or `max-content`. In
   * that case we don't want to use calc and instead return the raw value.
   */
  if (typeof window !== 'undefined' && CSS.supports('width', calcValue)) {
    return calcValue;
  }

  return transformedValue;
};
