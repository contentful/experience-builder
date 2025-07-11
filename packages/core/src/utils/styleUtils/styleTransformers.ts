import {
  StyleProps,
  CSSProperties,
  OptimizedBackgroundImageAsset,
  BackgroundImageScalingOption,
  BackgroundImageAlignmentOption,
} from '@/types';

/** Turn the visibility value into a style object that can be used for inline styles in React */
export const transformVisibility = (value?: boolean): CSSProperties => {
  if (value === false) {
    return {
      display: 'none !important',
    };
  }
  // Don't explicitly set anything when visible to not overwrite values like `grid` or `flex`.
  return {};
};

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
