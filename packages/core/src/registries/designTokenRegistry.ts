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

export const getDesignTokenRegistration = (breakpointValue: string, variableName: string) => {
  if (!breakpointValue) return breakpointValue;

  let resolvedValue = '';
  for (const part of breakpointValue.split(' ')) {
    let tokenValue = '';
    if (variableName === 'cfBorder' && templateStringRegex.test(part)) {
      tokenValue = resolveBorderDesignToken(part);
      const { width, color, style } =
        (tokenValue as unknown as DesignTokensDefinition['borders']) || {
          width: '1px',
          style: 'outside',
          color: 'rgba(0,0,0,1)',
        };
      tokenValue = `${width} ${style} ${color}`;
    } else tokenValue = templateStringRegex.test(part) ? resolveSimpleDesignToken(part) : part;
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

const resolveBorderDesignToken = (templateString: string) => {
  const nonTemplateValue = templateString.replace(templateStringRegex, '$1');
  const designKeys = nonTemplateValue.split('.');
  const designValues = designTokensRegistry[designKeys[0]] as DesignTokensDefinition;
  const resolvedValue = designValues[designKeys[1]] as string;
  return resolvedValue;
};
