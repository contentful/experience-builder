import { describe, it, expect } from 'vitest';
import { zodToContentfulError } from '../../src/utils/zodToContentfulError';
import { ZodIssueCode } from 'zod';

describe('zodToContentfulError', () => {
  describe('ZodIssueCode.invalid_type', () => {
    it('converts to name: type when type is mismatched', () => {
      const issue = {
        code: ZodIssueCode.invalid_type,
        message: 'Expected string, received number',
        path: ['fields', 'componentTree', 'schemaVersion'],
        received: 'number' as const,
        expected: 'string' as const,
        unionErrors: ['number'],
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'type',
        path: ['fields', 'componentTree', 'schemaVersion'],
        value: 'number',
        details: 'The type of "schemaVersion" is incorrect, expected type: string',
      });
    });

    it('converts to name: required when field is missing', () => {
      const issue = {
        code: ZodIssueCode.invalid_type,
        message: 'Expected string, received number',
        path: ['fields', 'componentTree', 'schemaVersion'],
        received: 'undefined' as const,
        expected: 'string' as const,
        unionErrors: ['number'],
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'required',
        path: ['fields', 'componentTree', 'schemaVersion'],
        value: 'undefined',
        details: 'The property "schemaVersion" is required here',
      });
    });
  });
  describe('ZodIssueCode.invalid_string', () => {
    it('converts to name: unexpected', () => {
      const issue = {
        code: ZodIssueCode.invalid_string,
        message: 'Invalid string',
        path: ['fields', 'componentTree', 'schemaVersion'],
        validation: 'email' as const,
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'unexpected',
        path: ['fields', 'componentTree', 'schemaVersion'],
        details: 'Invalid string',
      });
    });
    it("converts to name: regex if validation is 'regex'", () => {
      const issue = {
        code: ZodIssueCode.invalid_string,
        message: 'Invalid string',
        path: ['fields', 'componentTree', 'schemaVersion'],
        validation: 'regex' as const,
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'regex',
        path: ['fields', 'componentTree', 'schemaVersion'],
        details: 'Invalid string',
      });
    });
  });
  describe('ZodIssueCode.too_big', () => {
    it('converts to name: size', () => {
      const issue = {
        code: ZodIssueCode.too_big,
        message: 'String must contain at most 32 character(s)',
        path: ['fields', 'componentTree', 'schemaVersion'],
        maximum: 32,
        exact: false,
        inclusive: true,
        type: 'string' as const,
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'size',
        path: ['fields', 'componentTree', 'schemaVersion'],
        details: 'String must contain at most 32 character(s)',
        max: 32,
      });
    });
  });
  describe('ZodIssueCode.too_small', () => {
    it('converts to name: size', () => {
      const issue = {
        code: ZodIssueCode.too_small,
        message: 'String must contain at least 1 character(s)',
        path: ['fields', 'componentTree', 'schemaVersion'],
        minimum: 1,
        exact: false,
        inclusive: true,
        type: 'string' as const,
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'size',
        path: ['fields', 'componentTree', 'schemaVersion'],
        details: 'String must contain at least 1 character(s)',
        min: 1,
      });
    });
  });
  describe('ZodIssueCode.invalid_enum_value', () => {
    it('converts to name: in', () => {
      const issue = {
        code: ZodIssueCode.invalid_enum_value,
        message: 'Value must be one of expected values',
        path: ['fields', 'componentTree', 'schemaVersion'],
        options: ['a', 'b', 'c'],
        received: 'd',
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'in',
        path: ['fields', 'componentTree', 'schemaVersion'],
        details: 'Value must be one of expected values',
        expected: ['a', 'b', 'c'],
        value: 'd',
      });
    });
  });
  describe('ZodIssueCode.invalid_literal', () => {
    it('converts to name: in', () => {
      const issue = {
        code: ZodIssueCode.invalid_literal,
        message: 'Value must be one of expected values',
        path: ['fields', 'componentTree', 'schemaVersion'],
        received: 'd',
        expected: 'a',
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'in',
        path: ['fields', 'componentTree', 'schemaVersion'],
        details: 'Value must be one of expected values',
        expected: ['a'],
        value: 'd',
      });
    });
  });
  describe('ZodIssueCode.unrecognized_keys', () => {
    it('converts to name: unexpected', () => {
      const issue = {
        code: ZodIssueCode.unrecognized_keys,
        message: 'The properties "a", "b", "c" are not expected',
        path: ['fields', 'componentTree', 'schemaVersion'],
        keys: ['a', 'b', 'c'],
      };
      const result = zodToContentfulError(issue);
      expect(result).toEqual({
        name: 'unexpected',
        path: ['fields', 'componentTree', 'schemaVersion'],
        details: 'The properties "a", "b", "c" are not expected',
      });
    });
  });
});
