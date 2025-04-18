import { ExperienceTreeNode } from '@/types';
import { calculateNodeDefaultHeight, stringifyCssProperties } from './stylesUtils';
import { describe, it, expect } from 'vitest';
import { CONTENTFUL_COMPONENTS, EMPTY_CONTAINER_HEIGHT } from '@/constants';

describe('stylesUtils', () => {
  describe('calculateNodeDefaultHeight', () => {
    it('should return value when blockId is undefined', () => {
      const result = calculateNodeDefaultHeight({
        children: [],
        value: '400px',
      });

      expect(result).toBe('400px');
    });

    it('should return value when value is not "auto"', () => {
      const result = calculateNodeDefaultHeight({
        children: [],
        value: '456px',
      });

      expect(result).toBe('456px');
    });

    it('should return value if block is not a container', () => {
      const result = calculateNodeDefaultHeight({
        blockId: 'node-block-id',
        children: [],
        value: '567px',
      });

      expect(result).toBe('567px');
    });

    it('should return defaultValue of "120px" when container is on "root" and has no children', () => {
      const result = calculateNodeDefaultHeight({
        blockId: CONTENTFUL_COMPONENTS.container.id,
        children: [],
        value: 'auto',
      });

      expect(result).toBe(EMPTY_CONTAINER_HEIGHT);
    });

    it('should return "100%" when container has a non-container child', () => {
      const childNode: ExperienceTreeNode = {
        type: 'block',
        data: {
          id: 'block1',
          props: {},
          dataSource: {},
          unboundValues: {},
          breakpoints: [],
        },
        children: [],
      };

      const result = calculateNodeDefaultHeight({
        blockId: CONTENTFUL_COMPONENTS.container.id,
        children: [childNode],
        value: 'auto',
      });

      expect(result).toBe('100%');
    });
  });

  describe('stringifyCssProperties', () => {
    it('should join a given object of css rules into a string', () => {
      const cssRules = {
        background: 'green',
        color: 'white',
        'font-size': '1rem',
      };

      const res = stringifyCssProperties(cssRules);

      expect(res).toBe('background:green;color:white;font-size:1rem;');
    });

    it('adds whitespaces when boolean is true', () => {
      const cssRules = {
        background: 'green',
        color: 'white',
        'font-size': '1rem',
      };

      const res = stringifyCssProperties(cssRules, true);

      expect(res).toBe('background: green;\ncolor: white;\nfont-size: 1rem;');
    });
  });
});
