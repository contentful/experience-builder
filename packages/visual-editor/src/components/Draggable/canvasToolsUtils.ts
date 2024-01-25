import type { ComponentDefinition } from '@contentful/experience-builder-core/types';
import { ASSEMBLY_DEFAULT_CATEGORY } from '@contentful/experience-builder-core/constants';

export type Breakpoints = Array<BreakpointItem>;

export type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
};
export type BreakpointItem = {
  id: string;
  query: string;
  displayName: string;
  previewSize: string;
};

export const isRelativePreviewSize = (width: string) => {
  // For now, we solely allow 100% as relative value
  return width === '100%';
};

export const checkIsDesignComponentDefinition = (component?: ComponentDefinition) =>
  component?.category === ASSEMBLY_DEFAULT_CATEGORY;

export const getTooltipPositions = ({
  previewSize,
  tooltipRect,
  coordinates,
}: {
  previewSize: string;
  tooltipRect?: DOMRect;
  coordinates?: Rect;
}) => {
  if (!coordinates || !tooltipRect) {
    return { display: 'none' };
  }

  /**
   * By default, the tooltip floats to the left of the element
   */
  const newTooltipStyles = { display: 'flex' };

  // If the preview size is relative, we don't change the floating direction
  if (!isRelativePreviewSize(previewSize)) {
    const previewSizeMatch = previewSize.match(/(\d{1,})px/);
    if (!previewSizeMatch) {
      return { display: 'none' };
    }
    const previewSizePx = parseInt(previewSizeMatch[1]);

    /**
     * If the element is at the right edge of the canvas, and the element isn't wide enough to fit the tooltip width,
     * we float the tooltip to the right of the element.
     */
    if (
      tooltipRect.width > previewSizePx - coordinates.right &&
      tooltipRect.width > coordinates.width
    ) {
      newTooltipStyles['float'] = 'right';
    }
  }

  const tooltipHeight = tooltipRect.height === 0 ? 32 : tooltipRect.height;

  /**
   * For elements with small heights, we don't want the tooltip covering the content in the element,
   * so we show the tooltip at the top or bottom.
   */
  if (tooltipHeight * 2 > coordinates.height) {
    /**
     * If there's enough space for the tooltip at the top of the element, we show the tooltip at the top of the element,
     * else we show the tooltip at the bottom.
     */
    if (tooltipHeight < coordinates.top) {
      newTooltipStyles['bottom'] = coordinates.height;
    } else {
      newTooltipStyles['top'] = coordinates.height;
    }
  }
  /**
   * If the component draws outside of the borders of the canvas to the left we move the tooltip to the right
   * so that it is fully visible.
   */
  if (coordinates.left < 0) {
    newTooltipStyles['left'] = -coordinates.left;
  }

  /**
   * If for any reason, the element's top is negative, we show the tooltip at the bottom
   */
  if (coordinates.top < 0) {
    newTooltipStyles['top'] = coordinates.height;
  }

  return newTooltipStyles;
};
