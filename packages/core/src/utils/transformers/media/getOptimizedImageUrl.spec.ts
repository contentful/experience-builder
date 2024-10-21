import { describe, it, expect } from 'vitest';
import { getOptimizedImageUrl } from './getOptimizedImageUrl';

describe('getImageUrl', () => {
  it('should return the correct url', () => {
    const url = '//example.com/image.jpg';
    const width = 200;
    const quality = 80;
    const format = 'webp';
    const result = getOptimizedImageUrl(url, width, quality, format);
    expect(result).toBe('https://example.com/image.jpg?w=200&q=80&fm=webp');
  });

  it('when quality is below 0, quality should not be added to the url', () => {
    const url = '//example.com/image.jpg';
    const width = 200;
    const quality = -1;
    const format = 'webp';
    const result = getOptimizedImageUrl(url, width, quality, format);
    expect(result).toBe('https://example.com/image.jpg?w=200&fm=webp');
  });

  it('when quality is 0, quality should not be added to the url', () => {
    const url = '//example.com/image.jpg';
    const width = 200;
    const quality = 0;
    const format = 'webp';
    const result = getOptimizedImageUrl(url, width, quality, format);
    expect(result).toBe('https://example.com/image.jpg?w=200&fm=webp');
  });

  it('when quality is 100, quality should not be added to the url', () => {
    const url = '//example.com/image.jpg';
    const width = 200;
    const quality = 100;
    const format = 'webp';
    const result = getOptimizedImageUrl(url, width, quality, format);
    expect(result).toBe('https://example.com/image.jpg?w=200&fm=webp');
  });

  it('when quality is above 100, quality should not be added to the url', () => {
    const url = '//example.com/image.jpg';
    const width = 200;
    const quality = 101;
    const format = 'webp';
    const result = getOptimizedImageUrl(url, width, quality, format);
    expect(result).toBe('https://example.com/image.jpg?w=200&fm=webp');
  });

  it('when format is not provided, format should not be added to the url', () => {
    const url = '//example.com/image.jpg';
    const width = 200;
    const quality = 80;
    const result = getOptimizedImageUrl(url, width, quality);
    expect(result).toBe('https://example.com/image.jpg?w=200&q=80');
  });

  it('when width is not provided, width should not be added to the url', () => {
    const url = '//example.com/image.jpg';
    const quality = 80;
    const format = 'webp';
    const result = getOptimizedImageUrl(url, 0, quality, format);
    expect(result).toBe('https://example.com/image.jpg?q=80&fm=webp');
  });

  it('when no optional parameters are provided, the url should not have any query string', () => {
    const url = '//example.com/image.jpg';
    const result = getOptimizedImageUrl(url);
    expect(result).toBe('https://example.com/image.jpg');
  });
});
