import { calculateNodeDefaultHeight } from './stylesUtils';
import { describe, it, expect } from 'vitest';
import { CONTENTFUL_COMPONENTS } from '@/constants';

describe('calculateNodeDefaultHeight', () => {
  it('should return value when blockId is undefined', () => {
    const result = calculateNodeDefaultHeight({
      value: '400px',
    });

    expect(result).toBe('400px');
  });

  it('should return value when value is not "auto"', () => {
    const result = calculateNodeDefaultHeight({
      value: '456px',
    });

    expect(result).toBe('456px');
  });

  it('should return value if block is not a container', () => {
    const result = calculateNodeDefaultHeight({
      blockId: 'node-block-id',
      value: '567px',
    });

    expect(result).toBe('567px');
  });

  it('should return "100%" if block is a structure component with "auto" height', () => {
    for (const blockId of [CONTENTFUL_COMPONENTS.container.id, CONTENTFUL_COMPONENTS.section.id]) {
      const result = calculateNodeDefaultHeight({
        blockId,
        value: 'auto',
      });

      expect(result).toBe('100%');
    }
  });
});
