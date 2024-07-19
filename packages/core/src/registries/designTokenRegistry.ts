import { DesignTokensDefinition } from '@/types';
import { builtInStyles, optionalBuiltInStyles } from '../definitions/styles';

export let designTokensRegistry: DesignTokensDefinition = {};

// This function is used to ensure that the composite values are valid since composite values are optional.
// Therefore only border and in the future text related design tokens are/will be checked in this funciton.
// Ensuring values for simple key-value design tokens are not neccessary since they are required via typescript.
const ensureValidCompositeValues = (designTokenDefinition: DesignTokensDefinition) => {
  // Text token validation
  if (designTokenDefinition.text) {
    for (const textKey in designTokenDefinition.text) {
      const textValue = designTokenDefinition.text[textKey];
      designTokenDefinition.text[textKey] = {
        emphasis: textValue.emphasis || 'none',
        fontSize: textValue.fontSize || '16px',
        case: textValue.case || 'normal',
        fontWeight: textValue.fontWeight || '400',
        lineHeight: textValue.lineHeight || '20px',
        letterSpacing: textValue.letterSpacing || '0px',
        color: textValue.color || '#000000',
      };
    }
  }

  // Border validation
  if (designTokenDefinition.border) {
    for (const borderKey in designTokenDefinition.border) {
      const borderValue = designTokenDefinition.border[borderKey];
      designTokenDefinition.border[borderKey] = {
        width: borderValue.width || '1px',
        style: borderValue.style || 'solid',
        color: borderValue.color || '#000000',
      };
    }
  }
  return designTokenDefinition;
};

/**
 * Register design tokens styling
 * @param designTokenDefinition - {[key:string]: Record<string, string>}
 * @returns void
 */
export const defineDesignTokens = (designTokenDefinition: DesignTokensDefinition) => {
  Object.assign(designTokensRegistry, ensureValidCompositeValues(designTokenDefinition));
};

const templateStringRegex = /\${(.+?)}/g;

export const getDesignTokenRegistration = (breakpointValue: string, variableName: string) => {
  if (!breakpointValue) return breakpointValue;

  let resolvedValue = '';
  for (const part of breakpointValue.split(' ')) {
    const tokenValue = templateStringRegex.test(part)
      ? resolveSimpleDesignToken(part, variableName)
      : part;
    resolvedValue += `${tokenValue} `;
  }
  // Not trimming would end up with a trailing space that breaks the check in `calculateNodeDefaultHeight`
  return resolvedValue.trim();
};

const resolveSimpleDesignToken = (templateString: string, variableName: string) => {
  const nonTemplateValue = templateString.replace(templateStringRegex, '$1');
  const [tokenCategory, tokenName] = nonTemplateValue.split('.');
  const tokenValues = designTokensRegistry[tokenCategory];

  if (tokenValues && tokenValues[tokenName]) {
    if (variableName === 'cfBorder') {
      const { width, style, color } = tokenValues[tokenName];
      return `${width} ${style} ${color}`;
    }

    return tokenValues[tokenName];
  }
  if (builtInStyles[variableName]) {
    return builtInStyles[variableName].defaultValue;
  }
  if (optionalBuiltInStyles[variableName]) {
    return optionalBuiltInStyles[variableName].defaultValue;
  }
  return '0px';
};

// Used in unit tests to reset the design token registry
export const resetDesignTokenRegistry = () => {
  designTokensRegistry = {};
};
