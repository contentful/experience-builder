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
<<<<<<< HEAD
    const tokenValue = templateStringRegex.test(part)
      ? resolveSimpleDesignToken(part, variableName)
      : part;
=======
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
>>>>>>> c5cb531 (feat: add cfBorder designTokens resolver)
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

const resolveBorderDesignToken = (templateString: string) => {
  const nonTemplateValue = templateString.replace(templateStringRegex, '$1');
  const designKeys = nonTemplateValue.split('.');
  const designValues = designTokensRegistry[designKeys[0]] as DesignTokensDefinition;
  const resolvedValue = designValues[designKeys[1]] as string;
  return resolvedValue;
};
