import { describe, it, expect } from 'vitest';
import { deepFreeze } from './freeze';

describe('deepFreeze', () => {
  it('should freeze a simple object', () => {
    const obj = { a: 1, b: 2 };
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(() => {
      (frozen as { a: number }).a = 3;
    }).toThrow();
  });

  it('should deeply freeze nested objects', () => {
    const obj = { a: { b: { c: 2 } } };
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.a)).toBe(true);
    expect(Object.isFrozen(frozen.a.b)).toBe(true);
    expect(() => {
      (frozen.a.b as { c: number }).c = 5;
    }).toThrow();
  });

  it('should handle arrays', () => {
    const arr = [1, 2, { a: 3 }];
    const frozen = deepFreeze(arr);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen[2])).toBe(true);
    expect(() => {
      (frozen as number[])[0] = 10;
    }).toThrow();
    expect(() => {
      (frozen[2] as { a: number }).a = 4;
    }).toThrow();
  });

  it('should handle objects with null values', () => {
    const obj = { a: null, b: 2 };
    const frozen = deepFreeze(obj);
    expect(Object.isFrozen(frozen)).toBe(true);
  });

  it('should return the same reference', () => {
    const obj = { a: 1 };
    const frozen = deepFreeze(obj);
    expect(frozen).toBe(obj);
  });
});
