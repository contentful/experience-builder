import { ZodIssueCode, ZodIssue, z } from 'zod';

export type ContentfulError = {
  details: string;
  min?: number | bigint;
  max?: number | bigint;
  name: string;
  path: string[];
  value?: string;
  expected?: (string | number)[];
};

const convertInvalidType = (issue: z.ZodInvalidTypeIssue): ContentfulError => {
  const name = issue.received === 'undefined' ? 'required' : 'type';
  const details =
    issue.received === 'undefined'
      ? `The property "${issue.path.slice(-1)}" is required here`
      : `The type of "${issue.path.slice(-1)}" is incorrect, expected type: ${issue.expected}`;

  return {
    details: details,
    name: name,
    path: issue.path.map(String),
    value: issue.received.toString(),
  };
};

const convertUnrecognizedKeys = (issue: z.ZodUnrecognizedKeysIssue): ContentfulError => {
  return {
    details: issue.message || `The properties ${issue.keys.join(', ')} are not expected`,
    name: 'unexpected',
    path: issue.path.map(String),
  };
};

const convertInvalidString = (issue: z.ZodInvalidStringIssue): ContentfulError => {
  return {
    details: issue.message || '',
    name: issue.validation === 'regex' ? 'regex' : 'unexpected',
    path: issue.path.map(String),
    value: issue.message || '',
  };
};
const convertInvalidEnumValue = (issue: z.ZodInvalidEnumValueIssue): ContentfulError => {
  return {
    details: issue.message || 'Value must be one of expected values',
    name: 'in',
    path: issue.path.map(String),
    value: issue.received.toString(),
    expected: issue.options,
  };
};
const convertInvalidLiteral = (issue: z.ZodInvalidLiteralIssue): ContentfulError => {
  return {
    details: issue.message || 'Value must be one of expected values',
    name: 'in',
    path: issue.path.map(String),
    value: issue.received as string,
    expected: [issue.expected as string],
  };
};

const convertTooBig = (issue: z.ZodTooBigIssue): ContentfulError => {
  return {
    details: issue.message || `Size should be at most ${issue.maximum}`,
    name: 'size',
    path: issue.path.map(String),
    max: issue.maximum,
  };
};

const convertTooSmall = (issue: z.ZodTooSmallIssue): ContentfulError => {
  return {
    details: issue.message || `Size should be at least ${issue.minimum}`,
    name: 'size',
    path: issue.path.map(String),
    min: issue.minimum,
  };
};
const defaultConversion = (issue: ZodIssue): ContentfulError => {
  return {
    details: issue.message || 'An unexpected error occurred',
    name: 'unexpected',
    path: issue.path.map(String),
  };
};

export const zodToContentfulError = (issue: ZodIssue): ContentfulError => {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      return convertInvalidType(issue);
    case ZodIssueCode.unrecognized_keys:
      return convertUnrecognizedKeys(issue);
    case ZodIssueCode.invalid_enum_value:
      return convertInvalidEnumValue(issue);
    case ZodIssueCode.invalid_string:
      return convertInvalidString(issue);
    case ZodIssueCode.too_small:
      return convertTooSmall(issue);
    case ZodIssueCode.too_big:
      return convertTooBig(issue);
    case ZodIssueCode.invalid_literal:
      return convertInvalidLiteral(issue);
    default:
      return defaultConversion(issue);
  }
};
