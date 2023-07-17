type Rect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

const sumRects = (first: Rect, second: Rect) => {
  return {
    top: Math.min(first.top, second.top),
    right: Math.max(first.right, second.right),
    bottom: Math.max(first.bottom, second.bottom),
    left: Math.min(first.left, second.left),
  };
};

export const getElementCoordinates = (element: Element): DOMRect => {
  const rect = element.getBoundingClientRect();
  if (element.children.length === 0) {
    return rect;
  }
  if (rect.width !== 0 || rect.height !== 0) {
    return rect;
  }

  const rects: Rect[] = [];

  for (const child of element.children) {
    const childRect = getElementCoordinates(child);
    if (childRect.width !== 0 || childRect.height !== 0) {
      const { top, right, bottom, left } = childRect;
      rects.push({ top, right, bottom, left });
    }
  }

  if (rects.length === 0) {
    return rect;
  }

  const { top, right, bottom, left } = rects.reduce(sumRects);
  return DOMRect.fromRect({
    x: left,
    y: top,
    height: bottom - top,
    width: right - left,
  });
};