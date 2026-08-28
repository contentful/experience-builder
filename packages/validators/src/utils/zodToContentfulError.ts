import { ZodIssueCode, ZodIssue } from 'zod';

export enum CodeNames {
  Type = 'type',
  Required = 'required',
  Unexpected = 'unexpected',
  Regex = 'regex',
  In = 'in',
  Size = 'size',
  Custom = 'custom',
}

export type ContentfulErrorDetails = {
  details: string;
  min?: number | bigint;
  max?: number | bigint;
  name: (typeof CodeNames)[keyof typeof CodeNames];
  path: (string | number)[];
  value?: string;
  expected?: (string | number)[];
};

const getInputTypeName = (input: unknown): string => {
  if (input === null) return 'null';
  if (Array.isArray(input)) return 'array';
  return typeof input;
};

const convertInvalidType = (
  issue: Extract<ZodIssue, { code: 'invalid_type' }>,
): ContentfulErrorDetails => {
  const name = issue.input === undefined ? CodeNames.Required : CodeNames.Type;
  const details =
    issue.input === undefined
      ? `The property "${issue.path.slice(-1)}" is required here`
      : `The type of "${issue.path.slice(-1)}" is incorrect, expected type: ${issue.expected}`;

  return {
    details,
    name,
    path: issue.path as (string | number)[],
    value: getInputTypeName(issue.input),
  };
};

const convertUnrecognizedKeys = (
  issue: Extract<ZodIssue, { code: 'unrecognized_keys' }>,
): ContentfulErrorDetails => {
  const missingProperties = issue.keys.map((k) => `"${k}"`).join(', ');
  return {
    details:
      issue.keys.length > 1
        ? `The properties ${missingProperties} are not expected`
        : `The property ${missingProperties} is not expected`,
    name: CodeNames.Unexpected,
    path: issue.path as (string | number)[],
  };
};

const convertInvalidString = (
  issue: Extract<ZodIssue, { code: 'invalid_format' }>,
): ContentfulErrorDetails => {
  return {
    details: issue.message || 'Invalid string',
    name: issue.format === 'regex' ? CodeNames.Regex : CodeNames.Unexpected,
    path: issue.path as (string | number)[],
  };
};

const convertInvalidValue = (
  issue: Extract<ZodIssue, { code: 'invalid_value' }>,
): ContentfulErrorDetails => {
  return {
    details: issue.message || 'Value must be one of expected values',
    name: CodeNames.In,
    path: issue.path as (string | number)[],
    value: String(issue.input ?? ''),
    expected: issue.values as (string | number)[],
  };
};

const convertTooBig = (issue: Extract<ZodIssue, { code: 'too_big' }>): ContentfulErrorDetails => {
  return {
    details: issue.message || `Size should be at most ${issue.maximum}`,
    name: CodeNames.Size,
    path: issue.path as (string | number)[],
    max: issue.maximum,
  };
};

const convertTooSmall = (
  issue: Extract<ZodIssue, { code: 'too_small' }>,
): ContentfulErrorDetails => {
  return {
    details: issue.message || `Size should be at least ${issue.minimum}`,
    name: CodeNames.Size,
    path: issue.path as (string | number)[],
    min: issue.minimum,
  };
};

const defaultConversion = (issue: ZodIssue): ContentfulErrorDetails => {
  return {
    details: issue.message || 'An unexpected error occurred',
    name: CodeNames.Custom,
    path: issue.path.map(String),
  };
};

export const zodToContentfulError = (issue: ZodIssue): ContentfulErrorDetails => {
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      return convertInvalidType(issue);
    case ZodIssueCode.unrecognized_keys:
      return convertUnrecognizedKeys(issue);
    case ZodIssueCode.invalid_value:
      return convertInvalidValue(issue);
    case ZodIssueCode.invalid_format:
      return convertInvalidString(issue);
    case ZodIssueCode.too_small:
      return convertTooSmall(issue);
    case ZodIssueCode.too_big:
      return convertTooBig(issue);
    default:
      return defaultConversion(issue);
  }
};
