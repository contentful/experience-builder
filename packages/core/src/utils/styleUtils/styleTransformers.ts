import {
  StyleProps,
  CSSProperties,
  OptimizedBackgroundImageAsset,
  BackgroundImageScalingOption,
  BackgroundImageAlignmentOption,
} from '@/types';
import { isContentfulStructureComponent } from '@/utils/components';
import { CALC_UNIT_REGEX } from '@/constants';

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

export const transformWidthSizing = (value?: string, cfMargin?: string, componentId?: string) => {
  if (!value || !cfMargin || !componentId) return;

  const transformedValue = transformFill(value);

  if (transformedValue && isContentfulStructureComponent(componentId)) {
    const margins = getWidthMargins(cfMargin);
    const subtractMargins = margins.map((value) => ({ operator: '-', value }));
    return transformCalc(transformedValue, subtractMargins);
  }

  return transformedValue;
};

/**
 * Transform the value to a calc value
 * @param value - value to be transformed
 * @param calcValues - array of values to be appended to the calc value
 * @returns `calc(${value} ${operator} ${value})` or `value`
 */
const transformCalc = (value: string, calcValues: { operator: string; value: string }[]) => {
  if (
    calcValues.length > 0 &&
    CALC_UNIT_REGEX.test(value) &&
    calcValues.every((o) => CALC_UNIT_REGEX.test(o.value))
  ) {
    const appendValues = calcValues.map((o) => `${o.operator} ${o.value}`).join(' ');
    return `calc(${value} ${appendValues})`;
  }
  return value;
};

/**
 * Get the horizontal margins from the margin string and filter out empty values
 * @param cfMargin - margin string
 * @returns array of horizontal margins
 */
const getWidthMargins = (cfMargin: string) => {
  const margins = cfMargin.split(' ');
  const ignoreValues = new Set([undefined, '', '0', '0px']);
  return [margins[1], margins[3]].filter((value) => !ignoreValues.has(value));
};
