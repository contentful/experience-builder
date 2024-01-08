import { DesignTokensDefinition } from '@/types';

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

export const getDesignTokenRegistration = (breakpointValue: string) => {
  if (!breakpointValue) return breakpointValue;

  let resolvedValue = '';
  for (const part of breakpointValue.split(' ')) {
    const tokenValue = templateStringRegex.test(part) ? resolveSimpleDesignToken(part) : part;
    resolvedValue += `${tokenValue} `;
  }
  // Not trimming would end up with a trailing space that breaks the check in `calculateNodeDefaultHeight`
  return resolvedValue.trim();
};

const resolveSimpleDesignToken = (templateString: string) => {
  const nonTemplateValue = templateString.replace(templateStringRegex, '$1');
  const designKeys = nonTemplateValue.split('.');
  const spacingValues = designTokensRegistry[designKeys[0]] as DesignTokensDefinition;
  const resolvedValue = spacingValues[designKeys[1]] as string;
  return resolvedValue || '0px';
};
