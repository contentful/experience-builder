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
  return variableName === 'cfBorder' ? '1px outside rgba(0,0,0,1)' : '0px';
};
