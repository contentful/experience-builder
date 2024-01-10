import { DesignTokensDefinition } from '@/types';
import { builtInStyles, optionalBuiltInStyles } from '../definitions/styles';

export const designTokensRegistry: DesignTokensDefinition = {};

/**
 * Register design tokens styling
 * @param designTokenDefinition - {[key:string]: Record<string, string>}
 * @returns void
 */
export const defineDesignTokens = (designTokenDefinition: DesignTokensDefinition) => {
  Object.assign(designTokensRegistry, designTokenDefinition);
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
  const spacingValues = designTokensRegistry[tokenCategory];
  if (spacingValues && spacingValues[tokenName]) {
    return spacingValues[tokenName];
  }
  if (builtInStyles[variableName]) {
    return builtInStyles[variableName].defaultValue;
  }
  if (optionalBuiltInStyles[variableName]) {
    return optionalBuiltInStyles[variableName].defaultValue;
  }
  return '0px';
};
