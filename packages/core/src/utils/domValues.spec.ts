import { findOutermostCoordinates, getElementCoordinates } from './domValues';
import { describe, it, expect, vi } from 'vitest';

const mockChild1Rect = {
  width: 120,
  height: 120,
  top: 1,
  left: 20,
  bottom: 4,
  right: 25,
  x: 20,
  y: 1,
  toJSON: vi.fn(),
};

const mockChild2Rect = {
  width: 120,
  height: 12,
  top: 3,
  left: 4,
  bottom: 12,
  right: 25,
  x: 4,
  y: 3,
  toJSON: vi.fn(),
};

describe('Find outermost coordinates', () => {
  it('should return outermost coordinates', () => {
    expect(findOutermostCoordinates(mockChild1Rect, mockChild2Rect)).toEqual({
      bottom: 12,
      left: 4,
      right: 25,
      top: 1,
    });
  });
});

describe('Get element coordinates', () => {
  it('should return element coordinates', () => {
    const mockElement = document.createElement('div');
    expect(getElementCoordinates(mockElement)).toEqual({
      x: 0,
      y: 0,
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    });
  });

  it("should return child cooordinates as element coordinates if parent element's width & height is 0", () => {
    const mockElement = document.createElement('div');
    const mockChild1 = document.createElement('div');
    const mockChild2 = document.createElement('div');

    mockElement.appendChild(mockChild1);
    mockElement.appendChild(mockChild2);

    mockChild1.getBoundingClientRect = vi.fn(() => mockChild1Rect);
    mockChild2.getBoundingClientRect = vi.fn(() => mockChild2Rect);

    const rectResult = {
      x: 4,
      y: 1,
      bottom: 12,
      left: 4,
      right: 25,
      top: 1,
      width: 21,
      height: 11,
      toJSON: vi.fn(),
    };

    // @ts-expect-error ts wants the full DOMRect object which is unnecessary for this test
    global.DOMRect = {
      fromRect: vi.fn(() => rectResult),
    };

    expect(getElementCoordinates(mockElement as Element)).toEqual(rectResult);
  });
});
