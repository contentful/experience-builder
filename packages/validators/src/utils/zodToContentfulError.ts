import { ZodIssueCode, ZodIssue, z } from 'zod';

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

const convertInvalidType = (issue: z.ZodInvalidTypeIssue): ContentfulErrorDetails => {
  const name = issue.received === 'undefined' ? CodeNames.Required : CodeNames.Type;
  const details =
    issue.received === 'undefined'
      ? `The property "${issue.path.slice(-1)}" is required here`
      : `The type of "${issue.path.slice(-1)}" is incorrect, expected type: ${issue.expected}`;

  return {
    details: details,
    name: name,
    path: issue.path,
    value: issue.received.toString(),
  };
};

const convertUnrecognizedKeys = (issue: z.ZodUnrecognizedKeysIssue): ContentfulErrorDetails => {
  const missingProperties = issue.keys.map((k) => `"${k}"`).join(', ');
  return {
    details:
      issue.keys.length > 1
        ? `The properties ${missingProperties} are not expected`
        : `The property ${missingProperties} is not expected`,
    name: CodeNames.Unexpected,
    path: issue.path,
  };
};

const convertInvalidString = (issue: z.ZodInvalidStringIssue): ContentfulErrorDetails => {
  return {
    details: issue.message || 'Invalid string',
    name: issue.validation === 'regex' ? CodeNames.Regex : CodeNames.Unexpected,
    path: issue.path,
  };
};
const convertInvalidEnumValue = (issue: z.ZodInvalidEnumValueIssue): ContentfulErrorDetails => {
  return {
    details: issue.message || 'Value must be one of expected values',
    name: CodeNames.In,
    path: issue.path,
    value: issue.received.toString(),
    expected: issue.options,
  };
};
const convertInvalidLiteral = (issue: z.ZodInvalidLiteralIssue): ContentfulErrorDetails => {
  return {
    details: issue.message || 'Value must be one of expected values',
    name: CodeNames.In,
    path: issue.path,
    value: issue.received as string,
    expected: [issue.expected as string],
  };
};

const convertTooBig = (issue: z.ZodTooBigIssue): ContentfulErrorDetails => {
  return {
    details: issue.message || `Size should be at most ${issue.maximum}`,
    name: CodeNames.Size,
    path: issue.path,
    max: issue.maximum,
  };
};

const convertTooSmall = (issue: z.ZodTooSmallIssue): ContentfulErrorDetails => {
  return {
    details: issue.message || `Size should be at least ${issue.minimum}`,
    name: CodeNames.Size,
    path: issue.path,
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
